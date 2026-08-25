'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { usePostsStore, ResearchPost, StreamCategory, ContactInquiry } from '@/lib/posts-store'
import { AdminHeader } from '@/components/AdminHeader'
import { Edit3, Eye, FileCode, Plus, CheckCircle2, Layers, Quote, Key, Mail, Check, Inbox, Reply, Trash2, Calendar } from 'lucide-react'

export default function AdminDashboardPage() {
  const { isAuthenticated, loading, updatePassword, currentPassword } = useAdminAuth()
  const { posts, addPost, updatePost, deletePost, inquiries, updateInquiryStatus, deleteInquiry } = usePostsStore()
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

  // Password Management State
  const [newPass, setNewPass] = useState('')
  const [passNotice, setPassNotice] = useState('')

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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass.trim().length < 4) {
      setPassNotice('Password must be at least 4 characters long.')
      return
    }
    updatePassword(newPass.trim())
    setNewPass('')
    setPassNotice('Admin password updated successfully!')
    setTimeout(() => setPassNotice(''), 3500)
  }

  const startEdit = (post: ResearchPost) => {
    setEditingId(post.id)
    setTitle(post.title)
    setCategory(post.category)
    setSummary(post.summary || post.abstract || "")
    setContent(post.content || post.summary || post.abstract || "")
    setTagsInput(post.tags.join(', '))
    setBibtexInput(post.bibtex || '')
    window.scrollTo({ top: 250, behavior: 'smooth' })
  }

  const handleReplyToInquiry = (inquiry: ContactInquiry) => {
    updateInquiryStatus(inquiry.id, 'Replied')
    const mailSubject = encodeURIComponent(`Re: [${inquiry.subject}] Message to Adamu Abubakar`)
    const mailBody = encodeURIComponent(`Hi ${inquiry.name},\n\nThank you for reaching out regarding "${inquiry.subject}".\n\n`)
    window.location.href = `mailto:${inquiry.email}?subject=${mailSubject}&body=${mailBody}`
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
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Inquiries Received</span>
            <div className="text-2xl font-mono font-bold text-indigo-400">
              {inquiries.length} Messages
            </div>
          </div>
        </div>

        {/* Contact Form Inquiries Inbox */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-amber-500" />
              Inquiries & Booking Inbox ({inquiries.length})
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              Target Mail: <strong className="text-zinc-200">adamudanjuma1@outlook.com</strong> / <strong className="text-zinc-200">contact@adamu.tech</strong>
            </span>
          </div>

          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 rounded-xl border border-zinc-800 bg-midnight-900 text-center font-mono text-xs text-zinc-500">
                No contact form submissions recorded yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-xl border border-zinc-800 bg-midnight-900 space-y-3 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-zinc-100">{inq.name}</span>
                      <span className="text-zinc-400">&lt;{inq.email}&gt;</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {inq.subject}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      {inq.preferredDate && (
                        <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-gold-400" /> {inq.preferredDate}
                        </span>
                      )}
                      <span className="text-zinc-500 text-[11px]">{inq.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-zinc-300 leading-relaxed bg-midnight-950 p-3 rounded-lg border border-zinc-800/80">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 font-mono text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      inq.status === 'Replied'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      Status: {inq.status}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReplyToInquiry(inq)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-gold-500 text-zinc-950 font-bold hover:bg-gold-400 text-xs transition-colors shadow-sm"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        <span>Reply via Outlook</span>
                      </button>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-1 rounded bg-zinc-800 hover:bg-red-950 hover:text-red-300 text-zinc-400 transition-colors"
                        aria-label="Delete inquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Writing Studio Editor */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-gold-400" />
              {editingId ? 'Edit Research Publication' : 'Create New Research Publication'}
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

        {/* Admin Password & Domain Security Panel */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Admin Password Change Form */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-midnight-900 space-y-4">
            <h3 className="text-base font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Key className="h-4 w-4 text-gold-400" />
              Admin Password Management
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Update the secret password used to access this Admin Studio across devices.
            </p>

            {passNotice && (
              <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-gold-400 text-xs font-mono flex items-center gap-2">
                <Check className="h-3.5 w-3.5" />
                <span>{passNotice}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Current Password</label>
                <input
                  type="text"
                  disabled
                  value={currentPassword}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new admin password..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-mono text-xs text-zinc-100 font-bold transition-colors"
              >
                Save New Password
              </button>
            </form>
          </div>

          {/* Domain & Email Delivery Status */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-midnight-900 space-y-4">
            <h3 className="text-base font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              Domain & Email Delivery Configuration
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Verified domain records & direct Outlook mail forwarding.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Primary Recipient Email:</span>
                <span className="text-emerald-400 font-bold">adamudanjuma1@outlook.com</span>
              </div>
              <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Verified Domain Email:</span>
                <span className="text-gold-400">contact@adamu.tech</span>
              </div>
              <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Cloudflare + Resend DNS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active & Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Manager Table */}
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-zinc-400" />
            Publication Manager & Archive ({posts.length})
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
