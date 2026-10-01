'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  ImagePlus,
  KeyRound,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react'
import { AdminHeader } from '@/components/AdminHeader'
import { TokenSetup, forgetTokenHere, useCanPublish, useToken } from '@/components/admin/GitHubConnect'
import { useAdminAuth } from '@/lib/auth'
import { ACTIONS_URL, blobToBase64, commitFiles, deployState, readFile, textToBase64, type FileChange } from '@/lib/github-publish'

// A form editor for one content file (content/site/*.json), described by a
// small schema. Saving commits the file, plus any uploaded logos, to GitHub
// as one commit; the site rebuilds about a minute later.

type Json = unknown
type Obj = Record<string, Json>

export type Field =
  | { key: string; label: string; type: 'text' | 'url' | 'textarea'; help?: string; placeholder?: string; default?: string }
  | { key: string; label: string; type: 'bool'; help?: string; default?: boolean }
  | { key: string; label: string; type: 'select'; options: string[] | ((root: Obj) => string[]); help?: string; default?: string }
  | { key: string; label: string; type: 'strings'; help?: string; itemLabel?: string }
  | { key: string; label: string; type: 'logo'; help?: string; nameFrom?: string }
  | { key: string; label: string; type: 'group'; fields: Field[]; help?: string }
  | { key: string; label: string; type: 'list'; fields: Field[]; titleKey: string; itemLabel: string; help?: string }

type PendingLogo = { blob: Blob; repoPath: string; preview: string }
type Ctx = { root: Obj; addLogo: (file: File, base: string) => Promise<string>; previews: Map<string, string> }

const input =
  'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500'
const smallBtn =
  'inline-flex items-center justify-center h-8 w-8 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent'

function defaultFor(field: Field): Json {
  switch (field.type) {
    case 'bool':
      return field.default ?? false
    case 'strings':
    case 'list':
      return []
    case 'group':
      return Object.fromEntries(field.fields.map((f) => [f.key, defaultFor(f)]))
    case 'select':
      return field.default ?? ''
    default:
      return 'default' in field ? field.default ?? '' : ''
  }
}

const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function ContentEditorPage({
  title,
  intro,
  file,
  schema,
  previewPath,
  validate,
  beforeSave,
}: {
  title: string
  intro: string
  file: 'home' | 'projects' | 'cv'
  schema: Field[]
  previewPath: string
  validate: (data: never) => string[]
  beforeSave?: (data: Obj) => Obj
}) {
  const { isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const token = useToken()
  const canPublish = useCanPublish()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/admin/login')
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">Verifying session…</div>
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100 flex flex-col font-sans">
      <AdminHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <Link href="/admin/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-gold-500">
              <ArrowLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-mono font-bold text-zinc-50">{title}</h1>
            <p className="text-sm text-zinc-400 max-w-2xl">{intro}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a href={previewPath} target="_blank" rel="noreferrer" className="text-xs font-mono text-gold-500 hover:underline inline-flex items-center gap-1">
              View on the site <ExternalLink className="h-3 w-3" />
            </a>
            {token && (
              <button type="button" onClick={forgetTokenHere} className="text-xs font-mono text-zinc-400 hover:text-red-300 inline-flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" /> Forget GitHub token on this device
              </button>
            )}
          </div>
        </div>
        {canPublish ? (
          <Editor file={file} schema={schema} previewPath={previewPath} validate={validate} beforeSave={beforeSave} />
        ) : (
          <TokenSetup />
        )}
      </main>
    </div>
  )
}

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'deploying'; commit: string }
  | { kind: 'live' }
  | { kind: 'deploy-failed' }

