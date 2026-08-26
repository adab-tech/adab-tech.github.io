import { useState, useEffect } from 'react'

export type StreamCategory = 'All' | 'Literary & Academic' | 'Tech' | 'General' | 'Personal'

export interface ResearchPost {
  id: string
  title: string
  category: StreamCategory
  date: string
  abstract: string
  summary: string
  tags: string[]
  content: string
  bibtex?: string
  status?: 'Published' | 'Draft'
  scholarUrl?: string
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'Unread' | 'Read' | 'Archived'
  date: string
  createdAt?: string
}

const STORAGE_KEY = 'adamu_tech_research_posts_v7'
const INQUIRIES_KEY = 'adamu_tech_contact_inquiries_v2'

export const DEFAULT_POSTS: ResearchPost[] = [
  {
    id: 'post-agentic-humanities',
    title: 'Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance',
    category: 'Literary & Academic',
    date: '2026-08',
    abstract: 'Proposes a 5-pillar humanistic governance framework for autonomous multi-agent AI systems, analyzed through 4 global empirical case studies: Wole Soyinka voice deepfake in Nigeria, China Agent Hospital, Sophia robot citizenship, and Dario Amodei existential safety critique.',
    summary: 'Proposes a 5-pillar humanistic governance framework for autonomous multi-agent AI systems, analyzed through 4 global empirical case studies: Wole Soyinka voice deepfake in Nigeria, China Agent Hospital, Sophia robot citizenship, and Dario Amodei existential safety critique.',
    tags: ['Agentic AI', 'Postcolonial Epistemologies', 'AI Governance', 'Cultural Provenance', 'Soyinka Case Study'],
    content: '# Humanities Perspectives on Agentic AI\n\nWorking paper on applied computational humanities and AI agency governance.',
    status: 'Published',
    bibtex: `@article{abubakar2026agentic,
  title={Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance},
  author={Abubakar, Adamu Danjuma},
  journal={Working Papers in Applied Computational Humanities},
  year={2026},
  institution={University of Alabama},
  url={https://adamu.tech/papers/agentic-ai}
}`
  },
  {
    id: 'post-robinson-lexicon',
    title: 'Robinson Hausa–English Lexicon (1914): 20,628 Lexical Pairs for Neural Warm-Start',
    category: 'Tech',
    date: '2026-08',
    abstract: 'Curated and published 20,628 English→Hausa word/phrase pairs from C.H. Robinson (1914) on Hugging Face to warm-start Hausa neural embeddings and lexical retrieval in Murya TTS.',
    summary: 'Curated and published 20,628 English→Hausa word/phrase pairs from C.H. Robinson (1914) on Hugging Face to warm-start Hausa neural embeddings and lexical retrieval in Murya TTS.',
    tags: ['Robinson 1914', 'Hausa Lexicography', 'Hugging Face', 'Embedding Warm-Start', 'Murya TTS'],
    content: '# Robinson Hausa-English Lexicon (1914)\n\nReleased on Hugging Face under `adab-tech/murya-hausa-en-lexicon-robinson1914`.',
    status: 'Published',
    bibtex: `@dataset{abubakar2026robinson,
  title={Robinson Hausa-English Lexicon (1914): 20,628 Curated Pairs for NLP},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  publisher={Hugging Face},
  url={https://huggingface.co/datasets/adab-tech/murya-hausa-en-lexicon-robinson1914}
}`
  },
  {
    id: 'post-waxal-nlp',
    title: 'Murya TTS: High-Fidelity Hausa Speech Synthesis (Fine-Tuned on WAXAL hau Corpus)',
    category: 'Tech',
    date: '2026-02',
    abstract: 'Engineered and fine-tuned the sovereign Murya 24kHz Piper VITS neural speech synthesis model using the Hausa (hau) subset (1,970 samples) of the Google WAXAL dataset alongside the Robinson 1914 Lexicon. Foundational WAXAL corpus credited to original authors (arXiv:2602.02734).',
    summary: 'Engineered and fine-tuned the sovereign Murya 24kHz Piper VITS neural speech synthesis model using the Hausa (hau) subset (1,970 samples) of the Google WAXAL dataset alongside the Robinson 1914 Lexicon. Foundational WAXAL corpus credited to original authors (arXiv:2602.02734).',
    tags: ['Murya TTS', 'WAXAL (hau)', 'Hausa Speech AI', 'Piper VITS', 'Hugging Face'],
    content: '# Murya Hausa Speech Synthesis\n\nFine-tuned on the Hausa (hau) partition of the WAXAL dataset and released on Hugging Face under `adab-tech/murya-piper-hausa-tts`. Foundational WAXAL corpus credited to original authors (arXiv:2602.02734).',
    status: 'Published',
    bibtex: `@software{abubakar2026murya,
  title={Murya: Sovereign Hausa Neural Speech Synthesis Model Fine-Tuned on WAXAL (hau) Corpus},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  publisher={Hugging Face},
  note={Fine-tuned using the Hausa subset of the WAXAL dataset with full attribution to original authors (arXiv:2602.02734)},
  url={https://huggingface.co/adab-tech/murya-piper-hausa-tts}
}`
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
    status: 'Published',
    bibtex: `@dataset{abubakar2026sango,
  title={Code-170k-sango: Open Pipeline for Sango Language Application Engineering},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  publisher={Hugging Face},
  url={https://huggingface.co/datasets/adab-tech/Code-170k-sango}
}`
  },
  {
    id: 'post-pathos-power',
    title: 'Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa, Past and Present',
    category: 'Literary & Academic',
    date: '2026',
    abstract: 'Critical academic review of Joanna Davidson and Benjamin N. Lawrance (eds.), Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa (Ohio University Press, 2025). Published and indexed on Google Scholar.',
    summary: 'Critical academic review of Joanna Davidson and Benjamin N. Lawrance (eds.), Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa (Ohio University Press, 2025). Published and indexed on Google Scholar.',
    tags: ['African Studies', 'Interdisciplinary Humanities', 'Gender & Power', 'Google Scholar'],
    content: '# Pathos and Power\n\nAcademic review published in 2026.',
    status: 'Published',
    scholarUrl: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    bibtex: `@article{abubakar2026pathos,
  title={Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa, Past and Present},
  author={Abubakar, Adamu Danjuma},
  year={2026},
  journal={African Studies Review},
  url={https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ}
}`
  },
  {
    id: 'post-banlieue-cinema',
    title: 'Gender in French Banlieue Cinema: Intersectional Perspectives',
    category: 'Literary & Academic',
    date: '2025',
    abstract: 'Scholarly review of Marzia Caporale, Claire Mouflard, and Habib Zanzana (eds.), Gender in French Banlieue Cinema: Intersectional Perspectives (2025), analyzing spatial marginality and gendered representation.',
    summary: 'Scholarly review of Marzia Caporale, Claire Mouflard, and Habib Zanzana (eds.), Gender in French Banlieue Cinema: Intersectional Perspectives (2025), analyzing spatial marginality and gendered representation.',
    tags: ['French Film Studies', 'Banlieue Cinema', 'Intersectionality', 'Romance Languages'],
    content: '# Gender in French Banlieue Cinema\n\nScholarly review published in 2025.',
    status: 'Published',
    scholarUrl: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    bibtex: `@article{abubakar2025banlieue,
  title={Gender in French Banlieue Cinema: Intersectional Perspectives},
  author={Abubakar, Adamu Danjuma},
  year={2025},
  journal={French Review},
  url={https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ}
}`
  },
  {
    id: 'post-diary-sow',
    title: 'Je pars by Diary Sow: Literary Review & Critical Framing',
    category: 'Literary & Academic',
    date: '2023',
    abstract: 'Critical analysis of Diary Sow\'s autobiographical novel Je pars, exploring Francophone African migration narratives, epistemic vulnerability, and transnational identity.',
    summary: 'Critical analysis of Diary Sow\'s autobiographical novel Je pars, exploring Francophone African migration narratives, epistemic vulnerability, and transnational identity.',
    tags: ['Francophone Literature', 'Senegalese Prose', 'Migration Narratives'],
    content: '# Je pars by Diary Sow\n\nCritical review published in 2023.',
    status: 'Published',
    scholarUrl: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    bibtex: `@article{danjuma2023jepars,
  title={Je pars by Diary Sow},
  author={Danjuma, Adamu Abubakar},
  year={2023},
  journal={Francophone Literary Studies},
  url={https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ}
}`
  }
]

