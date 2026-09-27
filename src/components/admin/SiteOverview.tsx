'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, Edit3, FileText, Home, Layers, Loader2, MessageSquare, XCircle } from 'lucide-react'
import { useToken } from '@/components/admin/GitHubConnect'
import { parsePostFile } from '@/lib/blog-format'
import { ACTIONS_URL, listPosts, readPost, recentDeploys, type RecentRun } from '@/lib/github-publish'
import { PROJECTS } from '@/lib/site-content'

// The admin's front page: one card for each part of the site, and live
// numbers (posts, drafts, last deploys) read from GitHub with the saved token.
const AREAS = [
  { href: '/admin/blog/', icon: Edit3, title: 'Blog posts', text: 'Write, edit, publish, unpublish (draft) or delete posts.' },
  { href: '/admin/home/', icon: Home, title: 'Home page', text: 'Headline, introduction, buttons, Murya figures, principles, contact box.' },
  { href: '/admin/projects/', icon: Layers, title: 'Projects', text: 'Add, edit, reorder or remove projects and their logos.' },
  { href: '/admin/cv/', icon: FileText, title: 'CV', text: 'Education, experience, languages, publications, datasets.' },
  { href: '/admin/comments/', icon: MessageSquare, title: 'Comments', text: 'Open any post’s comments to delete or reply.' },
]

export function SiteOverview() {
  const token = useToken()
  const [posts, setPosts] = useState<{ published: number; drafts: number } | null>(null)
  const [deploys, setDeploys] = useState<RecentRun[] | null>(null)
  const [deployError, setDeployError] = useState('')

  useEffect(() => {
    if (!token) return
    let cancelled = false
    listPosts()
      .then(async (files) => {
        const texts = await Promise.all(files.slice(0, 60).map((f) => readPost(f.name).then((r) => r.text).catch(() => '')))
        let drafts = 0
        for (const [i, t] of texts.entries()) {
          try {
            if (parsePostFile(t, files[i].name).draft) drafts++
          } catch {}
        }
        if (!cancelled) setPosts({ published: files.length - drafts, drafts })
      })
      .catch(() => {})
    recentDeploys(3)
      .then((r) => !cancelled && setDeploys(r))
      .catch(() => !cancelled && setDeployError('Add “Actions: Read-only” to the GitHub token to see deploys here.'))
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-mono font-bold text-zinc-100">Manage the site</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AREAS.map(({ href, icon: Icon, title, text }) => (
          <a key={href} href={href} className="block p-4 rounded-2xl border border-zinc-800 bg-[#0B1120] hover:border-amber-500/60 hover:bg-amber-500/5 transition-colors">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              <Icon className="h-4 w-4" />
              <span>{title} →</span>
            </div>
            <p className="text-sm text-zinc-300 mt-1">{text}</p>
            {href === '/admin/blog/' && posts && (
              <p className="text-xs font-mono text-zinc-400 mt-2">
                {posts.published} published · {posts.drafts} draft{posts.drafts === 1 ? '' : 's'}
              </p>
            )}
            {href === '/admin/projects/' && (
              <p className="text-xs font-mono text-zinc-400 mt-2">{PROJECTS.projects.length} projects on the site</p>
            )}
          </a>
        ))}
      </div>

      {token ? (
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0B1120] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-mono font-bold text-zinc-200">Latest site updates</span>
            <a href={ACTIONS_URL} target="_blank" rel="noreferrer" className="text-xs font-mono text-amber-400 hover:underline">
              All on GitHub
            </a>
          </div>
          {deployError && <p className="text-xs text-zinc-400">{deployError}</p>}
          {!deploys && !deployError && (
            <p className="text-xs text-zinc-400 inline-flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
            </p>
          )}
          <ul className="space-y-1.5">
            {deploys?.map((d) => (
              <li key={d.html_url} className="flex items-start gap-2 text-sm">
                {d.status !== 'completed' ? (
                  <Loader2 className="h-4 w-4 mt-0.5 shrink-0 animate-spin text-zinc-400" />
                ) : d.conclusion === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
                )}
                <a href={d.html_url} target="_blank" rel="noreferrer" className="min-w-0 hover:underline">
                  <span className="text-zinc-200 break-words">{d.title}</span>{' '}
                  <span className="text-xs text-zinc-500 font-mono">{new Date(d.created_at).toLocaleString()}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-zinc-400">
          Open any editor above once to connect GitHub on this device; post counts and deploy status then show here.
        </p>
      )}
    </section>
  )
}
