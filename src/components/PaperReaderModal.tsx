'use client'

import React, { useState } from 'react'
import { BookOpen, X, Download, Quote, Check, Clock, Globe, Shield, Sparkles, FileText, Bookmark, Share2 } from 'lucide-react'

export function PaperReaderModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedBibtex, setCopiedBibtex] = useState(false)
  const [activeTab, setActiveTab] = useState<'paper' | 'cite'>('paper')

  const bibtex = `@article{abubakar2026agentic,
  title={Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance},
  author={Abubakar, Adamu Danjuma},
  journal={Working Papers in Applied Computational Humanities},
  year={2026},
  institution={University of Alabama},
  url={https://adamu.tech}
}`

  const handleCopyBibtex = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(bibtex)
      setCopiedBibtex(true)
      setTimeout(() => setCopiedBibtex(false), 2000)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-all duration-150 shadow-sm hover:scale-[1.02]"
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>Read Full Working Paper</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-2xl overflow-hidden">
            {/* Header Navigation */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-midnight-900/95 backdrop-blur-md flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                  // SCHOLARLY WORKING PAPER · FULL MANUSCRIPT (47,946 CHARS)
                </span>
                <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                  Humanities Perspectives on Agentic AI
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyBibtex}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:border-amber-500 transition-colors"
                >
                  {copiedBibtex ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Quote className="h-3.5 w-3.5 text-amber-500" />}
                  <span>{copiedBibtex ? 'BibTeX Copied' : 'Cite BibTeX'}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close reader"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Manuscript Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 font-serif text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-3xl mx-auto">
              
              {/* Paper Title & Metadata */}
              <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6 font-sans">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">
                  Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-amber-600 dark:text-amber-400">Adamu Danjuma Abubakar</span>
                  <span>·</span>
                  <span>University of Alabama (Romance Languages & Applied Computational Humanities)</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~18 min read
                  </span>
                  <span>·</span>
                  <span>Pre-Print · Aug 2026</span>
                </div>
              </div>

              {/* Abstract Callout Box */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 font-sans">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Abstract
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The emergence of agentic AI—systems that plan, act, adapt, and operate with increasing autonomy—marks a fundamental shift in the relationship between artificial intelligence and human society. This shift demands not only technical innovation but rigorous humanistic inquiry. This paper argues that the humanities, and literary and cultural studies in particular, are not peripheral but central to the ethical governance of agentic AI. Drawing on philosophical analysis, empirical case studies, and postcolonial theory, it makes three interconnected contributions: demonstrating that the concept of "agency" is philosophically contested; grounding this argument in four case studies across continents; and establishing an actionable humanistic governance blueprint.
                </p>
              </div>

              {/* Table of Contents Navigation Bar */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs space-y-2 font-sans">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] block">
                  Table of Contents (7 Major Sections)
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
                  <li><strong>§1.</strong> Introduction</li>
                  <li><strong>§2.</strong> Conceptual Framework: AI Agency</li>
                  <li><strong>§3.</strong> The Humanities Tradition</li>
                  <li><strong>§4.</strong> Four Global Case Studies</li>
                  <li><strong>§5.</strong> The Humanities Research Gap</li>
                  <li><strong>§6.</strong> 5-Pillar Governance Blueprint</li>
                  <li><strong>§7.</strong> Conclusion & Works Cited</li>
                </ul>
              </div>

              {/* Section 1: Introduction */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  1. Introduction
                </h2>
                <p className="font-serif leading-relaxed">
                  As artificial intelligence evolves from passive predictive models to active multi-agent architectures that make autonomous decisions, interact with APIs, and orchestrate socio-technical workflows, the definition of "agency" ceases to be an abstract computational parameter. It becomes a deeply political, legal, and cultural phenomenon.
                </p>
                <p className="font-serif leading-relaxed">
                  Historically, technical frameworks define an agent by its utility function and instrumental task completion. However, this approach risks rendering invisible the epistemological violence that occurs when algorithmic systems encounter indigenous cultural knowledge, oral linguistic traditions, and historically marginalized communities.
                </p>
              </div>

              {/* Section 2: Conceptual Framework */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  2. Conceptual Framework: AI Agency and Its Discontents
                </h2>
                <p className="font-serif leading-relaxed">
                  In computational science, an agent is modeled through reward maximization and reinforcement learning from human feedback (RLHF). Yet postcolonial theory and cultural studies remind us that human agency is never isolated—it is relational, culturally situated, and mediated through language and power dynamics.
                </p>
                <p className="font-serif leading-relaxed">
                  By decoupling autonomy from accountability, instrumental AI frameworks fail to recognize that the actions taken by autonomous agents reproduce the historical biases and extractive epistemologies of the training corpuses upon which they are built.
                </p>
              </div>

              {/* Section 3: The Humanities Tradition */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  3. The Humanities Tradition and AI: What Cannot Be Outsourced
                </h2>
                <p className="font-serif leading-relaxed">
                  Humanities disciplines provide irreplaceable analytical lenses that cannot be automated:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-midnight-950/60">
                    <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">3.1 Representation & Politics</strong>
                    Unpacking how autonomous systems encode power hierarchies and cultural erasure.
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-midnight-950/60">
                    <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">3.2 Reading Power in Discourse</strong>
                    Analyzing who governs the prompt templates, tool definitions, and action boundaries.
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-midnight-950/60">
                    <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">3.3 Instability of Language</strong>
                    Evaluating polysemy, regional idioms, and tonal Chadic nuances beyond raw tokens.
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-midnight-950/60">
                    <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">3.4 The Contested Human</strong>
                    Critiquing colonial cartographies of who is deemed "human" in automated systems.
                  </div>
                </div>
              </div>

              {/* Section 4: Four Empirical Case Studies */}
              <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  4. AI Agency in Action: Four Empirical Case Studies
                </h2>

                {/* Case 4.1: Wole Soyinka Deepfake */}
                <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      4.1 NIGERIA: The Wole Soyinka Deepfake
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Vocal Authority & Extraction</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
                    When an unauthorized AI voice clone of Africa's first Nobel laureate in Literature, Wole Soyinka, was generated and distributed, it exposed how agentic acoustic synthesis exploits oral cultural authority. In West African societies where elder voices carry communal epistemic weight, synthetic voice theft constitutes an assault on cultural integrity and communal trust.
                  </p>
                </div>

                {/* Case 4.2: China's Agent Hospital */}
                <div className="p-5 rounded-xl border border-blue-500/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Globe className="h-4 w-4" />
                      4.2 CHINA: State-Sanctioned "Agent Hospital"
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Institutional Multi-Agent Triage</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
                    Tsinghua University's autonomous "Agent Hospital," simulating thousands of medical consultations daily with AI doctor and patient agents, marks the institutional codification of bureaucratic authority into autonomous software loops, demanding humanistic scrutiny of triage values and accountability.
                  </p>
                </div>

                {/* Case 4.3: Sophia Robot Citizenship */}
                <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      4.3 SAUDI ARABIA: Performative Citizenship of Sophia
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Artificial Personhood Theater</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
                    Granting ceremonial legal citizenship to humanoid robot "Sophia" in Riyadh revealed the theatrical performativity of artificial agency, wherein artificial agents are accorded legal mobility and protections denied to human migrant laborers under the same legal regime.
                  </p>
                </div>

                {/* Case 4.4: Amodei's Warning */}
                <div className="p-5 rounded-xl border border-purple-500/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Globe className="h-4 w-4" />
                      4.4 FRONTIER LABS: Dario Amodei's Warning & Human Purpose
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Existential Purpose & Alignment</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
                    Anthropic CEO Dario Amodei's essays on powerful AI and the potential displacement of human intellectual vocation confront the ultimate question of human purpose—a question that cannot be resolved through benchmark scores, but through the deep reservoir of literary, historical, and philosophical inquiry.
                  </p>
                </div>
              </div>

              {/* Section 5: The Humanities Research Gap */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  5. The Research Gap: What We Are Missing
                </h2>
                <p className="font-serif leading-relaxed">
                  Too often, humanities scholars arrive after the technical architecture is finalized, invited only to offer post-hoc ethical critique. We argue for <em>upstream participation</em>: embedding digital philologists, cultural theorists, and low-resource linguists into the core architectural design of tokenizer alphabets, reward models, and agentic toolsets.
                </p>
              </div>

              {/* Section 6: 5-Pillar Governance Framework */}
              <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  6. Toward a Humanistic Framework for AI Agency (5 Pillars)
                </h2>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950">
                    <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block mb-1">6.1 Relational Agency</strong>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">
                      Shifting the definition of agency from isolated instrumental task execution to relational socio-cultural accountability.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950">
                    <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block mb-1">6.2 Cultural Situatedness</strong>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">
                      Enforcing indigenous linguistic honorifics (e.g. Hausa <em>Kunya & Girmamawa</em> protocols) to prevent conversational homogenization.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950">
                    <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block mb-1">6.3 Narrative Accountability</strong>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">
                      Requiring transparent trace logs and narrative explanations for all autonomous agent tool executions.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950">
                    <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block mb-1">6.4 Epistemic Humility</strong>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">
                      Equipping agentic architectures with boundary awareness to recognize what they do not know in non-Western epistemologies.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950">
                    <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block mb-1">6.5 Groundedness in Culture-Specific Knowledge Domains</strong>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">
                      Validating speech models against historical lexicography (e.g., Robinson 1914 Lexicon) and authenticated community corpuses (WAXAL).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7: Conclusion */}
              <div className="space-y-3 font-sans pt-2">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
                  7. Conclusion: The Humanities Are Not Waiting to Be Relevant — They Already Are
                </h2>
                <p className="font-serif leading-relaxed">
                  The future of agentic AI will not be determined solely in server clusters or compute optimization pipelines. It will be decided by how faithfully these systems honor human complexity, protect vulnerable cultural heritages, and submit to ethical governance. In this grand endeavor, the humanities provide the essential compass.
                </p>
              </div>

              {/* Full Citation Box */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs space-y-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-[11px] block">
                  Cite This Paper (BibTeX)
                </span>
                <pre className="p-3 rounded-lg bg-white dark:bg-midnight-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
{bibtex}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