export const DEFAULT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Dr. Amina Bello',
    email: 'amina.bello@unilorin.edu.ng',
    subject: 'Collaboration on Chadic Speech Modeling',
    message: 'Greetings Adamu, we reviewed the Murya 24kHz Piper model and would love to collaborate on West Chadic dialectal coverage under the Lacuna Fund.',
    status: 'Unread',
    date: '2026-08-24',
    createdAt: '2026-08-24'
  }
]

export function addContactInquiry(inquiry: {
  name: string
  email: string
  subject: string
  message: string
  preferredDate?: string
}) {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(INQUIRIES_KEY)
    const current: ContactInquiry[] = stored ? JSON.parse(stored) : DEFAULT_INQUIRIES
    const newInquiry: ContactInquiry = {
      id: 'inq-' + Date.now(),
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject || 'General Inquiry',
      message: inquiry.message,
      status: 'Unread',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
    const updated = [newInquiry, ...current]
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('Error saving inquiry:', e)
  }
}

export function usePostsStore() {
  const [posts, setPosts] = useState<ResearchPost[]>(DEFAULT_POSTS)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(DEFAULT_INQUIRIES)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPosts = localStorage.getItem(STORAGE_KEY)
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts))
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS))
        }

        const storedInquiries = localStorage.getItem(INQUIRIES_KEY)
        if (storedInquiries) {
          setInquiries(JSON.parse(storedInquiries))
        } else {
          localStorage.setItem(INQUIRIES_KEY, JSON.stringify(DEFAULT_INQUIRIES))
        }
      } catch (e) {
        console.warn('LocalStorage error:', e)
      }
    }
  }, [])

  const addPost = (post: ResearchPost) => {
    const updated = [post, ...posts]
    setPosts(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  }

  const updatePost = (post: ResearchPost) => {
    const updated = posts.map(p => p.id === post.id ? post : p)
    setPosts(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  }

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id)
    setPosts(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  }

  const addInquiry = (inquiry: ContactInquiry) => {
    const updated = [inquiry, ...inquiries]
    setInquiries(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated))
    }
  }

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id)
    setInquiries(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated))
    }
  }

  const updateInquiryStatus = (id: string, status: 'Unread' | 'Read' | 'Archived') => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i)
    setInquiries(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated))
    }
  }

  const markInquiryAsRead = (id: string) => {
    updateInquiryStatus(id, 'Read')
  }

  return {
    posts,
    inquiries,
    addPost,
    updatePost,
    deletePost,
    addInquiry,
    deleteInquiry,
    updateInquiryStatus,
    markInquiryAsRead
  }
}
