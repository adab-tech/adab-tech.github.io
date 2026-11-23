import sanitizeHtml from 'sanitize-html'
import { parsePublicUrl } from './public-url'

const YOUTUBE_HOST = 'www.youtube-nocookie.com'

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img', 's', 'u', 'del', 'figure', 'figcaption', 'iframe',
    ],
    allowedSchemes: ['https', 'mailto'],
    allowedSchemesByTag: { img: ['https'], iframe: ['https'] },
    allowProtocolRelative: false,
    allowedIframeHostnames: [YOUTUBE_HOST],
    allowIframeRelativeUrls: false,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'title', 'loading', 'referrerpolicy'],
      iframe: ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy', 'sandbox'],
      ol: ['start', 'reversed'],
      code: ['class'],
      p: ['style'],
      h1: ['style'],
      h2: ['style'],
      h3: ['style'],
      h4: ['style'],
      table: ['style'],
      col: ['style'],
      th: ['colspan', 'rowspan', 'scope', 'style'],
      td: ['colspan', 'rowspan', 'style'],
    },
    allowedClasses: { code: ['language-*'] },
    allowedStyles: {
      '*': { 'text-align': [/^(?:left|center|right|justify)$/] },
      table: { width: [/^\d+(?:\.\d+)?(?:px|%)$/], 'min-width': [/^\d+(?:\.\d+)?px$/] },
      col: { width: [/^\d+(?:\.\d+)?(?:px|%)$/], 'min-width': [/^\d+(?:\.\d+)?px$/] },
    },
    transformTags: {
      a: (tagName, attribs): sanitizeHtml.Tag => {
        const link = parsePublicUrl(attribs.href)
        if (!link) return { tagName: 'span', attribs: {} }
        if (link.kind !== 'external') return { tagName, attribs: { href: link.href } }
        return {
          tagName,
          attribs: {
            href: link.href,
            title: link.host,
            ...(attribs.target === '_blank' ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
        }
      },
      img: (tagName, attribs) => {
        const image = parsePublicUrl(attribs.src)
        if (!image || image.kind === 'email' || image.href.startsWith('#')) {
          return { tagName: 'img', attribs: {} }
        }
        return {
          tagName,
          attribs: { ...attribs, src: image.href, loading: 'lazy', referrerpolicy: 'no-referrer' },
        }
      },
      iframe: (tagName, attribs): sanitizeHtml.Tag => {
        const video = parsePublicUrl(attribs.src)
        if (video?.kind !== 'external' || video.host !== YOUTUBE_HOST ||
            !/^\/embed\/[\w-]{11}$/.test(new URL(video.href).pathname)) {
          return { tagName, attribs: {} }
        }
        return {
          tagName,
          attribs: {
            src: video.href,
            ...(attribs.width ? { width: attribs.width } : {}),
            ...(attribs.height ? { height: attribs.height } : {}),
            title: 'YouTube video',
            loading: 'lazy',
            allow: 'encrypted-media; picture-in-picture',
            allowfullscreen: '',
            referrerpolicy: 'strict-origin-when-cross-origin',
            sandbox: 'allow-scripts allow-same-origin allow-presentation',
          },
        }
      },
    },
    exclusiveFilter: ({ tag, attribs }) => (
      (tag === 'iframe' || tag === 'img') && !attribs.src
    ),
  })
}
