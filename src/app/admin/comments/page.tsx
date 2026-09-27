'use client'

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ExternalLink, KeyRound, Loader2, MessageSquare, RefreshCw, Reply, Trash2 } from 'lucide-react'
import { AdminHeader } from '@/components/AdminHeader'
import { useAdminAuth } from '@/lib/auth'
import { COMMENTS_API, GISCUS, hcbEnabled } from '@/config/blog'
import { adminApprove, adminDelete, adminList, adminReply, type AdminComment } from '@/lib/comments-api'

// Moderation for the site's own comment service. The admin key is the
// COMMENTS_ADMIN_KEY secret chosen when the service was deployed; it is kept
// in this browser only.
const KEY = 'adamu_tech_comments_admin_key'
const KEY_EVENT = 'adamu-comments-key-change'
const readKey = () => {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener(KEY_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(KEY_EVENT, cb)
  }
}
const setKey = (k: string) => {
  if (k) localStorage.setItem(KEY, k)
  else localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(KEY_EVENT))
}

const field =
  'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500'

export default function AdminCommentsPage() {
  const { isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const key = useSyncExternalStore(subscribe, readKey, () => '')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/admin/login/')
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">Verifying session…</div>
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100 flex flex-col font-sans">
      <AdminHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Link href="/admin/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-mono font-bold text-zinc-50">Blog comments</h1>
            <p className="text-sm text-zinc-400">
              {COMMENTS_API
                ? 'Approve comments before they appear on the site, reply as the author, or delete.'
                : 'See, reply to and delete readers’ comments on each post.'}
            </p>
          </div>
          {COMMENTS_API && key && (
            <button type="button" onClick={() => setKey('')} className="text-xs font-mono text-zinc-400 hover:text-red-300 inline-flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> Forget key on this device
            </button>
          )}
        </div>
        {COMMENTS_API ? (
          key ? <Moderation adminKey={key} /> : <KeyForm />
        ) : hcbEnabled() ? (
          <HcbGuide />
        ) : (
          <p className="p-4 rounded-xl border border-zinc-800 bg-[#0B1120] text-sm text-zinc-300">
            Comments use giscus (GitHub Discussions). Moderate them in the{' '}
            <a className="text-amber-400 underline" href={`https://github.com/${GISCUS.repo}/discussions`} target="_blank" rel="noreferrer">
              repository’s Discussions
            </a>
            .
          </p>
        )}
      </main>
    </div>
  )
}

function KeyForm() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const connect = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    try {
      await adminList(value.trim(), 'pending')
      setKey(value.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setChecking(false)
    }
  }
  return (
    <form onSubmit={connect} className="p-5 rounded-xl border border-zinc-800 bg-[#0B1120] space-y-3 max-w-xl">
      <p className="text-sm text-zinc-300">Enter the comments admin key (the COMMENTS_ADMIN_KEY you chose). It stays in this browser.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="password" className={field} value={value} onChange={(e) => setValue(e.target.value)} aria-label="Comments admin key" required />
        <button type="submit" disabled={checking} className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 disabled:opacity-50 inline-flex items-center gap-2 justify-center">
          {checking && <Loader2 className="h-4 w-4 animate-spin" />} Connect
        </button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </form>
  )
}

