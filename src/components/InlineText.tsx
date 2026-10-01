import React from 'react'
import Link from 'next/link'

// Renders the small bit of formatting allowed in editable site text:
// **bold**, *italic*, `code` and [link text](https://…). Everything else is
// plain text (React escapes it), so content files can't inject HTML.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

export function InlineText({ text, linkClassName = 'text-gold-500 hover:underline' }: { text: string; linkClassName?: string }) {
  const parts = text.split(TOKEN)
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code key={i} className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-xs lg:text-[10px] text-gold-400">
              {part.slice(1, -1)}
            </code>
          )
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
          const [, label, href] = link
          if (href.startsWith('/'))
            return (
              <Link key={i} href={href} className={linkClassName}>
                {label}
              </Link>
            )
          const external = /^https?:/.test(href)
          return (
            <a key={i} href={href} className={linkClassName} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {label}
            </a>
          )
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}
