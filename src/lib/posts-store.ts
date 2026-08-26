'use client'

import { useState, useEffect } from 'react'

export type StreamCategory = 'Literary & Academic' | 'Tech' | 'General' | 'Personal'

export interface ResearchPost {
  id: string
  title: string
  category: StreamCategory
  date: string
  abstract?: string
  summary?: string
  tags: string[]
  content: string
  bibtex?: string
  pdfUrl?: string
  linkUrl?: string
  links?: { label: string; url: string }[]
  status: 'Published' | 'Draft'
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  preferredDate?: string
  date?: string
  createdAt?: string
  status: 'New' | 'Read' | 'Replied'
}

const INITIAL_POSTS: ResearchPost[] = [
  {
    id: 'post-agentic-humanities',
    title: 'Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance',
    category: 'Literary & Academic',
    date: '2026-08',
    abstract: 'Investigates the philosophical contest of AI agency through literary and postcolonial theory across four global case studies: the AI deepfake of Wole Soyinka, China\'s Agent Hospital, Sophia\'s Saudi citizenship, and Project CETI sperm whale bioacoustics.',
    summary: 'Investigates the philosophical contest of AI agency through literary and postcolonial theory across four global case studies: the AI deepfake of Wole Soyinka, China\'s Agent Hospital, Sophia\'s Saudi citizenship, and Project CETI sperm whale bioacoustics.',
    tags: ['Agentic AI', 'Postcolonial Theory', 'AI Governance', 'Cultural Epistemology', 'Wole Soyinka Deepfake'],
    content: '# Humanities Perspectives on Agentic AI\n\n### Abstract\nThe emergence of agentic AI—systems that plan, act, adapt, and operate with increasing autonomy—marks a fundamental shift in human-machine interaction. This paper demonstrates why technical frameworks alone cannot resolve the ontological contest of agency, utilizing humanistic traditions to establish an indigenous cultural governance blueprint.',
    bibtex: `@article{abubakar2026agentic,
  title={Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance},
  author={Abubakar, Adamu Danjuma},
  journal={Working Papers in Applied Computational Humanities},
  year={2026},
  institution={University of Alabama}
}`,
    status: 'Published'
  },
  {
    id: 'post-robinson-lexicon',
    title: 'Robinson Hausa–English Lexicon (1914): 20,628 Pairs for Neural Voice & ASR Alignment',
    category: 'Tech',
    date: '2026-08',
    abstract: 'Curated and open-sourced 20,628 English→Hausa word/phrase pairs from C.H. Robinson\'s Cambridge dictionary (1914) to warm-start speech embedding spaces and lexical translation for Murya AI on Hugging Face.',
    summary: 'Curated and open-sourced 20,628 English→Hausa word/phrase pairs from C.H. Robinson\'s Cambridge dictionary (1914) to warm-start speech embedding spaces and lexical translation for Murya AI on Hugging Face.',
    tags: ['Hausa NLP', 'Lexicography', 'Speech AI', 'Hugging Face', 'Murya'],
    content: '# Robinson Hausa-English Lexicon (1914)\n\nReleased on Hugging Face as `adab-tech/murya-hausa-en-lexicon-robinson1914`.',
    bibtex: `@dataset{abubakar2026robinson,
  title={Robinson Hausa-English Lexicon (1914): 20,628 Lexical Pairs},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  publisher={Hugging Face},
  url={https://huggingface.co/datasets/adab-tech/murya-hausa-en-lexicon-robinson1914}
}`,
    status: 'Published'
  },
  {
    id: 'post-waxal-nlp',
    title: 'WaxalNLP: A Large-Scale Multilingual African Language Speech Corpus for ASR & TTS',
    category: 'Tech',
    date: '2026-07',
    abstract: 'Co-developed and curated speech datasets spanning 20+ African languages (Hausa, Yoruba, Sango, Fulfulde, etc.) with 540+ community downloads, advancing sovereign acoustic modeling (arXiv:2602.02734).',
    summary: 'Co-developed and curated speech datasets spanning 20+ African languages (Hausa, Yoruba, Sango, Fulfulde, etc.) with 540+ community downloads, advancing sovereign acoustic modeling (arXiv:2602.02734).',
    tags: ['WaxalNLP', 'African Speech AI', 'ASR', 'TTS', 'arXiv:2602.02734'],
    content: '# WaxalNLP Multilingual Speech Corpus\n\nLarge-scale multilingual ASR/TTS dataset released on Hugging Face under `adab-tech/WaxalNLP`.',
    bibtex: `@dataset{abubakar2026waxal,
  title={WaxalNLP: A Large-Scale Multilingual African Language Speech Corpus},
  author={Abubakar, Adamu Danjuma and Waxal Collaborators},
  year={2026},
  eprint={2602.02734},
  archivePrefix={arXiv}
}`,
    status: 'Published'
  },
  {
    id: 'post-sango-code',
    title: 'Code-170k-Sango: Application Development Pipeline for the Central African Republic & Diaspora',
    category: 'Tech',
    date: '2026-01',
    abstract: 'Forked and maintained the 176k-sample Sango coding corpus on Hugging Face as an open pipeline to engineer language applications, educational tooling, and sovereign AI systems for the Central African Republic (CAR) and its global diaspora.',
    summary: 'Forked and maintained the 176k-sample Sango coding corpus on Hugging Face as an open pipeline to engineer language applications, educational tooling, and sovereign AI systems for the Central African Republic (CAR) and its global diaspora.',
    tags: ['Sango (CAR)', 'Diaspora AI', 'Low-Resource NLP', 'Hugging Face', 'Code-170k'],
    content: '# Code-170k-Sango\n\nForked and hosted on Hugging Face under `adab-tech/Code-170k-sango` to support software and NLP application development for the Central African Republic and its diaspora.',
    bibtex: `@dataset{abubakar2026sango,
  title={Code-170k-sango: High-Quality Programming Dialogues in Sango},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  publisher={Hugging Face},
  url={https://huggingface.co/datasets/adab-tech/Code-170k-sango}
}`,
    status: 'Published'
  }
]

