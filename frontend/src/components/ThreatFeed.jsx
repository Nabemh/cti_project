import { useState } from 'react'

export default function ThreatFeed() {
  const [expandedRow, setExpandedRow] = useState(null)

  const threats = [
    {
      ip: '185.234.12.88',
      risk: 92,
      classification: 'Botnet C&C',
      country: '🇳🇱 Netherlands',
      isp: 'Digital Ocean, LLC',
      recommendation: 'Block Inbound',
      insight: 'This IP has been correlated with "Operation Storm-332" targeting financial endpoints. Traffic patterns suggest a mirrored-packet exfiltration attempt.',
    },
    {
      ip: '45.112.55.201',
      risk: 54,
      classification: 'SSH Brute Force',
      country: '🇨🇳 China',
      isp: 'CHINANET-BACKBONE',
      recommendation: 'Rate Limit',
      insight: 'Multiple failed login attempts detected over the past hour. Source IP is in automated scanning mode.',
    },
    {
      ip: '102.14.99.3',
      risk: 12,
      classification: 'VPN Exit Node',
      country: '🇺🇸 USA',
      isp: 'Comcast Cable',
      recommendation: 'Monitor Only',
      insight: 'Legitimate VPN service provider. Low risk profile but worth monitoring for unusual patterns.',
    },
    {
      ip: '203.0.113.45',
      risk: 88,
      classification: 'Malware C2',
      country: '🇷🇺 Russia',
      isp: 'Selectel Lab',
      recommendation: 'Hard Deny',
      insight: 'Command and control server for known malware family. Immediate block recommended.',
    },
  ]

  const getRiskColor = (risk) => {
    if (risk >= 70) return 'bg-error-container text-error-dim'
    if (risk >= 40) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const getRiskLabel = (risk) => {
    if (risk >= 70) return 'High'
    if (risk >= 40) return 'Medium'
    return 'Low'
  }

  return (
    <div className="pt-20 px-8 pb-12 max-w-7xl mx-auto">
      <div className="mb-10 mt-6">
        <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Threat Feed</h1>
        <p className="text-on-surface-variant mt-2 text-lg">Real-time telemetry and heuristic classification of network anomalies.</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-surface-container-low p-6 rounded-xl flex flex-wrap items-end gap-6 mb-8">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Classification</label>
          <select className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium">
            <option>All Classifications</option>
            <option>Botnet Activity</option>
            <option>DDoS Source</option>
            <option>Brute Force</option>
            <option>Malware Distribution</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Min Risk Score</label>
          <input className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium" placeholder="0-100" type="number"/>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">IP Address Search</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg" data-icon="fingerprint">fingerprint</span>
            <input className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 text-on-surface font-medium" placeholder="185.234.x.x" type="text"/>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
          Apply Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/50">
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">IP Address</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Risk Score</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Classification</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Country</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">ISP</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Recommendation</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {threats.map((threat, idx) => (
              <tbody key={idx}>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono text-sm font-semibold text-primary">{threat.ip}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 ${getRiskColor(threat.risk)} rounded-full text-[10px] font-bold uppercase tracking-tight`}>
                      {getRiskLabel(threat.risk)} ({threat.risk})
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">{threat.classification}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{threat.country.split(' ')[0]}</span>
                      <span className="text-on-surface-variant">{threat.country.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">{threat.isp}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-bold text-on-secondary-container">{threat.recommendation}</span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                      className="p-1 hover:bg-primary-container rounded-lg text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined" data-icon="expand_more">expand_more</span>
                    </button>
                  </td>
                </tr>
                {expandedRow === idx && (
                  <tr className="bg-primary/5">
                    <td colSpan="7" className="px-8 py-6">
                      <div className="flex gap-6 items-start">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-primary/10">
                          <span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface font-headline mb-1">AI Intelligence Insight</h4>
                          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">{threat.insight}</p>
                          <div className="mt-4 flex gap-3">
                            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                              View Cluster Map <span className="material-symbols-outlined text-xs" data-icon="arrow_outward">arrow_outward</span>
                            </button>
                            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                              Download Log Snippet <span className="material-symbols-outlined text-xs" data-icon="download">download</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/30">
          <p className="text-xs font-medium text-on-surface-variant">Showing <span className="text-on-surface">1-4</span> of <span className="text-on-surface">1,248</span> active threats</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-outline-variant/30 rounded-lg text-xs font-bold hover:bg-white transition-all">Previous</button>
            <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
