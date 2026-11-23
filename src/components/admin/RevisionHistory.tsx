'use client'

import { useState } from 'react'
import { History, Loader2 } from 'lucide-react'
import { listContentRevisions, type ContentRevision } from '@/lib/github-publish'

export function RevisionHistory({ path, disabled, onRestore }: {
  path: string
  disabled: boolean
  onRestore: (revision: ContentRevision) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [revisions, setRevisions] = useState<ContentRevision[]>([])
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState('')
  const [error, setError] = useState('')

  async function toggle() {
    setOpen(!open)
    if (open) return
    setLoading(true)
    setError('')
    try {
      setRevisions(await listContentRevisions(path))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load version history.')
    } finally {
      setLoading(false)
    }
  }

  async function restore(revision: ContentRevision) {
    setRestoring(revision.sha)
    setError('')
    try {
      await onRestore(revision)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this version.')
    } finally {
      setRestoring('')
    }
  }

  const busy = loading || !!restoring
  return (
    <div className="space-y-3">
      <button type="button" disabled={disabled || busy} aria-expanded={open} onClick={toggle}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-200 hover:border-gold-500 disabled:opacity-50">
        <History className="h-4 w-4" /> Version history
      </button>
      {open && (
        <section aria-label="Version history" className="space-y-3 rounded-xl border border-zinc-800 bg-[#0B1120] p-4">
          <p className="text-xs text-zinc-400">Load a previous version into the editor, then preview and publish it when ready.</p>
          {loading && <p role="status" className="flex items-center gap-2 text-xs text-zinc-400"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading versions…</p>}
          {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
          {!loading && !error && revisions.length === 0 && <p className="text-xs text-zinc-400">No versions found.</p>}
          {!loading && (
            <ul className="space-y-2">
              {revisions.map((revision) => (
                <li key={revision.sha} className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-2">
                  <div className="min-w-0">
                    <p className="break-words text-xs text-zinc-200">{revision.title}</p>
                    <p className="text-xs text-zinc-400">
                      <time dateTime={revision.date}>{new Date(revision.date).toLocaleString()}</time>
                      {revision.deployed && <span className="ml-2 text-emerald-300">Deployed</span>}
                    </p>
                  </div>
                  <button type="button" disabled={disabled || busy} onClick={() => restore(revision)}
                    aria-label={`Load version from ${new Date(revision.date).toLocaleString()}`}
                    className="min-h-11 rounded px-2 py-1 text-xs text-gold-400 hover:bg-gold-500/10 disabled:opacity-50">
                    {restoring === revision.sha ? 'Loading…' : 'Load version'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
