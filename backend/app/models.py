from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime
from app.database import Base
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

class ThreatData(Base):
    __tablename__ = "threat_data"

    id = Column(Integer, primary_key=True)
    ip = Column(String)
    port = Column(String)
    protocol = Column(String)
    asn = Column(String)
    asnname = Column(String)
    country = Column(String)
    city = Column(String)
    region = Column(String)
    type = Column(String)
    category = Column(String)
    infection = Column(String)
    eventdate = Column(String)
    priority = Column(String)
    processed = Column(Boolean, default=False)


class ThreatIntelligence(Base):
    __tablename__ = "threat_intelligence"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ip_log_id = Column(Integer, nullable=False, index=True)
    ip = Column(String, nullable=False, index=True)
    risk_score = Column(Integer, nullable=False)
    classification = Column(String, nullable=False)
    ai_insight = Column(Text, nullable=False)
    recommendation = Column(String, nullable=False)
    abuse_score = Column(Integer, nullable=True)
    geo_country = Column(String, nullable=True)
    geo_city = Column(String, nullable=True)
    isp = Column(String, nullable=True)
    enriched_at = Column(DateTime, default=datetime.utcnow)


class MitigationAudit(Base):
    __tablename__ = "mitigation_audit"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    threat_intel_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    ip = Column(String, nullable=False)
    ai_recommendation = Column(String, nullable=False)
    analyst_decision = Column(String, nullable=False)
    analyst_note = Column(Text, nullable=True)
    decided_at = Column(DateTime, default=datetime.utcnow)