'use client'

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'
import { ArrowLeft, CheckCircle2, ExternalLink, FilePlus2, KeyRound, Loader2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import { AdminHeader } from '@/components/AdminHeader'
import { useAdminAuth } from '@/lib/auth'
import {
  PostFields,
  FILE_PATTERN,
  parsePostFile,
  postFileName,
  serializePost,
  slugify,
  validatePost,
} from '@/lib/blog-format'
import {
  ACTIONS_URL,
  RemoteFile,
  checkAccess,
  deletePost,
  deployState,
  forgetToken,
  getToken,
  listPosts,
  readPost,
  saveToken,
  writePost,
} from '@/lib/github-publish'

// The token lives in localStorage; read it without a hydration mismatch.
const TOKEN_EVENT = 'adamu-token-change'
const subscribeToken = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener(TOKEN_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(TOKEN_EVENT, cb)
  }
}
const useToken = () => useSyncExternalStore(subscribeToken, getToken, () => '')

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const emptyPost = (): PostFields => ({ title: '', date: today(), summary: '', tags: [], draft: false, body: '' })

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'deploying'; text: string; commit: string; url?: string }
  | { kind: 'live'; text: string; url?: string }
  | { kind: 'deploy-failed'; text: string }
  | { kind: 'saved'; text: string }

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500'

export default function AdminBlogPage() {
  const { isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const token = useToken()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/admin/login')
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">
        Verifying session…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100 flex flex-col font-sans">
      <AdminHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Link href="/admin/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-mono font-bold text-zinc-50">Write a blog post</h1>
            <p className="text-sm text-zinc-400">
              Publishing commits the post to GitHub; adamu.tech/blog updates about a minute later.
            </p>
          </div>
          {token && (
            <button
              type="button"
              onClick={() => {
                forgetToken()
                window.dispatchEvent(new Event(TOKEN_EVENT))
              }}
              className="text-xs font-mono text-zinc-400 hover:text-red-300 inline-flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5" /> Forget GitHub token on this device
            </button>
          )}
        </div>
        {token ? <Editor /> : <TokenSetup />}
      </main>
    </div>
  )
}

function TokenSetup() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const connect = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    const previous = getToken()
    saveToken(value)
    try {
      await checkAccess()
      window.dispatchEvent(new Event(TOKEN_EVENT))
    } catch (err) {
      if (previous) saveToken(previous)
      else forgetToken()
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setChecking(false)
    }
  }

  return (
    <section className="p-6 rounded-2xl border border-zinc-800 bg-[#0B1120] space-y-4 max-w-3xl">
      <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-amber-400" /> One-time setup on this device
      </h2>
      <p className="text-sm text-zinc-300 leading-relaxed">
        The site has no server, so posts are published by saving them to your GitHub repository. This page needs a
        GitHub token that can do only that. It is stored in this browser only and sent only to GitHub.
      </p>
      <ol className="list-decimal pl-5 space-y-1.5 text-sm text-zinc-300">
        <li>
          Open{' '}
          <a
            className="text-amber-400 underline"
            href="https://github.com/settings/personal-access-tokens/new"
            target="_blank"
            rel="noreferrer"
          >
            GitHub → New fine-grained token
          </a>
          .
        </li>
        <li>Name it “adamu.tech blog”. Pick an expiry (e.g. 1 year).</li>
        <li>
          <strong>Repository access:</strong> Only select repositories → <code>adab-tech/adab-tech.github.io</code>.
        </li>
        <li>
          <strong>Permissions:</strong> Contents → <em>Read and write</em>. Optional: Actions → <em>Read-only</em>, to
          see here when the post is live.
        </li>
        <li>Generate, copy the token, and paste it below.</li>
      </ol>
      <form onSubmit={connect} className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github_pat_…"
          className={inputClass}
          aria-label="GitHub token"
          required
        />
        <button
          type="submit"
          disabled={checking || !value.trim()}
          className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {checking && <Loader2 className="h-4 w-4 animate-spin" />} Connect
        </button>
      </form>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </section>
  )
}

