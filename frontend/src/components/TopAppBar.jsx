export default function TopAppBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-semibold font-headline text-on-surface">Security Command Center</h1>
        <nav className="hidden md:flex gap-6">
          <a className="text-blue-600 font-bold text-base font-medium transition-all cursor-pointer hover:text-blue-700" href="#">Global View</a>
          <a className="text-slate-600 dark:text-slate-400 text-base font-medium hover:text-blue-500 transition-all cursor-pointer" href="#">System Status</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Search IPs or Logs..." type="text"/>
        </div>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
        <button className="ml-2 px-4 py-2 bg-surface-container-high text-on-secondary-container rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors">
          Deploy Patch
        </button>
      </div>
    </header>
  )
}
