'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { buildBibTeX, formatData, inspectLink, inspectText } from '@/lib/browser-tools'

const fieldClass = 'w-full rounded-lg border border-zinc-700 bg-[#0B1120] px-3 py-2 text-sm text-zinc-100 focus-visible:outline-2 focus-visible:outline-gold-500'
const actionClass = 'min-h-10 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-sm font-semibold text-gold-500 hover:bg-gold-500/20 focus-visible:outline-2 focus-visible:outline-gold-500'

function ToolCard({ id, title, description, children }: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 space-y-4 rounded-2xl border border-zinc-800 bg-[#0E1526] p-4 sm:p-6">
      <header className="space-y-1.5">
        <h2 id={`${id}-heading`} className="font-mono text-lg font-semibold text-zinc-50">{title}</h2>
        <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
      </header>
      {children}
    </section>
  )
}

function Output({ label, value }: { label: string; value: string }) {
  const [copyStatus, setCopyStatus] = useState<{ value: string; message: string } | null>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus({ value, message: 'Copied.' })
    } catch {
      setCopyStatus({ value, message: 'Select and copy the output manually.' })
    }
  }

  return (
    <div className="space-y-2 border-t border-zinc-800 pt-4">
      <label className="block space-y-1.5 text-sm text-zinc-300">
        <span>{label}</span>
        <textarea className={`${fieldClass} font-mono`} rows={5} value={value} readOnly spellCheck={false} dir="auto" />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={actionClass} onClick={copy}>Copy output</button>
        <span role="status" className="text-xs text-zinc-300">{copyStatus?.value === value && copyStatus.message}</span>
      </div>
    </div>
  )
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 240) : 'The input could not be processed.'
}

function DataTool() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<'json' | 'jsonl'>('json')
  const [result, setResult] = useState<ReturnType<typeof formatData> | null>(null)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)
    try {
      setResult(formatData(input, format))
    } catch (cause) {
      setError(errorMessage(cause))
    }
  }

  return (
    <ToolCard id="data" title="JSON and JSON Lines" description="Indent JSON or validate a dataset with one JSON value per line. Formatting preserves large numbers and key order.">
      <form className="space-y-3" onSubmit={submit}>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>Input format</span>
          <select className={fieldClass} value={format} onChange={(event) => setFormat(event.target.value as typeof format)}>
            <option value="json">JSON</option>
            <option value="jsonl">JSON Lines (JSONL)</option>
          </select>
        </label>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>Data</span>
          <textarea
            className={`${fieldClass} font-mono`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={5}
            placeholder={'{"id": 1, "text": "Sannu"}'}
            required
            spellCheck={false}
          />
        </label>
        <button className={actionClass}>Validate and format</button>
      </form>
      {error && <p role="alert" className="break-words text-sm text-rose-300">{error}</p>}
      {result && (
        <>
          <p role="status" className="text-sm text-emerald-300">{result.summary}</p>
          <Output label="Formatted data" value={result.output} />
        </>
      )}
    </ToolCard>
  )
}

function TextTool() {
  const [input, setInput] = useState('')
  const [form, setForm] = useState<'NFC' | 'NFD'>('NFC')
  const [result, setResult] = useState<ReturnType<typeof inspectText> | null>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(inspectText(input, form))
  }

  return (
    <ToolCard id="text" title="Unicode text" description="Normalize text while retaining accents and language-specific letters. Inspect the characters stored in a transcript or corpus.">
      <form className="space-y-3" onSubmit={submit}>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>Normalization form</span>
          <select className={fieldClass} value={form} onChange={(event) => setForm(event.target.value as typeof form)}>
            <option value="NFC">NFC · compose where possible</option>
            <option value="NFD">NFD · decompose into base and marks</option>
          </select>
        </label>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>Text</span>
          <textarea
            className={fieldClass}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={5}
            placeholder="Sannu. Ƙamus ɗin Hausa."
            required
            spellCheck={false}
            dir="auto"
          />
        </label>
        <button className={actionClass}>Normalize and inspect</button>
      </form>
      {result && (
        <>
          <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              ['Text clusters', result.graphemes ?? 'Unavailable'],
              ['Code points', result.codePoints],
              ['Combining marks', result.combiningMarks],
              ['UTF-8 bytes', result.bytes],
            ].map(([label, count]) => (
              <div key={label} className="rounded border border-zinc-800 bg-[#0B1120] p-2">
                <dt className="text-zinc-400">{label}</dt>
                <dd className="font-mono font-semibold text-zinc-100">{typeof count === 'number' ? count.toLocaleString() : count}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs leading-relaxed text-zinc-300">
            First 32 code points<br />
            <code className="break-words">{result.preview}</code>
          </p>
          <Output label="Normalized text" value={result.output} />
        </>
      )}
    </ToolCard>
  )
}