const STORAGE_KEY = 'adamu_tech_research_posts_v6'
const INQUIRIES_KEY = 'adamu_tech_contact_inquiries_v4'

export function usePostsStore() {
  const [posts, setPosts] = useState<ResearchPost[]>(INITIAL_POSTS)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem(STORAGE_KEY)
      if (savedPosts) {
        try {
          setPosts(JSON.parse(savedPosts))
        } catch (e) {
          setPosts(INITIAL_POSTS)
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS))
      }

      const savedInquiries = localStorage.getItem(INQUIRIES_KEY)
      if (savedInquiries) {
        try {
          setInquiries(JSON.parse(savedInquiries))
        } catch (e) {
          setInquiries([])
        }
      }
    }
  }, [])

  const savePosts = (newPosts: ResearchPost[]) => {
    setPosts(newPosts)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
    }
  }

  const saveInquiries = (newInquiries: ContactInquiry[]) => {
    setInquiries(newInquiries)
    if (typeof window !== 'undefined') {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(newInquiries))
    }
  }

  const addPost = (post: Omit<ResearchPost, 'id' | 'date'>) => {
    const newPost: ResearchPost = {
      ...post,
      id: `post-${Date.now()}`,
      date: new Date().toISOString().slice(0, 7)
    }
    const updated = [newPost, ...posts]
    savePosts(updated)
  }

  const updatePost = (id: string, updated: Partial<ResearchPost>) => {
    const newPosts = posts.map(p => p.id === id ? { ...p, ...updated } : p)
    savePosts(newPosts)
  }

  const deletePost = (id: string) => {
    const newPosts = posts.filter(p => p.id !== id)
    savePosts(newPosts)
  }

  const updateInquiryStatus = (id: string, status: 'New' | 'Read' | 'Replied') => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
    saveInquiries(updated)
  }

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter(inq => inq.id !== id)
    saveInquiries(updated)
  }

  return { posts, addPost, updatePost, deletePost, inquiries, updateInquiryStatus, deleteInquiry }
}

export function addContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'date' | 'status'>) {
  if (typeof window === 'undefined') return
  try {
    const existingStr = localStorage.getItem(INQUIRIES_KEY)
    const list: ContactInquiry[] = existingStr ? JSON.parse(existingStr) : []
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'New'
    }
    list.unshift(newInquiry)
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Failed to save inquiry to local storage', e)
  }
}
