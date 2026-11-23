'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'
import { ArrowLeft, CheckCircle2, ExternalLink, FilePlus2, KeyRound, Loader2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import { AdminHeader } from '@/components/AdminHeader'
import { ShareButtons } from '@/components/ShareButtons'
import { RichEditor } from '@/components/admin/RichEditor'
import { TOKEN_EVENT, TokenSetup, useCanPublish, useToken } from '@/components/admin/GitHubConnect'
import { useAdminAuth } from '@/lib/auth'
import {
  PostFields,
  DATE_PATTERN,
  FILE_PATTERN,
  SLUG_PATTERN,
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
  commitPost,
  blobToBase64,
} from '@/lib/github-publish'
import { deleteLocalDraft, listLocalDrafts, writeLocalDraft, type DraftImage, type LocalBlogDraft } from '@/lib/local-blog-drafts'

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

type PendingImage = DraftImage & { uploaded: boolean }
type Publication = { url: string; title: string }

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; text: string }
  | { kind: 'error'; text: string }
  | ({ kind: 'deploying'; text: string; commit: string } & Publication)
  | ({ kind: 'live'; text: string } & Publication)
  | { kind: 'deploy-failed'; text: string }
  | { kind: 'saved'; text: string; actions?: boolean }

function releaseImagePreviews(images: Map<string, PendingImage>) {
  for (const url of images.keys()) URL.revokeObjectURL(url)
  images.clear()
}

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500'

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
            <Link href="/admin/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-gold-500">
              <ArrowLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-mono font-bold text-zinc-50">Write a blog post</h1>
            <p className="text-sm text-zinc-400">
              Write a post, save a draft on this device, or publish it to adamu.tech.
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
  const [drafts, setDrafts] = useState<LocalBlogDraft[]>([])
  const [localDraftId, setLocalDraftId] = useState<string | null>(null)
  const [draftError, setDraftError] = useState('')
  const [post, setPost] = useState<PostFields>(emptyPost)
  const [tagsText, setTagsText] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [original, setOriginal] = useState<{ name: string; sha: string } | null>(null)
  // What the editor is (re)loaded with: changes only on New post / open.
  const [editorSeed, setEditorSeed] = useState('')
  const [editorRevision, setEditorRevision] = useState(0)
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
    const previews = pending.current
    listPosts()
      .then((f) => !cancelled && setFiles(f))
      .catch((err) => !cancelled && setListError(err instanceof Error ? err.message : String(err)))
    listLocalDrafts()
      .then((saved) => !cancelled && setDrafts(saved))
      .catch((err) => !cancelled && setDraftError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
      releaseImagePreviews(previews)
    }
  }, [])

  // Poll only the Pages deployment for this commit, with one request at a time.
  useEffect(() => {
    if (status.kind !== 'deploying') return
    let cancelled = false
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const poll = async () => {
      tries++
      const state = await deployState(status.commit)
      if (cancelled) return
      if (state === 'live') {
        setStatus({ kind: 'live', text: 'Live on adamu.tech.', url: status.url, title: status.title })
      } else if (state === 'failed') {
        setStatus({ kind: 'deploy-failed', text: 'The Pages deployment did not complete. Open Actions for details.' })
      } else if (state === 'unknown' || tries >= 36) {
        setStatus({
          kind: 'saved',
          text: 'Committed to GitHub. Check the Pages workflow for deployment progress.',
          actions: true,
        })
      } else {
        timer = setTimeout(poll, 10000)
      }
    }
    timer = setTimeout(poll, 3000)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [status])

  const startNew = () => {
    setPost(emptyPost())
    setTagsText('')
    setSlug('')
    setSlugEdited(false)
    setOriginal(null)
    setLocalDraftId(null)
    setEditorSeed('')
    setEditorRevision((revision) => revision + 1)
    releaseImagePreviews(pending.current)
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
      setEditorRevision((revision) => revision + 1)
      releaseImagePreviews(pending.current)
      setTagsText(fields.tags.join(', '))
      const savedSlug = file.name.match(FILE_PATTERN)?.[2] ?? ''
      setSlug(savedSlug)
      setSlugEdited(true)
      setOriginal({ name: file.name, sha })
      setLocalDraftId(null)
      if (fields.draft) {
        setStatus({ kind: 'saved', text: 'This older draft is visible on GitHub. Save future edits as a draft in this browser.' })
        return
      }
      // Offers sharing for an existing public post after confirming its page.
      const response = SLUG_PATTERN.test(savedSlug)
        ? await fetch(`/blog/${savedSlug}/`, { method: 'HEAD', cache: 'no-store' }).catch(() => null)
        : null
      setStatus(response?.ok
        ? { kind: 'live', text: 'Posted on adamu.tech.', url: `https://adamu.tech/blog/${savedSlug}/`, title: fields.title }
        : { kind: 'idle' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const openDraft = (draft: LocalBlogDraft) => {
    releaseImagePreviews(pending.current)
    let body = draft.post.body
    for (const img of draft.images) {
      const preview = URL.createObjectURL(img.blob)
      pending.current.set(preview, { ...img, uploaded: false })
      body = body.split(img.webPath).join(preview)
    }
    setPost({ ...draft.post, body })
    setEditorSeed(body)
    setEditorRevision((revision) => revision + 1)
    setTagsText(draft.tagsText)
    setSlug(draft.slug)
    setSlugEdited(draft.slugEdited)
    setOriginal(draft.original)
    setLocalDraftId(draft.id)
    setStatus({ kind: 'idle' })
  }

  const pickImage = async (file: File) => {
    const { blob, ext } = await prepareImage(file)
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
    const name = imageFileName(DATE_PATTERN.test(post.date) ? post.date : today(), slugify(effectiveSlug), base, ext)
    const preview = URL.createObjectURL(blob)
    pending.current.set(preview, { blob, repoPath: `public/blog-images/${name}`, webPath: `/blog-images/${name}`, uploaded: false })
    return { src: preview, alt: file.name.replace(/\.[^.]+$/, '') }
  }

  const preparePost = () => {
    // Keep local preview URLs in the editor. Save stable image paths and any
    // pending attachments so a draft can be reopened after closing the tab.
    let body = post.body
    const images: PendingImage[] = []
    for (const [preview, img] of pending.current) {
      if (body.includes(preview)) {
        body = body.split(preview).join(img.webPath)
        if (!img.uploaded) images.push(img)
      }
    }
    return {
      fields: {
        ...post,
        body,
        tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      },
      images,
    }
  }

  const saveDraft = async () => {
    setStatus({ kind: 'working', text: 'Saving draft in this browser…' })
    try {
      const { fields, images } = preparePost()
      const draft: LocalBlogDraft = {
        id: localDraftId ?? crypto.randomUUID(),
        post: fields,
        tagsText,
        slug,
        slugEdited,
        original,
        images: images.map(({ blob, repoPath, webPath }) => ({ blob, repoPath, webPath })),
        updatedAt: Date.now(),
      }
      await writeLocalDraft(draft)
      setDrafts((all) => [draft, ...all.filter((entry) => entry.id !== draft.id)])
      setLocalDraftId(draft.id)
      setDraftError('')
      setStatus({ kind: 'saved', text: 'Draft saved in this browser.' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Could not save the draft in this browser.' })
    }
  }

  const save = async () => {
    const prepared = preparePost()
    const fields: PostFields = { ...prepared.fields, format: 'html', draft: false }
    const { images } = prepared
    const found = validatePost(fields, effectiveSlug)
    if (found.length) {
      setStatus({ kind: 'error', text: found.join(' ') })
      return
    }
    const verb = original && !post.draft ? 'update' : 'publish'
    setStatus({ kind: 'working', text: 'Saving to GitHub…' })
    try {
      // Post, images, and any rename go up as one commit (one site rebuild).
      const uploads = await Promise.all(images.map(async (img) => ({ path: img.repoPath, base64: await blobToBase64(img.blob) })))
      const { commit, file } = await commitPost({
        name: fileName,
        text: serializePost(fields),
        images: uploads,
        original,
        message: `Blog: ${verb} "${fields.title}"`,
      })
      images.forEach((img) => (img.uploaded = true))
      setFiles((existing) => [file, ...(existing ?? []).filter((entry) => entry.name !== original?.name && entry.name !== file.name)]
        .sort((a, b) => b.name.localeCompare(a.name)))
      setOriginal(file)
      setPost(fields)
      setSlug(effectiveSlug)
      setSlugEdited(true)
      const url = `https://adamu.tech/blog/${effectiveSlug}/`
      if (localDraftId) {
        try {
          await deleteLocalDraft(localDraftId)
          setDrafts((all) => all.filter((entry) => entry.id !== localDraftId))
        } catch {
          setDraftError('The post was saved on GitHub. The old draft copy remains in this browser.')
        }
        setLocalDraftId(null)
      }
      setStatus({ kind: 'deploying', text: 'Saved to GitHub. Waiting for the Pages deployment…', commit, url, title: fields.title })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const removeDraft = async () => {
    if (!localDraftId || !window.confirm('Delete this draft from this browser?')) return
    setStatus({ kind: 'working', text: 'Deleting draft…' })
    try {
      await deleteLocalDraft(localDraftId)
      setDrafts((all) => all.filter((entry) => entry.id !== localDraftId))
      startNew()
      setStatus({ kind: 'saved', text: 'Draft deleted from this browser.' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Could not delete the local draft.' })
    }
  }

  const remove = async () => {
    if (!original) return
    if (!window.confirm(`Delete “${post.title}” from the site? This removes ${original.name} from GitHub.`)) return
    setStatus({ kind: 'working', text: 'Deleting…' })
    try {
      await deletePost(original.name, original.sha, `Blog: delete "${post.title}"`)
      await refresh()
      startNew()
      setStatus({ kind: 'saved', text: 'Removed from GitHub. The next Pages deployment updates the blog.', actions: true })
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
          <button type="button" disabled={busy} onClick={refresh} className="p-1.5 text-zinc-400 hover:text-gold-500 disabled:opacity-50" aria-label="Reload posts">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={startNew}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gold-500/40 text-gold-500 font-mono text-xs font-bold hover:bg-gold-500/10 disabled:opacity-50"
        >
          <FilePlus2 className="h-4 w-4" /> New post
        </button>
        <section className="space-y-2 border-b border-zinc-800 pb-3" aria-label="Local drafts">
          <h2 className="text-sm font-mono font-bold text-zinc-200">Drafts in this browser</h2>
          {draftError && <p className="text-xs text-red-300">{draftError}</p>}
          {drafts.length === 0 && <p className="text-xs text-zinc-400">No local drafts.</p>}
          <ul className="space-y-1">
            {drafts.map((draft) => (
              <li key={draft.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openDraft(draft)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs break-words ${
                    localDraftId === draft.id ? 'bg-gold-500/10 text-gold-400' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {draft.post.title.trim() || 'Untitled draft'}
                </button>
              </li>
            ))}
          </ul>
        </section>
        {listError && <p className="text-xs text-red-300">{listError}</p>}
        {!files && !listError && <p className="text-xs text-zinc-400">Loading…</p>}
        {files && files.length === 0 && <p className="text-xs text-zinc-400">No posts yet.</p>}
        <ul className="space-y-1">
          {files?.map((f) => (
            <li key={f.name}>
              <button
                type="button"
                disabled={busy}
                onClick={() => open(f)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono break-all ${
                  original?.name === f.name ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span className="block">{f.name.replace(/\.md$/, '')}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <section className="space-y-4 min-w-0">
        <fieldset disabled={busy} className="min-w-0 space-y-4">
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

          <div inert={busy}>
            <RichEditor
              key={editorRevision}
              initialHtml={editorSeed}
              onChange={(html) => setPost((p) => ({ ...p, body: html }))}
              onPickImage={pickImage}
            />
          </div>

          {problems.length > 0 && (post.title || post.body) && (
            <p className="text-xs text-zinc-400">Before publishing: {problems.join(' ')}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy || problems.length > 0}
              onClick={save}
              className="px-4 py-2 rounded-lg bg-gold-500 text-zinc-950 font-mono text-sm font-bold hover:bg-gold-500 disabled:opacity-50"
            >
              {original && !post.draft ? 'Update post' : 'Publish'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={saveDraft}
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-200 font-mono text-sm hover:border-gold-500 disabled:opacity-50"
            >
              Save draft in this browser
            </button>
            {localDraftId && (
              <button
                type="button"
                disabled={busy}
                onClick={removeDraft}
                className="ml-auto px-3 py-2 rounded-lg text-red-300 font-mono text-sm hover:bg-red-950/60 inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Delete local draft
              </button>
            )}
            {original && !localDraftId && (
              <button
                type="button"
                disabled={busy}
                onClick={remove}
                className="ml-auto px-3 py-2 rounded-lg text-red-300 font-mono text-sm hover:bg-red-950/60 inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> {post.draft ? 'Remove GitHub draft' : 'Remove published post'}
              </button>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">File: content/blog/{fileName}</p>
          <p className="text-xs text-zinc-400">Drafts live in this browser. Publish sends the post and its images to GitHub.</p>
        </fieldset>

        <StatusLine status={status} />
        {status.kind === 'live' && <ShareButtons url={status.url} title={status.title} />}
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
      {(status.kind === 'deploying' || (status.kind === 'saved' && status.actions) || status.kind === 'deploy-failed') && (
        <a href={ACTIONS_URL} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">
          Actions <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}