type Citation = Parameters<typeof buildBibTeX>[0]

function CitationTool() {
  const [citation, setCitation] = useState<Citation>({ type: 'article', key: '', author: '', title: '', year: '', publisher: '', doi: '' })
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOutput('')
    setError('')
    try {
      setOutput(buildBibTeX(citation))
    } catch (cause) {
      setError(errorMessage(cause))
    }
  }

  return (
    <ToolCard id="citations" title="BibTeX citation" description="Build a citation from publication details you’ve verified. Separate multiple authors with “and”.">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>Publication type</span>
          <select
            className={fieldClass}
            value={citation.type}
            onChange={(event) => setCitation({ ...citation, type: event.target.value as Citation['type'], publisher: '' })}
          >
            <option value="article">Journal article</option>
            <option value="book">Book</option>
            <option value="misc">Other publication</option>
          </select>
        </label>
        {([
          ['key', 'Citation key', 'Abubakar2026'],
          ['author', 'Author(s)', 'Abubakar, Adamu'],
          ['year', 'Year', '2026'],
          ['title', 'Title', ''],
          ['publisher', citation.type === 'article' ? 'Journal' : 'Publisher', ''],
          ['doi', 'DOI (optional)', '10.1234/example'],
        ] as const)
          .filter(([field]) => field !== 'publisher' || citation.type !== 'misc')
          .map(([field, label, placeholder]) => (
            <label key={field} className={`block space-y-1.5 text-sm text-zinc-300 ${field === 'title' ? 'sm:col-span-2' : ''}`}>
              <span>{label}</span>
              <input
                className={fieldClass}
                value={citation[field]}
                onChange={(event) => setCitation({ ...citation, [field]: event.target.value })}
                placeholder={placeholder}
                inputMode={field === 'year' ? 'numeric' : undefined}
                required={field !== 'doi'}
                spellCheck={false}
              />
            </label>
          ))}
        <div className="sm:col-span-2">
          <button className={actionClass}>Generate BibTeX</button>
        </div>
      </form>
      {error && <p role="alert" className="break-words text-sm text-rose-300">{error}</p>}
      {output && <Output label="BibTeX entry" value={output} />}
    </ToolCard>
  )
}

function LinkTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ReturnType<typeof inspectLink> | null>(null)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    setError('')
    try {
      setResult(inspectLink(input))
    } catch (cause) {
      setError(errorMessage(cause))
    }
  }

  return (
    <ToolCard id="links" title="Link inspector" description="Parse a link locally to see its destination and spot misleading details.">
      <form className="space-y-3" onSubmit={submit}>
        <label className="block space-y-1.5 text-sm text-zinc-300">
          <span>HTTP or HTTPS URL</span>
          <input
            className={`${fieldClass} font-mono`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://example.org/"
            inputMode="url"
            required
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        <button className={actionClass}>Inspect link</button>
      </form>
      {error && <p role="alert" className="break-words text-sm text-rose-300">{error}</p>}
      {result && (
        <div className="space-y-3 border-t border-zinc-800 pt-4">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-zinc-400">Hostname</dt>
              <dd className="break-all font-mono text-zinc-100" dir="ltr">{result.hostname}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Origin</dt>
              <dd className="break-all font-mono text-zinc-100" dir="ltr">{result.origin}</dd>
            </div>
          </dl>
          {result.warnings.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gold-500">
              {result.warnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          )}
          <p className="text-xs leading-relaxed text-zinc-400">Compare the hostname with the address you expect before entering credentials.</p>
        </div>
      )}
    </ToolCard>
  )
}

export function ResearchTools() {
  return (
    <>
      <nav aria-label="Tools on this page" className="flex flex-wrap gap-2">
        {[
          ['data', 'JSON and JSON Lines'],
          ['text', 'Unicode text'],
          ['citations', 'BibTeX citation'],
          ['links', 'Link inspector'],
        ].map(([id, title]) => (
          <a key={id} href={`#${id}`} className="min-h-10 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:border-gold-500/40 hover:text-gold-500 focus-visible:outline-2 focus-visible:outline-gold-500">
            {title}
          </a>
        ))}
      </nav>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <DataTool />
        <TextTool />
        <CitationTool />
        <LinkTool />
      </div>
    </>
  )
}
