'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { usePostsStore, ResearchPost, StreamCategory } from '@/lib/posts-store'
import { AdminHeader } from '@/components/AdminHeader'
import { Edit3, Eye, FileCode, Plus, CheckCircle2, Layers, Quote, BookOpen, Cpu } from 'lucide-react'

export default function AdminDashboardPage() {
  const { isAuthenticated, loading } = useAdminAuth()
  const { posts, addPost, updatePost, deletePost } = usePostsStore()
  const router = useRouter()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<StreamCategory>('Literary & Academic')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [bibtexInput, setBibtexInput] = useState('')
  const [previewMode, setPreviewMode] = useState<'serif' | 'mono' | 'sans'>('serif')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">
        Verifying Session Authentication...
      </div>
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)

    if (editingId) {
      updatePost(editingId, {
        title,
        category,
        summary,
        content,
        tags,
        bibtex: bibtexInput
      })
      setNotification('Publication updated successfully!')
    } else {
      addPost({
        title,
        category,
        summary,
        content,
        status: 'Published',
        tags,
        bibtex: bibtexInput,
        pdfUrl: '#',
        links: [{ label: 'View Article', url: '#' }]
      })
      setNotification('New research publication live!')
    }

    setEditingId(null)
    setTitle('')
    setSummary('')
    setContent('')
    setTagsInput('')
    setBibtexInput('')
    setTimeout(() => setNotification(''), 3000)
  }

  const startEdit = (post: ResearchPost) => {
    setEditingId(post.id)
    setTitle(post.title)
    setCategory(post.category)
    setSummary(post.summary)
    setContent(post.content || post.summary)
    setTagsInput(post.tags.join(', '))
    setBibtexInput(post.bibtex || '')
    window.scrollTo({ top: 250, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-10">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-200 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-midnight-900 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Total Publications</span>
            <div className="text-2xl font-mono font-bold text-zinc-100">{posts.length}</div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-midnight-900 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Academic Papers</span>
            <div className="text-2xl font-mono font-bold text-gold-400">
              {posts.filter((p) => p.category === 'Literary & Academic').length}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-midnight-900 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Tech Specifications</span>
            <div className="text-2xl font-mono font-bold text-emerald-400">
              {posts.filter((p) => p.category === 'Tech').length}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-midnight-900 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Published Status</span>
            <div className="text-2xl font-mono font-bold text-indigo-400">
              {posts.filter((p) => p.status === 'Published').length} Live
            </div>
          </div>
        </div>

        {/* Writing Studio Editor */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-gold-400" />
              {editingId ? 'EDIT RESEARCH PUBLICATION' : 'CREATE NEW RESEARCH PUBLICATION'}
            </h2>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  setTitle('')
                  setSummary('')
                  setContent('')
                  setTagsInput('')
                  setBibtexInput('')
                }}
                className="text-xs font-mono text-zinc-400 hover:text-white underline"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 p-6 rounded-2xl border border-zinc-800 bg-midnight-900 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-mono text-zinc-400">Publication Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hausa Acoustic Models & Zero-Shot Phonetic Alignment"
                  className="w-full px-3.5 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Stream Taxonomy *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StreamCategory)}
                  className="w-full px-3.5 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="Literary & Academic">Literary & Academic</option>
                  <option value="Tech">Tech</option>
                  <option value="General">General</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-400">Abstract / Summary *</label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of research findings..."
                className="w-full p-3 rounded-lg border border-zinc-800 bg-midnight-950 font-sans text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Split Pane Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
              <div className="flex flex-col border border-zinc-800 rounded-xl bg-midnight-950 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5" /> Markdown Content
                  </span>
                  <span className="text-[10px] text-zinc-500">Live Input</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type research body in Markdown..."
                  className="flex-1 w-full p-3 font-mono text-xs bg-transparent text-zinc-100 resize-none focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col border border-zinc-800 rounded-xl bg-midnight-950 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> Live Preview
                  </span>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('serif')}
                      className={`px-2 py-0.5 rounded ${previewMode === 'serif' ? 'bg-gold-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
                    >
                      Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mono')}
                      className={`px-2 py-0.5 rounded ${previewMode === 'mono' ? 'bg-gold-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
                    >
                      Mono
                    </button>
                  </div>
                </div>

                <div
                  className={`flex-1 p-4 overflow-y-auto ${
                    previewMode === 'serif'
                      ? 'font-serif text-sm leading-relaxed text-zinc-200'
                      : 'font-mono text-xs leading-normal text-zinc-300'
                  }`}
                >
                  {content ? (
                    content.split('\n\n').map((block, i) => (
                      <p key={i} className="mb-2">
                        {block}
                      </p>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-xs font-mono">Live rendered preview will display here...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Hausa NLP, TTS, Acoustics"
                  className="w-full px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Quote className="h-3 w-3 text-gold-400" /> BibTeX Citation String
                </label>
                <input
                  type="text"
                  value={bibtexInput}
                  onChange={(e) => setBibtexInput(e.target.value)}
                  placeholder="@article{abubakar2026, ...}"
                  className="w-full px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>{editingId ? 'Update Publication' : 'Publish Publication Live'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Publication Manager Table */}
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-zinc-400" />
            PUBLICATION MANAGER & ARCHIVE ({posts.length})
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-midnight-900 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-midnight-950/60 text-[11px] font-mono text-zinc-400 uppercase">
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Stream</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-xs text-zinc-300">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-zinc-100">{post.title}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-zinc-400">{post.date}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() =>
                          updatePost(post.id, {
                            status: post.status === 'Published' ? 'Draft' : 'Published'
                          })
                        }
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          post.status === 'Published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {post.status}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 text-[11px] transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
