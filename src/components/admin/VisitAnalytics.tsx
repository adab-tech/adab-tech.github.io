'use client'

import { useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { adminServer } from '@/lib/github-publish'

type Totals = { visits: number; pageViews: number }
type Snapshot = { through: string; day: Totals; week: Totals }
type AnalyticsState = { loading: true } | { loading: false; data: Snapshot } | { loading: false; error: string }

export function VisitAnalytics() {
  const [state, setState] = useState<AnalyticsState>({ loading: true })
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let active = true
    adminServer<Snapshot>('analytics')
      .then((data) => {
        if (active) setState({ loading: false, data })
      })
      .catch((error: unknown) => {
        if (active) setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Visit numbers are unavailable.',
        })
      })
    return () => { active = false }
  }, [refresh])

  const data = !state.loading && 'data' in state ? state.data : null
  const error = !state.loading && 'error' in state ? state.error : null

  return (
    <section aria-labelledby="visit-analytics-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="visit-analytics-title" className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gold-500" aria-hidden="true" />
          Site traffic
        </h2>
        <button
          type="button"
          disabled={state.loading}
          onClick={() => {
            setState({ loading: true })
            setRefresh((value) => value + 1)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-200 hover:border-gold-500/60 disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </button>
      </div>
      <div aria-live="polite" aria-busy={state.loading}>
        {state.loading && <p className="text-sm text-zinc-400">Loading Cloudflare Analytics…</p>}
        {error && <p className="rounded-xl border border-zinc-800 p-4 text-sm text-zinc-300">{error}</p>}
        {data && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {([['Past 24 hours', data.day], ['Past 7 days', data.week]] as const).map(([period, totals]) => (
                <div key={period} className="rounded-xl border border-zinc-800 bg-midnight-900 p-4">
                  <h3 className="mb-3 text-sm font-medium text-zinc-200">{period}</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-zinc-400">Visits</dt>
                      <dd className="font-mono text-2xl text-zinc-50">{totals.visits.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-400">Page views</dt>
                      <dd className="font-mono text-2xl text-zinc-50">{totals.pageViews.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Estimated from Cloudflare traffic to public HTML pages on adamu.tech. Visits count entries to the site and may include repeat visitors.
              {' '}Updated <time dateTime={data.through}>{new Date(data.through).toLocaleString()}</time>.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