function Editor() {
  const [files, setFiles] = useState<RemoteFile[] | null>(null)
  const [listError, setListError] = useState('')
  const [post, setPost] = useState<PostFields>(emptyPost)
  const [tagsText, setTagsText] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [original, setOriginal] = useState<{ name: string; sha: string } | null>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const effectiveSlug = slugEdited ? slug : slugify(post.title)
  const fileName = postFileName(post.date, effectiveSlug)
  const problems = validatePost(post, effectiveSlug)
  const busy = status.kind === 'working'

  const refresh = async () => {
    setListError('')
    try {
      setFiles(await listPosts())
    } catch (err) {
      setListError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    listPosts()
      .then((f) => !cancelled && setFiles(f))
      .catch((err) => !cancelled && setListError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
    }
  }, [])

  // Poll the deploy run after a publish until it finishes (up to ~6 minutes).
  useEffect(() => {
    if (status.kind !== 'deploying') return
    let tries = 0
    const timer = setInterval(async () => {
      tries++
      const state = await deployState(status.commit)
      if (state === 'live') {
        clearInterval(timer)
        setStatus({ kind: 'live', text: 'Live on adamu.tech.', url: status.url })
      } else if (state === 'failed') {
        clearInterval(timer)
        setStatus({ kind: 'deploy-failed', text: 'The site build failed; the live site is unchanged. Open Actions to see why.' })
      } else if (state === 'unknown' || tries > 36) {
        clearInterval(timer)
        setStatus({
          kind: 'saved',
          text: 'Committed. The site usually updates within a minute; check Actions for progress.',
        })
      }
    }, 10000)
    return () => clearInterval(timer)
  }, [status])

  const preview = useMemo(
    () => (tab === 'preview' ? (marked.parse(post.body || '*Nothing written yet.*', { async: false, gfm: true }) as string) : ''),
    [tab, post.body],
  )

  const startNew = () => {
    setPost(emptyPost())
    setTagsText('')
    setSlug('')
    setSlugEdited(false)
    setOriginal(null)
    setTab('write')
    setStatus({ kind: 'idle' })
  }

  const open = async (file: RemoteFile) => {
    setStatus({ kind: 'working', text: `Opening ${file.name}…` })
    try {
      const { text, sha } = await readPost(file.name)
      const fields = parsePostFile(text, file.name)
      setPost(fields)
      setTagsText(fields.tags.join(', '))
      setSlug(file.name.match(FILE_PATTERN)?.[2] ?? '')
      setSlugEdited(true)
      setOriginal({ name: file.name, sha })
      setTab('write')
      setStatus({ kind: 'idle' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const save = async (draft: boolean) => {
    const fields: PostFields = {
      ...post,
      draft,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    }
    const found = validatePost(fields, effectiveSlug)
    if (found.length) {
      setStatus({ kind: 'error', text: found.join(' ') })
      return
    }
    const clash = files?.some((f) => f.name.match(FILE_PATTERN)?.[2] === effectiveSlug && f.name !== original?.name)
    if (clash) {
      setStatus({ kind: 'error', text: `Another post already uses the address /blog/${effectiveSlug}/. Change the title or address.` })
      return
    }

    const verb = original ? 'Update' : draft ? 'Draft' : 'Publish'
    setStatus({ kind: 'working', text: 'Saving to GitHub…' })
    try {
      const renamed = original && original.name !== fileName
      const commit = await writePost(
        fileName,
        serializePost(fields),
        `Blog: ${verb.toLowerCase()} "${fields.title}"`,
        renamed ? undefined : original?.sha,
      )
      if (renamed && original) {
        await deletePost(original.name, original.sha, `Blog: rename "${original.name}" to "${fileName}"`)
      }
      const fresh = await listPosts()
      setFiles(fresh)
      setOriginal({ name: fileName, sha: fresh.find((f) => f.name === fileName)?.sha ?? '' })
      setPost(fields)
      setSlug(effectiveSlug)
      setSlugEdited(true)
      const url = `https://adamu.tech/blog/${effectiveSlug}/`
      if (draft) {
        setStatus({ kind: 'saved', text: 'Saved as a draft on GitHub. It is not on the site; publish when ready.' })
      } else {
        setStatus({ kind: 'deploying', text: 'Published. Building the site…', commit, url })
      }
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const remove = async () => {
    if (!original) return
    if (!window.confirm(`Delete “${post.title}” from the site? This removes ${original.name} from GitHub.`)) return
    setStatus({ kind: 'working', text: 'Deleting…' })
    try {
      const { sha } = await readPost(original.name)
      await deletePost(original.name, sha, `Blog: delete "${post.title}"`)
      await refresh()
      startNew()
      setStatus({ kind: 'saved', text: 'Deleted. The post disappears from the site within about a minute.' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
      {/* Post list */}
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-zinc-200">Posts on GitHub</h2>
          <button type="button" onClick={refresh} className="p-1.5 text-zinc-400 hover:text-amber-400" aria-label="Reload posts">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-amber-500/40 text-amber-400 font-mono text-xs font-bold hover:bg-amber-500/10"
        >
          <FilePlus2 className="h-4 w-4" /> New post
        </button>
        {listError && <p className="text-xs text-red-300">{listError}</p>}
        {!files && !listError && <p className="text-xs text-zinc-400">Loading…</p>}
        {files && files.length === 0 && <p className="text-xs text-zinc-400">No posts yet.</p>}
        <ul className="space-y-1">
          {files?.map((f) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => open(f)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono break-all ${
                  original?.name === f.name ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {f.name.replace(/\.md$/, '')}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <section className="space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_11rem] gap-3">
          <label className="space-y-1 block">
            <span className="text-xs font-mono text-zinc-400">Title</span>
            <input className={inputClass} value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          </label>
          <label className="space-y-1 block">
            <span className="text-xs font-mono text-zinc-400">Date</span>
            <input
              type="date"
              className={inputClass}
              value={post.date}
              onChange={(e) => setPost({ ...post, date: e.target.value })}
            />
          </label>
        </div>
        <label className="space-y-1 block">
          <span className="text-xs font-mono text-zinc-400">Web address</span>
          <div className="flex items-center gap-1 text-sm min-w-0">
            <span className="text-zinc-500 font-mono shrink-0 text-xs sm:text-sm">/blog/</span>
            <input
              className={inputClass}
              value={effectiveSlug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugEdited(true)
              }}
            />
          </div>
        </label>
        <label className="space-y-1 block">
          <span className="text-xs font-mono text-zinc-400">Summary (shown on /blog and in link previews; optional)</span>
          <input className={inputClass} value={post.summary} onChange={(e) => setPost({ ...post, summary: e.target.value })} />
        </label>
        <label className="space-y-1 block">
          <span className="text-xs font-mono text-zinc-400">Tags, separated by commas (optional)</span>
          <input className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="reflection, research" />
        </label>

        <div className="space-y-2">
          <div className="flex items-center gap-2" role="tablist">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                  tab === t ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t === 'write' ? 'Write' : 'Preview'}
              </button>
            ))}
            <span className="text-[11px] text-zinc-500 ml-auto">Markdown: ## heading, **bold**, *italic*, [link](url), &gt; quote, - list</span>
          </div>
          {tab === 'write' ? (
            <textarea
              className={`${inputClass} min-h-[24rem] leading-relaxed font-sans text-base`}
              value={post.body}
              onChange={(e) => setPost({ ...post, body: e.target.value })}
              placeholder="Write your post here. Leave a blank line between paragraphs."
              aria-label="Post text"
            />
          ) : (
            <div className="p-5 rounded-lg border border-zinc-800 bg-[#0B1120] min-h-[24rem]">
              <h1 className="font-serif-display text-3xl font-semibold text-zinc-50 mb-4">{post.title || 'Untitled'}</h1>
              <div className="post-body" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          )}
        </div>

        {problems.length > 0 && (post.title || post.body) && (
          <p className="text-xs text-zinc-400">Before publishing: {problems.join(' ')}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy || problems.length > 0}
            onClick={() => save(false)}
            className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 disabled:opacity-50"
          >
            {original && !post.draft ? 'Update post' : 'Publish'}
          </button>
          <button
            type="button"
            disabled={busy || problems.length > 0}
            onClick={() => save(true)}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-200 font-mono text-sm hover:border-amber-500 disabled:opacity-50"
          >
            Save as draft
          </button>
          {original && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="ml-auto px-3 py-2 rounded-lg text-red-300 font-mono text-sm hover:bg-red-950/60 inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 font-mono">File: content/blog/{fileName}</p>

        <StatusLine status={status} />
      </section>
    </div>
  )
}

function StatusLine({ status }: { status: Status }) {
  if (status.kind === 'idle') return null
  const tone =
    status.kind === 'error' || status.kind === 'deploy-failed'
      ? 'border-red-900 bg-red-950/50 text-red-200'
      : status.kind === 'live'
        ? 'border-emerald-800 bg-emerald-950/60 text-emerald-200'
        : 'border-zinc-700 bg-zinc-900 text-zinc-200'
  const icon =
    status.kind === 'working' || status.kind === 'deploying' ? (
      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
    ) : status.kind === 'error' || status.kind === 'deploy-failed' ? (
      <XCircle className="h-4 w-4 shrink-0" />
    ) : (
      <CheckCircle2 className="h-4 w-4 shrink-0" />
    )
  const url = 'url' in status ? status.url : undefined
  return (
    <div role="status" className={`p-3 rounded-lg border text-sm flex flex-wrap items-center gap-2 ${tone}`}>
      {icon}
      <span>{status.text}</span>
      {url && status.kind === 'live' && (
        <a href={url} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">
          View post <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
      {(status.kind === 'deploying' || status.kind === 'saved' || status.kind === 'deploy-failed') && (
        <a href={ACTIONS_URL} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">
          Actions <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}
