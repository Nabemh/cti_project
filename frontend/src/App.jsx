import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopAppBar from './components/TopAppBar'
import Dashboard from './components/Dashboard'
import ThreatFeed from './components/ThreatFeed'
import MitigationQueue from './components/MitigationQueue'
import AuditLog from './components/AuditLog'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'threat-feed':
        return <ThreatFeed />
      case 'mitigation-queue':
        return <MitigationQueue />
      case 'audit-log':
        return <AuditLog />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="ml-64 flex-1 flex flex-col">
        <TopAppBar />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
