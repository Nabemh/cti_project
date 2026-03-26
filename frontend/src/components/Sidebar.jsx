export default function Sidebar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'threat-feed', label: 'Threat Feed', icon: 'security' },
    { id: 'mitigation-queue', label: 'Mitigation Queue', icon: 'playlist_add_check' },
    { id: 'audit-log', label: 'Audit Log', icon: 'history' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 flex flex-col py-8 px-4 z-50">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-headline">ShieldAnalytics</h2>
        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mt-1">Enterprise Security</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activePage === item.id
                ? 'text-blue-600 dark:text-blue-400 font-bold border-r-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined" data-icon={item.icon}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <button className="w-full py-3 px-4 bg-primary-gradient text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95">
          Report Incident
        </button>
        <div className="mt-6 flex items-center gap-3 px-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdO4Ibck3g-y7i26rSvLxnSPVqFiO4JPpOmS_zzjY_fMUWhU6W3bq_-tJ4klLffAs8UJfsNaRnJraFPQXV2YK5n-F3unlK32k8k-zRxLkUMAYk-JxBx7cpmk8ss5-YOGKmpK9Z4cR4IMGzATb3XXwqQGM524eLw_CwKjpB9YsXHArAVJ0wO0Z93mve2_1jwbAAzSI6D8Pyr-rYTTBsNvtelLGR4ZMYoC8WuawF-X81LR-58cSj0bgoKLrjRPGOVP_qby3qBIVH4NY"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-bold text-on-surface">Alex Chen</p>
            <p className="text-xs text-on-surface-variant">Lead Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
