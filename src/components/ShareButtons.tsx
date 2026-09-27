'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { Check, Link2, Mail, Share2 } from 'lucide-react'

// Share links for a post. Plain URLs to each network's share page (no
// third-party scripts or trackers), plus copy-link and the phone's native
// share sheet where the browser supports it.
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  // The native share sheet exists only in some browsers; checked after hydration.
  const canShare = useSyncExternalStore(noop, () => 'share' in navigator, () => false)
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const links = [
    { label: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}`, icon: <XIcon /> },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <LinkedInIcon /> },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <FacebookIcon /> },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: <WhatsAppIcon /> },
    { label: 'Email', href: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`, icon: <Mail className="h-4 w-4" /> },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // cancelled or unsupported: nothing to do
    }
  }

  const button =
    'inline-flex items-center justify-center h-11 min-w-11 px-3 rounded-full border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-500/60 transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share this post">
      <span className="text-sm text-zinc-300 mr-1">Share this post</span>
      {canShare && (
        <button type="button" onClick={nativeShare} className={button} aria-label="Share with an app on this device">
          <Share2 className="h-4 w-4" />
        </button>
      )}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.label === 'Email' ? undefined : '_blank'}
          rel="noopener noreferrer"
          className={button}
          aria-label={`Share on ${l.label}`}
          title={`Share on ${l.label}`}
        >
          {l.icon}
        </a>
      ))}
      <button type="button" onClick={copy} className={`${button} gap-1.5 text-xs font-mono`} aria-live="polite">
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
        <span>{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  )
}

const noop = () => () => {}

// Brand marks as simple inline SVGs (lucide has no brand icons).
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.9 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.7L8.3 3.9H6.5L17.8 20Z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z" />
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1Z" />
  </svg>
)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
)
