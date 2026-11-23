type PublicUrl =
  | { kind: 'local' | 'email'; href: string }
  | { kind: 'external'; href: string; host: string }

// Editable content may point to local pages, HTTPS sites, or an email address.
// Parse HTTPS links so the displayed destination is the same host that the
// browser will actually visit.
export function parsePublicUrl(value: unknown): PublicUrl | null {
  if (typeof value !== 'string' || !value || /[\s\\\u0000-\u001f\u007f]/.test(value)) return null

  if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//'))) {
    return { kind: 'local', href: value }
  }

  if (/^mailto:/i.test(value)) {
    const address = value.slice(7).split('?')[0]
    return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(address)
      ? { kind: 'email', href: value }
      : null
  }

  if (!/^https:\/\/[^/]/i.test(value)) return null
  try {
    const url = new URL(value)
    if (url.username || url.password || !url.hostname) return null
    return { kind: 'external', href: url.href, host: url.host }
  } catch {
    return null
  }
}
