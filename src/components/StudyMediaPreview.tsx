import Image from 'next/image'
import { InlineText } from '@/components/InlineText'
import type { StudyMedia } from '@/lib/case-studies'
import { parsePublicUrl } from '@/lib/public-url'

export function StudyMediaPreview({ media, resource, preview = false }: {
  media: StudyMedia
  resource?: { label: string; url: string }
  preview?: boolean
}) {
  if (media.kind !== 'audio' && media.kind !== 'image') return null
  const url = parsePublicUrl(resource?.url)
  const image = media.kind === 'image' && (
    <Image src={media.src} alt={media.description} width={800} height={529}
      className="block h-auto w-full rounded-lg" />
  )
  return (
    <figure className="min-w-0 space-y-2 rounded-xl border border-zinc-700 bg-[#0B1120] p-3 sm:p-4">
      <figcaption className="text-sm font-semibold text-zinc-100">{media.caption}</figcaption>
      {media.kind === 'audio' ? (
        <>
          <audio controls preload="none" src={media.src} aria-label={media.caption} className="block w-full min-w-0" />
          <p lang={media.lang || undefined} className="text-base leading-relaxed text-zinc-200">{media.description}</p>
        </>
      ) : url && url.kind !== 'email' && !preview ? (
        <a href={url.href} aria-label={resource?.label} className="block rounded-lg focus-visible:outline-2 focus-visible:outline-gold-500"
          {...(url.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {image}
        </a>
      ) : image}
      {media.credit && <p className="text-xs text-zinc-300"><InlineText text={media.credit} /></p>}
    </figure>
  )
}
