'use client'

import React, { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

// Page views via CounterAPI (free, no cookies). Public pages count one view
// per browser session (<PageViewPing/> in GlobalShell); the admin only reads
// the number, so your own admin visits aren't counted.
const COUNTER = 'https://api.counterapi.dev/v1/adamu-tech/pageviews'
const SESSION_KEY = 'adamu_tech_session_hit'

export function PageViewPing() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      return
    }
    fetch(`${COUNTER}/up`, { cache: 'no-store' }).catch(() => {})
  }, [])
  return null
}

export function VisitorCounter({ showDetails = false }: { showDetails?: boolean }) {
  const [count, setCount] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${COUNTER}/`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return
        if (typeof data?.count === 'number') setCount(data.count)
        else setFailed(true)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [])

  const value = count !== null ? count.toLocaleString() : failed ? 'unavailable' : '…'

  if (showDetails) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0E1526] shadow-sm space-y-1 max-w-sm">
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          <span>Visits to the public site</span>
        </div>
        <div className="text-2xl font-mono font-bold text-zinc-50">{value}</div>
        <p className="text-[11px] text-zinc-400">One per browser session, counted since the counter started. Admin pages are not counted.</p>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-800 bg-[#0E1526] font-mono text-[11px] text-zinc-300 shadow-sm">
      <Eye className="h-3 w-3 text-amber-400" />
      <span><strong>{value}</strong> visits</span>
    </div>
  )
}
