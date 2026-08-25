'use client'

import { useState, useEffect } from 'react'

export type StreamCategory = 'General' | 'Literary & Academic' | 'Personal' | 'Tech'

export interface ResearchPost {
  id: string
  title: string
  category: StreamCategory
  summary: string
  content: string
  date: string
  status: 'Published' | 'Draft'
  tags: string[]
  bibtex?: string
  pdfUrl?: string
  links?: { label: string; url: string }[]
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  preferredDate?: string
  createdAt: string
  status: 'New' | 'Read' | 'Replied'
}

const INITIAL_POSTS: ResearchPost[] = [
  {
    id: 'post-1',
    title: 'Hausa Acoustic Models & Zero-Shot Phonetic Alignment',
    category: 'Tech',
    summary: 'Exploring neural voice synthesis techniques for low-resource Chadic languages, focusing on Hausa tone resolution and consonant duration mapping.',
    content: `# Hausa Acoustic Models & Zero-Shot Phonetic Alignment

A study into zero-shot alignment using continuous pitch contour extraction for low-resource Chadic languages.

## Abstract
Low-resource NLP models often strip tonal diacritics during tokenization. By applying custom acoustic duration loss functions, we restore pitch representation in generated audio streams.

## Key Innovations
1. Tone pitch stability improves intelligibility by 24%.
2. Consonant duration scaling maps accurately across West African dialects.`,
    date: '2026-08',
    status: 'Published',
    tags: ['Hausa NLP', 'TTS', 'Acoustics', 'Speech AI'],
    bibtex: `@article{abubakar2026hausa,
  author = {Abubakar, Adamu},
  title = {Hausa Acoustic Models and Zero-Shot Phonetic Alignment},
  journal = {Journal of African Language Technology},
  year = {2026},
  volume = {4},
  pages = {12--28}
}`,
    pdfUrl: '#',
    links: [{ label: 'View Code', url: 'https://github.com/adab-tech' }]
  },
  {
    id: 'post-2',
    title: 'Orality, Prosody, and Scriptural Structure in Hausa Ajami Poetry',
    category: 'Literary & Academic',
    summary: 'A critical textual analysis examining rhythm, metric scansion, and dialectal variations in 19th-century West African Ajami manuscripts.',
    content: `# Orality, Prosody, and Scriptural Structure in Hausa Ajami Poetry

A critical textual analysis examining rhythm, metric scansion, and dialectal variations in West African Ajami manuscripts.

## Abstract
West African Ajami manuscripts encode oral poetic meter through specialized orthographic diacritics. This paper maps 19th-century Kano manuscript verse demarcations to contemporary Hausa prosodic theory.`,
    date: '2026-05',
    status: 'Published',
    tags: ['Ajami Manuscripts', 'African Literature', 'Philology'],
    bibtex: `@article{abubakar2026orality,
  author = {Abubakar, Adamu},
  title = {Orality, Prosody, and Scriptural Structure in Hausa Ajami Poetry},
  journal = {African Philology and Digital Humanities},
  year = {2026},
  volume = {12},
  pages = {101--125}
}`,
    pdfUrl: '#',
    links: [{ label: 'Download PDF', url: '#' }]
  },
  {
    id: 'post-3',
    title: 'Computational Morphology for Resource-Constrained African Languages',
    category: 'Literary & Academic',
    summary: 'Methodology for automated morphological segmentation, inflections, and verb class categorization across West African linguistic families.',
    content: `# Computational Morphology for Resource-Constrained African Languages

Methodology for automated morphological segmentation, inflections, and verb class categorization.`,
    date: '2026-03',
    status: 'Published',
    tags: ['Morphology', 'Computational Linguistics', 'NLP'],
    bibtex: `@inproceedings{abubakar2026morphology,
  author = {Abubakar, Adamu},
  title = {Computational Morphology for Resource-Constrained African Languages},
  booktitle = {Proceedings of ACL Workshop on African NLP},
  year = {2026}
}`,
    pdfUrl: '#',
    links: [{ label: 'Paper Abstract', url: '#' }]
  },
  {
    id: 'post-4',
    title: 'Sovereign Compute & Scalable AI Infrastructure for Regional Labs',
    category: 'Tech',
    summary: 'Benchmarking localized GPU cluster operations and edge model deployments across West African networks.',
    content: `# Sovereign Compute & Scalable AI Infrastructure

Benchmarking localized GPU cluster operations and edge model deployments across West African networks.`,
    date: '2026-01',
    status: 'Published',
    tags: ['Infrastructure', 'Cloudflare', 'Edge AI'],
    links: [{ label: 'System Spec', url: '#' }]
  }
]

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Dr. Katherine Miller',
    email: 'k.miller@linguistics-lab.org',
    subject: 'Academic / AI Collaboration',
    message: 'We read your paper on Hausa acoustic models and zero-shot alignment. We would love to discuss a potential collaborative research grant for West African speech synthesis.',
    preferredDate: '2026-09-15',
    createdAt: '2026-08-24 14:30',
    status: 'New'
  }
]

const POSTS_KEY = 'adamu_tech_posts_data'
const INQUIRIES_KEY = 'adamu_tech_inquiries_data'

export function getStoredPosts(): ResearchPost[] {
  if (typeof window === 'undefined') return INITIAL_POSTS
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    if (!raw) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS))
      return INITIAL_POSTS
    }
    return JSON.parse(raw)
  } catch (e) {
    return INITIAL_POSTS
  }
}

export function savePosts(posts: ResearchPost[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  }
}

export function getStoredInquiries(): ContactInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY)
    if (!raw) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES))
      return INITIAL_INQUIRIES
    }
    return JSON.parse(raw)
  } catch (e) {
    return INITIAL_INQUIRIES
  }
}

export function saveInquiries(inquiries: ContactInquiry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries))
  }
}

export function addContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): ContactInquiry {
  const newInquiry: ContactInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'New'
  }
  if (typeof window !== 'undefined') {
    const current = getStoredInquiries()
    const updated = [newInquiry, ...current]
    saveInquiries(updated)
  }
  return newInquiry
}

export function usePostsStore() {
  const [posts, setPosts] = useState<ResearchPost[]>(INITIAL_POSTS)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(INITIAL_INQUIRIES)

  useEffect(() => {
    setPosts(getStoredPosts())
    setInquiries(getStoredInquiries())
  }, [])

  const addPost = (post: Omit<ResearchPost, 'id' | 'date'>) => {
    const newPost: ResearchPost = {
      ...post,
      id: `post-${Date.now()}`,
      date: new Date().toISOString().substring(0, 7)
    }
    const updated = [newPost, ...posts]
    setPosts(updated)
    savePosts(updated)
    return newPost
  }

  const updatePost = (id: string, updatedFields: Partial<ResearchPost>) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    setPosts(updated)
    savePosts(updated)
  }

  const deletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id)
    setPosts(updated)
    savePosts(updated)
  }

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    setInquiries(updated)
    saveInquiries(updated)
  }

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id)
    setInquiries(updated)
    saveInquiries(updated)
  }

  return { posts, addPost, updatePost, deletePost, inquiries, updateInquiryStatus, deleteInquiry }
}
