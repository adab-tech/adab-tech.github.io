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
          <Eye className="h-3.5 w-3.5 text-gold-500" />
          <span>Visits to the public site</span>
        </div>
        <div className="text-2xl font-mono font-bold text-zinc-50">{value}</div>
        <p className="text-xs lg:text-[11px] text-zinc-400">One per browser session, counted since the counter started. Admin pages are not counted.</p>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-800 bg-[#0E1526] font-mono text-xs lg:text-[11px] text-zinc-300 shadow-sm">
      <Eye className="h-3 w-3 text-gold-500" />
      <span><strong>{value}</strong> visits</span>
    </div>
  )
}

// Per-post reads, same CounterAPI namespace as page views. A read is counted
// once per browser session per post, when the visitor has scrolled halfway
// through the page or stayed 30 seconds, so bounces don't count.
const readCounter = (slug: string) => `https://api.counterapi.dev/v1/adamu-tech/r-${slug.slice(0, 48)}`

export function PostReadPing({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `adamu_tech_read_${slug}`
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      return
    }
    let done = false
    const hit = () => {
      if (done) return
      done = true
      try {
        sessionStorage.setItem(key, '1')
      } catch {}
      fetch(`${readCounter(slug)}/up`, { cache: 'no-store' }).catch(() => {})
      cleanup()
    }
    const onScroll = () => {
      const seen = window.scrollY + window.innerHeight
      if (seen >= document.documentElement.scrollHeight * 0.5) hit()
    }
    const timer = window.setTimeout(hit, 30000)
    window.addEventListener('scroll', onScroll, { passive: true })
    const cleanup = () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
    return cleanup
  }, [slug])
  return null
}

export function PostReadCount({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${readCounter(slug)}/`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : r.status === 400 || r.status === 404 ? { count: 0 } : Promise.reject(new Error(String(r.status)))))
      .then((data) => !cancelled && typeof data?.count === 'number' && setCount(data.count))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug])

  if (count === null) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs lg:text-[10px] text-zinc-400" title="Reads (one per session, halfway or 30 s)">
      <Eye className="h-3 w-3 text-gold-500" />
      {count.toLocaleString()}
    </span>
  )
}
