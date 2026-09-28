'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'
import { ArrowLeft, CheckCircle2, ExternalLink, FilePlus2, KeyRound, Loader2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import { AdminHeader } from '@/components/AdminHeader'
import { RichEditor } from '@/components/admin/RichEditor'
import { TOKEN_EVENT, TokenSetup, useCanPublish, useToken } from '@/components/admin/GitHubConnect'
import { useAdminAuth } from '@/lib/auth'
import {
  PostFields,
  FILE_PATTERN,
  normalizeParagraphs,
  parsePostFile,
  postFileName,
  serializePost,
  slugify,
  validatePost,
} from '@/lib/blog-format'
import {
  ACTIONS_URL,
  RemoteFile,
  deletePost,
  deployState,
  forgetToken,
  listPosts,
  readPost,
  commitFiles,
  postPath,
  textToBase64,
  blobToBase64,
  type FileChange,
} from '@/lib/github-publish'

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const emptyPost = (): PostFields => ({ title: '', date: today(), summary: '', tags: [], draft: false, format: 'html', body: '' })

// Photos are shrunk in the browser before upload (max 2000px wide) so the
// repo and the page stay light. GIFs keep their animation, so are left as is.
const MAX_WIDTH = 2000
async function prepareImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg')
  if (file.type === 'image/gif') return { blob: file, ext: 'gif' }
  const bitmap = await createImageBitmap(file)
  if (bitmap.width <= MAX_WIDTH && file.size <= 1_500_000) return { blob: file, ext }
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const png = file.type === 'image/png'
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the image'))), png ? 'image/png' : 'image/jpeg', 0.85),
  )
  return { blob, ext: png ? 'png' : 'jpg' }
}

// e.g. 2026-09-27-my-post-photo-k3x9a.jpg (the random part avoids clashes).
const imageFileName = (date: string, slug: string, base: string, ext: string) =>
  `${date}-${slug || 'post'}-${base}-${Math.random().toString(36).slice(2, 7)}.${ext}`

type PendingImage = { blob: Blob; repoPath: string; webPath: string; uploaded: boolean }

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
  const canPublish = useCanPublish()

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
        {canPublish ? <Editor /> : <TokenSetup />}
      </main>
    </div>
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
  // What the editor is (re)loaded with: changes only on New post / open.
  const [editorSeed, setEditorSeed] = useState('')
  // Images picked but not yet saved: local preview URL -> upload target.
  const pending = useRef(new Map<string, PendingImage>())
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

  const startNew = () => {
    setPost(emptyPost())
    setTagsText('')
    setSlug('')
    setSlugEdited(false)
    setOriginal(null)
    setEditorSeed('')
    pending.current.clear()
    setStatus({ kind: 'idle' })
  }

  const open = async (file: RemoteFile) => {
    setStatus({ kind: 'working', text: `Opening ${file.name}…` })
    try {
      const { text, sha } = await readPost(file.name)
      const parsed = parsePostFile(text, file.name)
      // Markdown posts are converted once; they are saved back as HTML.
      const html =
        parsed.format === 'html'
          ? parsed.body
          : (marked.parse(normalizeParagraphs(parsed.body), { async: false, gfm: true }) as string)
      const fields: PostFields = { ...parsed, format: 'html', body: html }
      setPost(fields)
      setEditorSeed(html)
      pending.current.clear()
      setTagsText(fields.tags.join(', '))
      setSlug(file.name.match(FILE_PATTERN)?.[2] ?? '')
      setSlugEdited(true)
      setOriginal({ name: file.name, sha })
      setStatus({ kind: 'idle' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const pickImage = async (file: File) => {
    const { blob, ext } = await prepareImage(file)
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
    const name = imageFileName(post.date, effectiveSlug, base, ext)
    const preview = URL.createObjectURL(blob)
    pending.current.set(preview, { blob, repoPath: `public/blog-images/${name}`, webPath: `/blog-images/${name}`, uploaded: false })
    return { src: preview, alt: file.name.replace(/\.[^.]+$/, '') }
  }

  const save = async (draft: boolean) => {
    // Swap local image previews for their final addresses, and upload only
    // images still in the post that haven't been uploaded yet. The editor
    // keeps showing the local previews, since the final addresses only work
    // once the site has rebuilt.
    let body = post.body
    const images: PendingImage[] = []
    for (const [preview, img] of pending.current) {
      if (body.includes(preview)) {
        body = body.split(preview).join(img.webPath)
        if (!img.uploaded) images.push(img)
      }
    }
    const fields: PostFields = {
      ...post,
      body,
      format: 'html',
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
      // Post, images, and any rename go up as one commit (one site rebuild).
      const changes: FileChange[] = [{ path: postPath(fileName), base64: textToBase64(serializePost(fields)) }]
      for (const img of images) changes.push({ path: img.repoPath, base64: await blobToBase64(img.blob) })
      if (original && original.name !== fileName) changes.push({ path: postPath(original.name), delete: true })
      const commit = await commitFiles(changes, `Blog: ${verb.toLowerCase()} "${fields.title}"`)
      images.forEach((img) => (img.uploaded = true))
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

        <RichEditor
          initialHtml={editorSeed}
          onChange={(html) => setPost((p) => ({ ...p, body: html }))}
          onPickImage={pickImage}
        />

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
