// API Service Layer - handles all backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  // Dashboard stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`)
    if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    return res.json()
  },

  // Threat Feed
  async getThreats(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(filters.classification && { classification: filters.classification }),
      ...(filters.minScore !== undefined && { min_score: filters.minScore }),
    })
    const res = await fetch(`${API_BASE_URL}/threats?${params}`)
    if (!res.ok) throw new Error('Failed to fetch threats')
    return res.json()
  },

  // Mitigation Queue
  async getQueue() {
    const res = await fetch(`${API_BASE_URL}/queue`)
    if (!res.ok) throw new Error('Failed to fetch queue')
    return res.json()
  },

  // Submit Decision
  async submitDecision(threatId, decision, note = null) {
    const res = await fetch(`${API_BASE_URL}/queue/${threatId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, note }),
    })
    if (!res.ok) throw new Error('Failed to submit decision')
    return res.json()
  },

  // Audit Log
  async getAuditLog(page = 1, limit = 20) {
    const params = new URLSearchParams({ page, limit })
    const res = await fetch(`${API_BASE_URL}/audit?${params}`)
    if (!res.ok) throw new Error('Failed to fetch audit log')
    return res.json()
  },

  // Trigger Agent
  async triggerAgent() {
    const res = await fetch(`${API_BASE_URL}/run-agent`, { method: 'GET' })
    if (!res.ok) throw new Error('Failed to trigger agent')
    return res.json()
  },
}
