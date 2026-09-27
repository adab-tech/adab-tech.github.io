'use client'

import { COMMENTS_API } from '@/config/blog'

export type PublicComment = { id: number; name: string; body: string; created_at: string; is_author: number }
export type AdminComment = PublicComment & { post: string; status: 'pending' | 'approved' }

const base = () => COMMENTS_API.replace(/\/$/, '')

async function call<T>(path: string, init: RequestInit = {}, adminKey?: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${base()}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(adminKey ? { Authorization: `Bearer ${adminKey}` } : {}),
      },
    })
  } catch {
    throw new Error('Could not reach the comment service. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data as T
}

export const listComments = (post: string) =>
  call<{ comments: PublicComment[] }>(`/comments?post=${encodeURIComponent(post)}`).then((r) => r.comments)

export const postComment = (c: { post: string; name: string; body: string; website: string; t: number }) =>
  call<{ ok: boolean }>('/comments', { method: 'POST', body: JSON.stringify(c) })

export const adminList = (key: string, status: 'pending' | 'approved') =>
  call<{ comments: AdminComment[] }>(`/admin/comments?status=${status}`, {}, key).then((r) => r.comments)

export const adminApprove = (key: string, id: number) => call(`/admin/comments/${id}/approve`, { method: 'POST' }, key)

export const adminDelete = (key: string, id: number) => call(`/admin/comments/${id}`, { method: 'DELETE' }, key)

export const adminReply = (key: string, post: string, body: string) =>
  call('/admin/comments', { method: 'POST', body: JSON.stringify({ post, body }) }, key)
