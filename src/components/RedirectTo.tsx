import Link from 'next/link'

// Static-export redirect: GitHub Pages can't send HTTP redirects, so old URLs
// render this page, which refreshes to `href` (works without JavaScript) and
// points search engines at the canonical page.
export function RedirectTo({ href }: { href: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <link rel="canonical" href={`https://adamu.tech${href}`} />
      <main className="min-h-screen flex items-center justify-center p-6 text-sm text-zinc-300">
        <p>
          This page has moved to <Link href={href} className="text-amber-400 underline">{`adamu.tech${href}`}</Link>.
        </p>
      </main>
    </>
  )
}