function Editor({
  file,
  schema,
  previewPath,
  validate,
  beforeSave,
}: {
  file: string
  schema: Field[]
  previewPath: string
  validate: (data: never) => string[]
  beforeSave?: (data: Obj) => Obj
}) {
  const path = `content/site/${file}.json`
  const [data, setData] = useState<Obj | null>(null)
  const [saved, setSaved] = useState('')
  const [loadError, setLoadError] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [problems, setProblems] = useState<string[]>([])
  const [logos, setLogos] = useState(() => new Map<string, PendingLogo>()) // web path -> pending upload

  const load = async () => {
    setLoadError('')
    try {
      const { text } = await readFile(path)
      const parsed = JSON.parse(text) as Obj
      setData(parsed)
      setSaved(JSON.stringify(parsed))
      setLogos(new Map())
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    readFile(path)
      .then(({ text }) => {
        if (cancelled) return
        const parsed = JSON.parse(text) as Obj
        setData(parsed)
        setSaved(JSON.stringify(parsed))
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : String(err)))
    return () => {
      cancelled = true
    }
  }, [path])

  const dirty = data !== null && JSON.stringify(data) !== saved

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  // Follow the deploy after saving.
  useEffect(() => {
    if (status.kind !== 'deploying') return
    let stop = false
    const tick = async () => {
      const state = await deployState(status.commit)
      if (stop) return
      if (state === 'live') setStatus({ kind: 'live' })
      else if (state === 'failed') setStatus({ kind: 'deploy-failed' })
      else if (state === 'unknown') setStatus({ kind: 'idle' })
      else setTimeout(tick, 6000)
    }
    const t = setTimeout(tick, 8000)
    return () => {
      stop = true
      clearTimeout(t)
    }
  }, [status])

  const addLogo = async (picked: File, base: string) => {
    if (picked.size > 1_000_000) throw new Error('Please use a logo under 1 MB (an SVG or a small PNG is best).')
    const ext = (picked.name.split('.').pop() || 'png').toLowerCase().replace('jpeg', 'jpg')
    if (!['svg', 'png', 'jpg', 'webp', 'gif', 'ico'].includes(ext)) throw new Error('Use an SVG, PNG, JPG, WebP, GIF or ICO file.')
    const name = `${base || 'logo'}-${Math.random().toString(36).slice(2, 7)}.${ext}`
    const webPath = `/project-logos/${name}`
    const entry = { blob: picked, repoPath: `public/project-logos/${name}`, preview: URL.createObjectURL(picked) }
    setLogos((prev) => new Map(prev).set(webPath, entry))
    return webPath
  }

  const previews = new Map([...logos].map(([web, l]) => [web, l.preview]))

  const save = async () => {
    if (!data) return
    const out = beforeSave ? beforeSave(structuredClone(data)) : data
    const found = validate(out as never)
    setProblems(found)
    if (found.length) {
      setStatus({ kind: 'error', text: 'Fix the problems listed above, then save again.' })
      return
    }
    setStatus({ kind: 'working', text: 'Saving to GitHub…' })
    try {
      const text = JSON.stringify(out, null, 2) + '\n'
      const used = new Set<string>()
      JSON.stringify(out, (_k, v) => {
        if (typeof v === 'string' && logos.has(v)) used.add(v)
        return v
      })
      const changes: FileChange[] = [{ path, base64: textToBase64(text) }]
      for (const web of used) {
        const l = logos.get(web)!
        changes.push({ path: l.repoPath, base64: await blobToBase64(l.blob) })
      }
      const commit = await commitFiles(changes, `Admin: update ${file === 'cv' ? 'CV' : file === 'home' ? 'home page' : 'projects'}`)
      setLogos(new Map())
      setData(out)
      setSaved(JSON.stringify(out))
      setStatus({ kind: 'deploying', commit })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  if (loadError)
    return (
      <div className="p-4 rounded-xl border border-red-900/60 bg-red-950/30 text-sm text-red-200 space-y-2">
        <p>{loadError}</p>
        <button type="button" onClick={load} className="underline">Try again</button>
      </div>
    )
  if (!data) return <p className="text-sm text-zinc-400 inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading from GitHub…</p>

  const ctx: Ctx = { root: data, addLogo, previews }

  return (
    <div className="space-y-6 pb-28">
      <p className="text-xs text-zinc-400 leading-relaxed">
        In longer text you can use <code className="text-gold-400">**bold**</code>, <code className="text-gold-400">*italic*</code>,{' '}
        <code className="text-gold-400">`code`</code> and <code className="text-gold-400">[link text](https://…)</code>. Use the arrows to reorder,
        the bin to remove, and <strong>Save &amp; publish</strong> at the bottom when done.
      </p>
      <Fields fields={schema} value={data} onChange={(v) => setData(v)} ctx={ctx} />

      {problems.length > 0 && (
        <ul className="p-4 rounded-xl border border-red-900/60 bg-red-950/30 text-sm text-red-200 list-disc pl-8 space-y-1">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {/* Save bar stays in view */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-zinc-800 bg-[#0B1120]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status.kind === 'working'}
            className="px-5 py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-sm font-bold hover:bg-gold-500 disabled:opacity-40 inline-flex items-center gap-2"
          >
            {status.kind === 'working' && <Loader2 className="h-4 w-4 animate-spin" />} Save &amp; publish
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => window.confirm('Discard all unsaved changes?') && setData(JSON.parse(saved))}
            className="px-3 py-2.5 rounded-lg text-zinc-400 text-sm hover:text-zinc-100 disabled:opacity-30 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" /> Discard changes
          </button>
          <span className="text-sm" role="status">
            {status.kind === 'idle' && (dirty ? <span className="text-gold-400">Unsaved changes</span> : <span className="text-zinc-400">All changes saved</span>)}
            {status.kind === 'working' && <span className="text-zinc-300">{status.text}</span>}
            {status.kind === 'error' && <span className="text-red-300">{status.text}</span>}
            {status.kind === 'deploying' && (
              <span className="text-zinc-300 inline-flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" /> Saved. Building the site (about a minute)…
              </span>
            )}
            {status.kind === 'live' && (
              <span className="text-emerald-300 inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Live.{' '}
                <a href={previewPath} target="_blank" rel="noreferrer" className="underline">
                  View
                </a>
              </span>
            )}
            {status.kind === 'deploy-failed' && (
              <span className="text-red-300 inline-flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> The build failed; the site is unchanged.{' '}
                <a href={ACTIONS_URL} target="_blank" rel="noreferrer" className="underline">
                  See why
                </a>
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

function Fields({ fields, value, onChange, ctx }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; ctx: Ctx }) {
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} ctx={ctx} parent={value} />
      ))}
    </div>
  )
}

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  return (
    <div className="space-y-0.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-zinc-200">
        {field.label}
      </label>
      {field.help && <p className="text-xs text-zinc-400">{field.help}</p>}
    </div>
  )
}

function FieldInput({ field, value, onChange, ctx, parent }: { field: Field; value: Json; onChange: (v: Json) => void; ctx: Ctx; parent: Obj }) {
  const id = useId()
  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="space-y-1.5">
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            className={input}
            type="text"
            inputMode={field.type === 'url' ? 'url' : undefined}
            spellCheck={field.type !== 'url'}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            dir="auto"
          />
        </div>
      )
    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label field={field} htmlFor={id} />
          <textarea id={id} className={`${input} min-h-[6rem] leading-relaxed`} value={String(value ?? '')} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} dir="auto" />
        </div>
      )
    case 'bool':
      return (
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-gold-500" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="space-y-0.5">
            <span className="block text-sm font-semibold text-zinc-200">{field.label}</span>
            {field.help && <span className="block text-xs text-zinc-400">{field.help}</span>}
          </span>
        </label>
      )
    case 'select': {
      const options = typeof field.options === 'function' ? field.options(ctx.root) : field.options
      const current = String(value ?? '')
      return (
        <div className="space-y-1.5">
          <Label field={field} htmlFor={id} />
          <select id={id} className={input} value={current} onChange={(e) => onChange(e.target.value)}>
            {!options.includes(current) && <option value={current}>{current || '— choose —'}</option>}
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      )
    }
    case 'strings': {
      const list = Array.isArray(value) ? (value as string[]) : []
      return (
        <div className="space-y-2">
          <Label field={field} />
          {list.map((item, i) => (
            <div key={i} className="flex items-start gap-1">
              <textarea
                className={`${input} min-h-[2.6rem] py-2 leading-snug`}
                rows={item.length > 90 ? 3 : 1}
                value={item}
                aria-label={`${field.itemLabel ?? field.label} ${i + 1}`}
                onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
                dir="auto"
              />
              <button type="button" className={smallBtn} disabled={i === 0} onClick={() => onChange(move(list, i, i - 1))} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" className={smallBtn} disabled={i === list.length - 1} onClick={() => onChange(move(list, i, i + 1))} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button type="button" className={`${smallBtn} hover:text-red-300`} onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...list, ''])} className="inline-flex items-center gap-1.5 text-xs font-mono text-gold-500 hover:text-gold-400">
            <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel ?? 'item'}
          </button>
        </div>
      )
    }
    case 'logo':
      return <LogoInput field={field} value={String(value ?? '')} onChange={onChange} ctx={ctx} parent={parent} />
    case 'group':
      return (
        <fieldset className="p-4 rounded-xl border border-zinc-800 bg-[#0B1120] space-y-4">
          <legend className="px-2 text-sm font-mono font-bold text-gold-500">{field.label}</legend>
          {field.help && <p className="text-xs text-zinc-400">{field.help}</p>}
          <Fields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} ctx={ctx} />
        </fieldset>
      )
    case 'list':
      return <ListInput field={field} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} ctx={ctx} />
  }
}

