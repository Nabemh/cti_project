import { useState } from 'react'

export default function MitigationQueue() {
  const [cards, setCards] = useState([
    {
      ip: '192.168.1.144',
      risk: 94,
      classification: 'High-Frequency Brute Force',
      country: 'Netherlands',
      isp: 'Leaseweb B.V.',
      insight: 'Unusual traffic spike detected from this IP targeting the Auth-v2 endpoint. Request patterns align with known "Mirai" variant fingerprints. 4,200 failed attempts within 120 seconds.',
    },
    {
      ip: '45.22.109.12',
      risk: 68,
      classification: 'Anomalous API Scrape',
      country: 'United States',
      isp: 'Amazon Data Services',
      insight: 'Systematic traversal of public schema detected. While the requests are valid, the velocity suggests automated data extraction rather than human navigation. Origin matches known AWS egress nodes.',
    },
    {
      ip: '210.34.55.91',
      risk: 81,
      classification: 'SQL Injection Attempt',
      country: 'China',
      isp: 'CHINANET-JS',
      insight: 'Payload contains encoded SQL syntax aimed at secondary database hooks. 12 attempts blocked by WAF. Source IP is currently listed on 3 global blacklists for credential stuffing.',
    },
  ])

  const handleAction = (index) => {
    setCards(cards.filter((_, i) => i !== index))
  }

  const getRiskColor = (risk) => {
    if (risk >= 70) return 'text-error'
    return 'text-primary'
  }

  if (cards.length === 0) {
    return (
      <div className="pt-24 px-8 pb-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
          <h3 className="text-2xl font-bold font-headline mb-2">No pending threats — system is stable.</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto">The autonomous mitigation layer has resolved all recent anomalies. You&apos;re all caught up for now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
              <span>Analysis</span>
              <span className="material-symbols-outlined text-[12px]" data-icon="chevron_right">chevron_right</span>
              <span className="text-primary font-bold">Mitigation Queue</span>
            </nav>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Queue Management</h2>
            <p className="text-on-surface-variant mt-2 max-w-lg">Review and address high-risk network anomalies detected by the autonomous shielding layer.</p>
          </div>
          <div className="bg-surface-container-lowest ghost-border rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-medium text-on-surface-variant">Active Filters:</span>
            <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Critical</span>
            <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Botnet</span>
          </div>
        </div>

        {/* Mitigation Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="group bg-surface-container-lowest rounded-full p-1 ghost-border hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="bg-surface-container-lowest rounded-[calc(0.75rem-2px)] p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface mb-1">{card.ip}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" data-icon="public">public</span>
                        {card.country}
                      </span>
                      <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" data-icon="dns">dns</span>
                        {card.isp}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-error uppercase tracking-tighter mb-1">Risk Score</p>
                    <p className={`text-4xl font-extrabold font-headline leading-none ${getRiskColor(card.risk)}`}>{card.risk}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container mb-3">
                    <span className="material-symbols-outlined text-sm mr-1" data-icon="warning">warning</span>
                    {card.classification}
                  </span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    AI Insight: {card.insight}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <button 
                    onClick={() => handleAction(idx)}
                    className="flex-1 py-3 px-4 bg-error text-on-error rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-error-dim transition-colors"
                  >
                    <span className="material-symbols-outlined text-base" data-icon="block">block</span>
                    Block Node
                  </button>
                  <button 
                    onClick={() => handleAction(idx)}
                    className="flex-1 py-3 px-4 bg-tertiary-container text-on-tertiary-container rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-tertiary-dim hover:text-on-tertiary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base" data-icon="visibility">visibility</span>
                    Monitor
                  </button>
                  <button 
                    onClick={() => handleAction(idx)}
                    className="w-12 h-12 flex items-center justify-center bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-base" data-icon="close">close</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
