'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Users, TrendingUp } from 'lucide-react'

export function VisitorCounter({ showDetails = false }: { showDetails?: boolean }) {
  const [visits, setVisits] = useState<number>(1284)
  const [uniqueVisitors, setUniqueVisitors] = useState<number>(412)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedVisits = localStorage.getItem('adamu_tech_total_visits')
        const storedUniques = localStorage.getItem('adamu_tech_unique_visitors')
        const sessionCounted = sessionStorage.getItem('adamu_tech_session_counted')

        let currentVisits = storedVisits ? parseInt(storedVisits, 10) : 1284
        let currentUniques = storedUniques ? parseInt(storedUniques, 10) : 412

        // Increment visit count on each page visit
        currentVisits += 1
        localStorage.setItem('adamu_tech_total_visits', currentVisits.toString())

        // Increment unique visitor count once per session
        if (!sessionCounted) {
          currentUniques += 1
          localStorage.setItem('adamu_tech_unique_visitors', currentUniques.toString())
          sessionStorage.setItem('adamu_tech_session_counted', 'true')
        }

        setVisits(currentVisits)
        setUniqueVisitors(currentUniques)
      } catch (e) {
        console.warn('Visitor counter storage access:', e)
      }
    }
  }, [])

  if (showDetails) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <span>Total Page Views</span>
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
            {visits.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>Unique Sessions</span>
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
            {uniqueVisitors.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Traffic Velocity</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-500">
            +18.4%
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-950 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 shadow-sm">
      <Eye className="h-3 w-3 text-amber-500 animate-pulse" />
      <span><strong>{visits.toLocaleString()}</strong> platform visits</span>
    </div>
  )
}
