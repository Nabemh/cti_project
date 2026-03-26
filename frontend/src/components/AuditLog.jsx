export default function AuditLog() {
  const logs = [
    {
      ip: '192.168.4.122',
      aiRecommendation: 'BLOCK',
      analystDecision: 'BLOCK',
      agreed: true,
      note: 'Identified as known botnet origin IP.',
      timestamp: 'Oct 24, 14:22:01',
    },
    {
      ip: '45.22.110.15',
      aiRecommendation: 'QUARANTINE',
      analystDecision: 'ALLOW',
      agreed: false,
      note: 'False positive: Valid partner API traffic.',
      timestamp: 'Oct 24, 14:18:55',
    },
    {
      ip: '104.244.42.1',
      aiRecommendation: 'BLOCK',
      analystDecision: 'BLOCK',
      agreed: true,
      note: 'Confirmed DDoS attempt matching patterns.',
      timestamp: 'Oct 24, 13:45:12',
    },
    {
      ip: '198.51.100.42',
      aiRecommendation: 'ALLOW',
      analystDecision: 'ALLOW',
      agreed: true,
      note: 'Low risk profiling, routine scan only.',
      timestamp: 'Oct 24, 13:12:08',
    },
    {
      ip: '203.0.113.88',
      aiRecommendation: 'BLOCK',
      analystDecision: 'BLOCK',
      agreed: true,
      note: 'SQL injection signature detected by probe.',
      timestamp: 'Oct 24, 12:59:44',
    },
    {
      ip: '172.16.254.1',
      aiRecommendation: 'ALLOW',
      analystDecision: 'QUARANTINE',
      agreed: false,
      note: 'Manual investigation of unusual traffic volume.',
      timestamp: 'Oct 24, 12:45:30',
    },
  ]

  const getRecommendationColor = (rec) => {
    if (rec === 'BLOCK') return 'bg-error-container/20 text-error'
    if (rec === 'ALLOW') return 'bg-blue-100 text-blue-700'
    return 'bg-secondary-container text-on-secondary-container'
  }

  const getStatusColor = (ip) => {
    if (ip === '192.168.4.122' || ip === '104.244.42.1' || ip === '203.0.113.88') return 'bg-error'
    return 'bg-blue-400'
  }

  return (
    <div className="pt-24 px-8 pb-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <nav className="flex gap-2 text-xs font-label text-on-surface-variant mb-2">
            <span>Admin</span>
            <span>/</span>
            <span className="text-primary font-semibold">Audit Logs</span>
          </nav>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight">Audit Log</h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">Review historical decision patterns and reconcile automated AI recommendations with human expert manual overrides.</p>
        </div>
        {/* Hero Metric Card */}
        <div className="bg-surface-container-lowest p-6 rounded-full ghost-border flex items-center gap-6 shadow-sm">
          <div className="text-right">
            <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">AI vs Analyst Agreement</p>
            <p className="text-4xl font-extrabold font-headline text-primary mt-1">94.2%</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 flex items-center justify-center relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-blue-50" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
              <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset="10.2" strokeWidth="4"></circle>
            </svg>
            <span className="material-symbols-outlined absolute text-primary" data-icon="handshake">handshake</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface-container-lowest ghost-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span>
            Filter By Date
          </button>
          <button className="px-4 py-2 bg-surface-container-lowest ghost-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm" data-icon="category">category</span>
            Decision Type
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" data-icon="download">download</span>
          </button>
          <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" data-icon="print">print</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-full ghost-border overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-surface-container-high">
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider">Origin IP</th>
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider">AI Recommendation</th>
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider">Analyst Decision</th>
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider text-center">Agreed</th>
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider">Decision Note</th>
              <th className="px-6 py-4 text-xs font-bold font-label text-on-surface-variant uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(log.ip)}`}></span>
                    <code className="text-sm font-mono text-on-surface">{log.ip}</code>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getRecommendationColor(log.aiRecommendation)}`}>
                    {log.aiRecommendation}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getRecommendationColor(log.analystDecision)}`}>
                    {log.analystDecision}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {log.agreed ? <span style={{ color: '#0c56d0' }}>check_circle</span> : <span style={{ color: '#9f403d' }}>cancel</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{log.note}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="bg-surface-container-low/50 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-on-surface-variant font-medium">Showing 1-6 of 1,248 logs</span>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg">1</button>
            <button className="px-3 py-1 hover:bg-surface-container-high text-sm font-bold rounded-lg transition-colors">2</button>
            <button className="px-3 py-1 hover:bg-surface-container-high text-sm font-bold rounded-lg transition-colors">3</button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="px-3 py-1 hover:bg-surface-container-high text-sm font-bold rounded-lg transition-colors">125</button>
            <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
