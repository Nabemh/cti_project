import asyncio
import json
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import ThreatData, ThreatIntelligence
from app.enrichment import enrich_ip
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def build_prompt(log: ThreatData, enrichment: dict) -> str:
    return f"""
You are a SOC analyst reviewing threat intelligence data. Analyse the following IP and return ONLY a valid JSON object, no markdown, no explanation.

IP Data:
- IP Address: {log.ip}
- Port: {log.port}
- Protocol: {log.protocol}
- Threat Type: {log.type}
- Category: {log.category}
- Infection/Malware Family: {log.infection}
- ASN: {log.asn} ({log.asnname})
- Country (from log): {log.country}
- Priority: {log.priority}

Enrichment Data:
- Abuse Confidence Score: {enrichment['abuse_score']}/100
- Total Abuse Reports: {enrichment['total_reports']}
- Usage Type: {enrichment['usage_type']}
- Geo Country: {enrichment['geo_country']}
- Geo City: {enrichment['geo_city']}
- ISP: {enrichment['isp']}
- Hostname: {enrichment['hostname']}

Return this exact JSON structure:
{{
  "risk_score": <integer 0-100>,
  "classification": "<Malicious | Suspicious | Potentially Malicious | Clean>",
  "insight": "<2-3 sentences explaining why this IP is risky or safe, referencing the data above>",
  "recommendation": "<Block | Monitor | Ignore>"
}}

Rules:
- risk_score >= 70 must have recommendation Block
- risk_score 40-69 must have recommendation Monitor
- risk_score < 40 must have recommendation Ignore
- Never recommend blocking 8.8.8.8, 1.1.1.1, or other known public DNS resolvers
"""


async def process_single(log: ThreatData, db: Session):
    try:
        # Step 1: Enrich
        enrichment = await enrich_ip(log.ip)

        # Step 2: Build prompt and call Gemini
        prompt = build_prompt(log, enrichment)
        response = model.generate_content(prompt)

        # Step 3: Parse Gemini response
        raw = response.text.strip()
        # Strip markdown code blocks if Gemini adds them anyway
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())

        # Step 4: Write to threat_intelligence
        intel = ThreatIntelligence(
            ip_log_id=log.id,
            ip=log.ip,
            risk_score=result["risk_score"],
            classification=result["classification"],
            ai_insight=result["insight"],
            recommendation=result["recommendation"],
            abuse_score=enrichment["abuse_score"],
            geo_country=enrichment["geo_country"],
            geo_city=enrichment["geo_city"],
            isp=enrichment["isp"],
        )
        db.add(intel)

        # Step 5: Mark as processed
        log.processed = True
        db.commit()

        print(f"[✓] {log.ip} → {result['classification']} (Score: {result['risk_score']}) → {result['recommendation']}")

    except Exception as e:
        print(f"[✗] Failed on {log.ip}: {e}")
        db.rollback()


async def run_agent():
    db = SessionLocal()
    try:
        # Fetch unprocessed records in batches of 10
        logs = (
            db.query(ThreatData)
            .filter(ThreatData.processed == False)
            .limit(10)
            .all()
        )

        if not logs:
            print("[—] No unprocessed records found.")
            return

        print(f"[→] Processing {len(logs)} records...")
        for log in logs:
            await process_single(log, db)
            await asyncio.sleep(1)  # gentle rate limiting

    finally:
        db.close()