function ListInput({ field, value, onChange, ctx }: { field: Extract<Field, { type: 'list' }>; value: Obj[]; onChange: (v: Json) => void; ctx: Ctx }) {
  const [open, setOpen] = useState<number | null>(null)
  const blank = () => Object.fromEntries(field.fields.map((f) => [f.key, defaultFor(f)])) as Obj
  return (
    <section className="space-y-2">
      <div className="flex items-end justify-between gap-3 border-b border-zinc-800 pb-1.5">
        <div>
          <h2 className="text-base font-mono font-bold text-zinc-100">{field.label}</h2>
          {field.help && <p className="text-xs text-zinc-400">{field.help}</p>}
        </div>
        <span className="text-xs font-mono text-zinc-500">{value.length}</span>
      </div>
      <ul className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open === i
          const label = String(item[field.titleKey] ?? '') || `New ${field.itemLabel}`
          return (
            <li key={i} className="rounded-xl border border-zinc-800 bg-[#0E1526]">
              <div className="flex items-center gap-1 pl-2 pr-1 py-1">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex-1 min-w-0 flex items-center gap-2 text-left py-1.5 text-sm text-zinc-100 hover:text-gold-400"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{label}</span>
                </button>
                <button type="button" className={smallBtn} disabled={i === 0} onClick={() => { onChange(move(value, i, i - 1)); setOpen(isOpen ? i - 1 : open) }} aria-label={`Move ${label} up`}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className={smallBtn} disabled={i === value.length - 1} onClick={() => { onChange(move(value, i, i + 1)); setOpen(isOpen ? i + 1 : open) }} aria-label={`Move ${label} down`}>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={smallBtn}
                  onClick={() => {
                    const copy = structuredClone(item)
                    if ('id' in copy) copy.id = ''
                    onChange([...value.slice(0, i + 1), copy, ...value.slice(i + 1)])
                    setOpen(i + 1)
                  }}
                  aria-label={`Duplicate ${label}`}
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={`${smallBtn} hover:text-red-300`}
                  onClick={() => {
                    if (!window.confirm(`Remove “${label}”? (Nothing changes on the site until you save.)`)) return
                    onChange(value.filter((_, j) => j !== i))
                    setOpen(null)
                  }}
                  aria-label={`Remove ${label}`}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800">
                  <Fields fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} ctx={ctx} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={() => {
          onChange([...value, blank()])
          setOpen(value.length)
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-zinc-700 text-xs font-mono text-gold-500 hover:border-gold-500"
      >
        <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel}
      </button>
    </section>
  )
}

function LogoInput({ field, value, onChange, ctx, parent }: { field: Extract<Field, { type: 'logo' }>; value: string; onChange: (v: Json) => void; ctx: Ctx; parent: Obj }) {
  const pick = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const id = useId()
  const live = String(parent.liveUrl ?? '')
  let favicon = ''
  try {
    if (/^https?:\/\//.test(live)) favicon = `${new URL(live).origin}/favicon.ico`
  } catch {}
  const shown = ctx.previews.get(value) ?? value ?? ''
  const src = shown || favicon
  return (
    <div className="space-y-1.5">
      <Label field={field} htmlFor={id} />
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`h-12 w-12 shrink-0 rounded-xl border border-zinc-700 inline-flex items-center justify-center overflow-hidden ${
            value && parent.logoFill ? '' : 'bg-white p-1.5'
          }`}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className={`h-full w-full ${value && parent.logoFill ? 'object-cover' : 'object-contain'}`} />
          ) : (
            <span className="text-[10px] text-zinc-500">none</span>
          )}
        </span>
        <div className="flex-1 min-w-[12rem] space-y-1.5">
          <input id={id} className={input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/project-logos/name.svg or https://…" spellCheck={false} />
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <button type="button" onClick={() => pick.current?.click()} className="inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400">
              <ImagePlus className="h-3.5 w-3.5" /> Upload logo
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="text-zinc-400 hover:text-zinc-100">
                {favicon ? 'Use the site’s own icon instead' : 'Remove logo'}
              </button>
            )}
            {!value && <span className="text-zinc-500">{favicon ? 'Showing the site’s own icon (favicon).' : 'Initials are shown.'}</span>}
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
      <input
        ref={pick}
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/webp,image/gif,image/x-icon,.ico"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (!f) return
          setError('')
          try {
            const base = String(parent[field.nameFrom ?? 'id'] ?? '').replace(/[^a-z0-9-]/g, '') || 'logo'
            onChange(await ctx.addLogo(f, base))
          } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
          }
        }}
      />
    </div>
  )
}
