export default function Dashboard() {
  const kpiCards = [
    { title: 'Total IPs Analysed', value: '1,284,092', trend: '+12%', icon: 'search', color: 'primary' },
    { title: 'High Risk IPs', value: '432', trend: 'High Alert', icon: 'warning', color: 'error' },
    { title: 'Pending Decisions', value: '28', trend: 'Avg 4m', icon: 'history', color: 'secondary' },
    { title: 'Blocks Approved', value: '14,802', trend: '✓', icon: 'shield', color: 'emerald' },
  ]

  const activityFeed = [
    { ip: '192.168.1.105', risk: 98, status: 'IMMEDIATE_BLOCK', time: 'Just now' },
    { ip: '45.22.190.12', risk: 64, status: 'FLAG_TRAFFIC', time: '12m ago' },
    { ip: '210.88.34.192', risk: 42, status: 'MONITOR', time: '28m ago' },
    { ip: '8.8.8.8', risk: 2, status: 'WHITELIST', time: '1h ago' },
    { ip: '172.217.16.142', risk: 5, status: 'WHITELIST', time: '2h ago' },
  ]

  const getRiskColor = (risk) => {
    if (risk >= 70) return 'bg-red-50 text-error'
    if (risk >= 40) return 'bg-amber-50 text-amber-700'
    return 'bg-emerald-50 text-emerald-700'
  }

  return (
    <div className="pt-24 px-8 pb-12">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Threat Overview</h2>
        <p className="text-on-surface-variant font-medium">Real-time analysis of enterprise perimeter traffic</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-transparent shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${card.color === 'primary' ? 'bg-primary-container text-primary' : card.color === 'error' ? 'bg-red-100 text-error' : card.color === 'secondary' ? 'bg-secondary-container text-on-secondary-container' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center`}>
                <span className="material-symbols-outlined" data-icon={card.icon}>{card.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${card.color === 'error' ? 'text-error bg-red-50' : card.color === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-on-surface-variant bg-slate-100'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold tracking-tight text-on-surface">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Asymmetric Data Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Classification Breakdown */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-on-surface">Classification Breakdown</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">more_vert</span>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Malicious', percent: 12, color: 'bg-error' },
              { label: 'Suspicious', percent: 28, color: 'bg-amber-500' },
              { label: 'Potentially Malicious', percent: 15, color: 'bg-primary' },
              { label: 'Clean', percent: 45, color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-on-surface">{item.label}</span>
                  <span className={item.color.includes('error') ? 'text-error' : item.color.includes('amber') ? 'text-amber-600' : item.color.includes('primary') ? 'text-primary' : 'text-emerald-600'}>
                    {item.percent}%
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-on-surface">Recent Activity Feed</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-50">
                <tr>
                  <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target IP</th>
                  <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Risk Score</th>
                  <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recommendation</th>
                  <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activityFeed.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-mono text-sm text-on-surface">{item.ip}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getRiskColor(item.risk)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.risk}/100
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-surface-container-low rounded text-xs font-semibold text-on-surface">{item.status}</span>
                    </td>
                    <td className="py-4 text-right text-xs text-on-surface-variant font-medium">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
