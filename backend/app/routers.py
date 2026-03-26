from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import ThreatData, ThreatIntelligence, MitigationAudit
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()


# ── Pydantic schema for the decide endpoint ──────────────────────────────────
class DecisionInput(BaseModel):
    decision: str  # Block | Monitor | Ignore
    note: Optional[str] = None


# ── 1. Dashboard stats ────────────────────────────────────────────────────────
@router.get("/dashboard/stats")
def get_stats(db: Session = Depends(get_db)):
    total_processed = db.query(ThreatIntelligence).count()

    high_risk = db.query(ThreatIntelligence).filter(
        ThreatIntelligence.risk_score >= 70
    ).count()

    pending_decisions = (
        db.query(ThreatIntelligence)
        .outerjoin(
            MitigationAudit,
            ThreatIntelligence.id == MitigationAudit.threat_intel_id
        )
        .filter(MitigationAudit.id == None)
        .filter(ThreatIntelligence.risk_score >= 40)
        .count()
    )

    blocks_approved = db.query(MitigationAudit).filter(
        MitigationAudit.analyst_decision == "Block"
    ).count()

    classification_breakdown = (
        db.query(
            ThreatIntelligence.classification,
            func.count(ThreatIntelligence.id).label("count")
        )
        .group_by(ThreatIntelligence.classification)
        .all()
    )

    return {
        "total_processed": total_processed,
        "high_risk": high_risk,
        "pending_decisions": pending_decisions,
        "blocks_approved": blocks_approved,
        "classification_breakdown": [
            {"classification": c, "count": n}
            for c, n in classification_breakdown
        ]
    }


# ── 2. Threat feed ────────────────────────────────────────────────────────────
@router.get("/threats")
def get_threats(
    page: int = 1,
    limit: int = 20,
    classification: Optional[str] = None,
    min_score: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ThreatIntelligence)

    if classification:
        query = query.filter(ThreatIntelligence.classification == classification)
    if min_score is not None:
        query = query.filter(ThreatIntelligence.risk_score >= min_score)

    total = query.count()
    records = (
        query
        .order_by(ThreatIntelligence.risk_score.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": [
            {
                "id": str(r.id),
                "ip": r.ip,
                "risk_score": r.risk_score,
                "classification": r.classification,
                "recommendation": r.recommendation,
                "geo_country": r.geo_country,
                "geo_city": r.geo_city,
                "isp": r.isp,
                "abuse_score": r.abuse_score,
                "ai_insight": r.ai_insight,
                "enriched_at": r.enriched_at.isoformat() if r.enriched_at else None,
            }
            for r in records
        ]
    }


# ── 3. HITL queue ─────────────────────────────────────────────────────────────
@router.get("/queue")
def get_queue(db: Session = Depends(get_db)):
    # IPs scored >= 40 that have no decision yet
    decided_ids = db.query(MitigationAudit.threat_intel_id).subquery()

    pending = (
        db.query(ThreatIntelligence)
        .filter(ThreatIntelligence.risk_score >= 40)
        .filter(~ThreatIntelligence.id.in_(decided_ids))
        .order_by(ThreatIntelligence.risk_score.desc())
        .all()
    )

    return {
        "pending_count": len(pending),
        "queue": [
            {
                "id": str(r.id),
                "ip": r.ip,
                "risk_score": r.risk_score,
                "classification": r.classification,
                "recommendation": r.recommendation,
                "ai_insight": r.ai_insight,
                "geo_country": r.geo_country,
                "geo_city": r.geo_city,
                "isp": r.isp,
                "abuse_score": r.abuse_score,
            }
            for r in pending
        ]
    }


# ── 4. Submit decision ────────────────────────────────────────────────────────
@router.post("/queue/{threat_id}/decide")
def submit_decision(
    threat_id: str,
    body: DecisionInput,
    db: Session = Depends(get_db)
):
    if body.decision not in ["Block", "Monitor", "Ignore"]:
        raise HTTPException(
            status_code=400,
            detail="Decision must be Block, Monitor, or Ignore"
        )

    # Check threat exists
    threat = db.query(ThreatIntelligence).filter(
        ThreatIntelligence.id == uuid.UUID(threat_id)
    ).first()

    if not threat:
        raise HTTPException(status_code=404, detail="Threat record not found")

    # Check not already decided
    existing = db.query(MitigationAudit).filter(
        MitigationAudit.threat_intel_id == uuid.UUID(threat_id)
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Decision already recorded")

    audit = MitigationAudit(
        threat_intel_id=uuid.UUID(threat_id),
        ip=threat.ip,
        ai_recommendation=threat.recommendation,
        analyst_decision=body.decision,
        analyst_note=body.note,
    )
    db.add(audit)
    db.commit()

    return {
        "status": "Decision recorded",
        "ip": threat.ip,
        "ai_recommendation": threat.recommendation,
        "analyst_decision": body.decision,
        "note": body.note,
    }


# ── 5. Audit log ──────────────────────────────────────────────────────────────
@router.get("/audit")
def get_audit_log(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    total = db.query(MitigationAudit).count()
    records = (
        db.query(MitigationAudit)
        .order_by(MitigationAudit.decided_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    # Calculate agreement rate
    total_decisions = db.query(MitigationAudit).count()
    agreements = db.query(MitigationAudit).filter(
        MitigationAudit.ai_recommendation == MitigationAudit.analyst_decision
    ).count()

    agreement_rate = round((agreements / total_decisions * 100), 1) if total_decisions > 0 else 0

    return {
        "total": total,
        "agreement_rate": f"{agreement_rate}%",
        "page": page,
        "limit": limit,
        "results": [
            {
                "id": str(r.id),
                "ip": r.ip,
                "ai_recommendation": r.ai_recommendation,
                "analyst_decision": r.analyst_decision,
                "agreed": r.ai_recommendation == r.analyst_decision,
                "note": r.analyst_note,
                "decided_at": r.decided_at.isoformat() if r.decided_at else None,
            }
            for r in records
        ]
    }