function Moderation({ adminKey }: { adminKey: string }) {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [items, setItems] = useState<AdminComment[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<number | null>(null)
  const [replyTo, setReplyTo] = useState<AdminComment | null>(null)
  const [reply, setReply] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setItems(await adminList(adminKey, tab))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [adminKey, tab])

  useEffect(() => {
    let cancelled = false
    adminList(adminKey, tab)
      .then((c) => !cancelled && setItems(c))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
    }
  }, [adminKey, tab])

  const act = async (id: number, fn: () => Promise<unknown>, done: string) => {
    setBusy(id)
    setNotice('')
    try {
      await fn()
      setNotice(done)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyTo || !reply.trim()) return
    await act(replyTo.id, () => adminReply(adminKey, replyTo.post, reply.trim()), 'Reply published.')
    setReply('')
    setReplyTo(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(['pending', 'approved'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setItems(null)
              setTab(t)
            }}
            aria-pressed={tab === t}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${tab === t ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {t === 'pending' ? 'Waiting for approval' : 'Published'}
          </button>
        ))}
        <button type="button" onClick={load} className="ml-auto p-1.5 text-zinc-400 hover:text-amber-400" aria-label="Reload">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      {notice && <p className="text-sm text-emerald-300">{notice}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      {items === null && !error && <p className="text-sm text-zinc-400">Loading…</p>}
      {items && items.length === 0 && (
        <p className="text-sm text-zinc-400">{tab === 'pending' ? 'Nothing waiting for approval.' : 'No published comments yet.'}</p>
      )}
      <ul className="space-y-3">
        {items?.map((c) => (
          <li key={c.id} className="p-4 rounded-xl border border-zinc-800 bg-[#0B1120] space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-semibold text-zinc-100">{c.name}</span>
              {c.is_author === 1 && <span className="text-[11px] font-mono text-amber-300">(you)</span>}
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{new Date(c.created_at).toLocaleString()}</span>
              <span className="text-zinc-500">·</span>
              <a href={`/blog/${c.post}/`} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1 font-mono text-xs break-all">
                /blog/{c.post}/ <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-zinc-200 whitespace-pre-line [overflow-wrap:anywhere]" dir="auto">{c.body}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {c.status === 'pending' && (
                <button type="button" disabled={busy === c.id} onClick={() => act(c.id, () => adminApprove(adminKey, c.id), 'Approved. It appears on the post within a minute.')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/80 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50">
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              )}
              <button type="button" onClick={() => { setReplyTo(c); setReply('') }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 text-xs hover:border-amber-500">
                <Reply className="h-3.5 w-3.5" /> Reply
              </button>
              <button
                type="button"
                disabled={busy === c.id}
                onClick={() => window.confirm('Delete this comment permanently?') && act(c.id, () => adminDelete(adminKey, c.id), 'Deleted.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-300 text-xs hover:bg-red-950/60 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
            {replyTo?.id === c.id && (
              <form onSubmit={sendReply} className="space-y-2 pt-2">
                <textarea className={`${field} min-h-[6rem]`} value={reply} onChange={(e) => setReply(e.target.value)} maxLength={3000} placeholder={`Reply to ${c.name} (published under your name)`} dir="auto" required />
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400">Publish reply</button>
                  <button type="button" onClick={() => setReplyTo(null)} className="px-3 py-1.5 rounded-lg text-zinc-400 text-xs hover:text-zinc-200">Cancel</button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

type FeedPost = { title: string; url: string; date: string }

// HTML Comment Box keeps the comments on its own servers and has no API, so
// moderation happens on each post: log in there once, then delete or reply
// right under the comment. This lists every post with a direct link.
function HcbGuide() {
  const [posts, setPosts] = useState<FeedPost[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/feed.xml', { cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`feed.xml: ${r.status}`))))
      .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, 'application/xml')
        const items = [...doc.querySelectorAll('item')].map((item) => {
          const link = item.querySelector('link')?.textContent ?? ''
          return {
            title: item.querySelector('title')?.textContent ?? link,
            // Same site as this page, so it works on previews and locally too.
            url: link.replace(/^https?:\/\/[^/]+/, ''),
            date: new Date(item.querySelector('pubDate')?.textContent ?? '').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          }
        })
        if (!cancelled) setPosts(items)
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <section className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
        <h2 className="font-mono font-bold text-amber-400">How to delete or reply to a comment</h2>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-zinc-200 leading-relaxed">
          <li>Open the post from the list below (it jumps straight to the comments).</li>
          <li>
            Under the comment box, click <strong>Moderator login</strong> and sign in with the HTML Comment Box account you used to get the
            code. You only need to do this once per browser.
          </li>
          <li>
            Moderation buttons now appear on each comment. Click <strong>delete</strong> on the one to remove; it disappears for everyone.
          </li>
          <li>To answer someone, write a comment on the post while logged in; it is marked as yours.</li>
        </ol>
        <p className="text-xs text-zinc-400">
          The same login on{' '}
          <a className="text-amber-400 underline" href="https://www.htmlcommentbox.com" target="_blank" rel="noreferrer">
            htmlcommentbox.com
          </a>{' '}
          is where the comment box’s own settings live.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-amber-400" /> Comments on each post
        </h2>
        {error && <p className="text-sm text-red-300">Couldn’t load the post list ({error}).</p>}
        {!posts && !error && <p className="text-sm text-zinc-400">Loading posts…</p>}
        {posts && posts.length === 0 && <p className="text-sm text-zinc-400">No published posts yet.</p>}
        <ul className="space-y-2">
          {posts?.map((p) => (
            <li key={p.url}>
              <a
                href={`${p.url}#comments-heading`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-xl border border-zinc-800 bg-[#0B1120] hover:border-amber-500/60 transition-colors"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-zinc-100" dir="auto">{p.title}</span>
                  <span className="block text-xs font-mono text-zinc-400">{p.date}</span>
                </span>
                <span className="text-xs font-mono text-amber-400 inline-flex items-center gap-1">
                  Open comments <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
