import httpx
import os
from dotenv import load_dotenv

load_dotenv()

ABUSEIPDB_KEY = os.getenv("ABUSEIPDB_KEY")
IPINFO_TOKEN = os.getenv("IPINFO_TOKEN")


async def get_abuseipdb(ip: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.abuseipdb.com/api/v2/check",
                headers={"Key": ABUSEIPDB_KEY, "Accept": "application/json"},
                params={"ipAddress": ip, "maxAgeInDays": 90},
                timeout=5,
            )
            data = response.json().get("data", {})
            return {
                "abuse_score": data.get("abuseConfidenceScore", 0),
                "isp": data.get("isp", "Unknown"),
                "usage_type": data.get("usageType", "Unknown"),
                "total_reports": data.get("totalReports", 0),
            }
    except Exception:
        return {"abuse_score": 0, "isp": "Unknown", "usage_type": "Unknown", "total_reports": 0}


async def get_ipinfo(ip: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://ipinfo.io/{ip}/json",
                headers={"Authorization": f"Bearer {IPINFO_TOKEN}"},
                timeout=5,
            )
            data = response.json()
            return {
                "geo_country": data.get("country", "Unknown"),
                "geo_city": data.get("city", "Unknown"),
                "isp": data.get("org", "Unknown"),
                "hostname": data.get("hostname", "Unknown"),
            }
    except Exception:
        return {"geo_country": "Unknown", "geo_city": "Unknown", "isp": "Unknown", "hostname": "Unknown"}


async def enrich_ip(ip: str) -> dict:
    abuse = await get_abuseipdb(ip)
    ipinfo = await get_ipinfo(ip)

    return {
        "abuse_score": abuse["abuse_score"],
        "total_reports": abuse["total_reports"],
        "usage_type": abuse["usage_type"],
        "geo_country": ipinfo["geo_country"],
        "geo_city": ipinfo["geo_city"],
        "isp": ipinfo["isp"],
        "hostname": ipinfo["hostname"],
    }