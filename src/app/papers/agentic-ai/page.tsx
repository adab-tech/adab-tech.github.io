'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ArrowLeft, Quote, Check, Clock, Shield, Globe, Sparkles, BookOpen, Share2, Printer } from 'lucide-react'

export default function AgenticAiPaperPage() {
  const [copiedBibtex, setCopiedBibtex] = useState(false)

  const bibtex = `@article{abubakar2026agentic,
  title={Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance},
  author={Abubakar, Adamu Danjuma},
  journal={Working Papers in Applied Computational Humanities},
  year={2026},
  institution={University of Alabama},
  url={https://adamu.tech/papers/agentic-ai}
}`

  const handleCopyBibtex = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(bibtex)
      setCopiedBibtex(true)
      setTimeout(() => setCopiedBibtex(false), 2000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <GlobalShell>
      <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
        
        {/* Navigation Breadcrumb & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Platform Dossier</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:border-amber-500 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleCopyBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
            >
              {copiedBibtex ? <Check className="h-3.5 w-3.5 text-zinc-950" /> : <Quote className="h-3.5 w-3.5" />}
              <span>{copiedBibtex ? 'BibTeX Copied' : 'Cite BibTeX'}</span>
            </button>
          </div>
        </div>

        {/* Academic Paper Card Container */}
        <article className="p-6 sm:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1526] shadow-sm space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>SCHOLARLY WORKING PAPER · APPLIED COMPUTATIONAL HUMANITIES</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">
              Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">Adamu Danjuma Abubakar</span>
              <span>·</span>
              <span>University of Alabama</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> ~18 min read
              </span>
              <span>·</span>
              <span>August 2026</span>
            </div>
          </div>

          {/* Abstract */}
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 font-sans">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Executive Abstract
            </span>
            <p className="text-sm font-serif text-zinc-700 dark:text-zinc-300 leading-relaxed">
              The emergence of agentic AI—systems that plan, act, adapt, and operate with increasing autonomy—marks a fundamental shift in the relationship between artificial intelligence and human society. This shift demands not only technical innovation but rigorous humanistic inquiry. This paper argues that the humanities, and literary and cultural studies in particular, are not peripheral but central to the ethical governance of agentic AI. Drawing on philosophical analysis, empirical case studies, and postcolonial theory, it makes three interconnected contributions: demonstrating that the concept of "agency" is philosophically contested; grounding this argument in four case studies across continents; and establishing an actionable humanistic governance blueprint.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              1. Introduction
            </h2>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              As artificial intelligence evolves from passive predictive models to active multi-agent architectures that make autonomous decisions, interact with APIs, and orchestrate socio-technical workflows, the definition of "agency" ceases to be an abstract computational parameter. It becomes a deeply political, legal, and cultural phenomenon.
            </p>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              Historically, technical frameworks define an agent by its utility function and instrumental task completion. However, this approach risks rendering invisible the epistemological violence that occurs when algorithmic systems encounter indigenous cultural knowledge, oral linguistic traditions, and historically marginalized communities.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              2. Conceptual Framework: AI Agency and Its Discontents
            </h2>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              In computational science, an agent is modeled through reward maximization and reinforcement learning from human feedback (RLHF). Yet postcolonial theory and cultural studies remind us that human agency is never isolated—it is relational, culturally situated, and mediated through language and power dynamics.
            </p>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              By decoupling autonomy from accountability, instrumental AI frameworks fail to recognize that the actions taken by autonomous agents reproduce the historical biases and extractive epistemologies of the training corpuses upon which they are built.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              3. The Humanities Tradition and AI: What Cannot Be Outsourced
            </h2>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              Humanities disciplines provide irreplaceable analytical lenses that cannot be automated:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <h3 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">3.1 Representation and Its Politics</h3>
                <p className="font-serif text-xs text-zinc-600 dark:text-zinc-400">Unpacking how autonomous systems encode power hierarchies and cultural erasure.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <h3 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">3.2 Reading Power in Discourse</h3>
                <p className="font-serif text-xs text-zinc-600 dark:text-zinc-400">Analyzing who governs prompt templates, tool definitions, and action boundaries.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <h3 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">3.3 Instability of Language</h3>
                <p className="font-serif text-xs text-zinc-600 dark:text-zinc-400">Evaluating polysemy, regional idioms, and tonal Chadic nuances beyond raw tokens.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <h3 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">3.4 The Contested Human</h3>
                <p className="font-serif text-xs text-zinc-600 dark:text-zinc-400">Critiquing colonial cartographies of who is deemed "human" in automated systems.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              4. AI Agency in Action: Four Empirical Case Studies
            </h2>

            <div className="space-y-4">
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
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              5. The Research Gap: What We Are Missing
            </h2>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              Too often, humanities scholars arrive after technical architectures are finalized, invited only to offer post-hoc ethical critique. We argue for <em>upstream participation</em>: embedding digital philologists, cultural theorists, and low-resource linguists into the core architectural design of tokenizer alphabets, reward models, and agentic toolsets.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              6. Toward a Humanistic Framework for AI Agency (5 Pillars)
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">6.1 Relational Agency</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">Shifting the definition of agency from isolated instrumental task execution to relational socio-cultural accountability.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">6.2 Cultural Situatedness</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">Enforcing indigenous linguistic honorifics (e.g. Hausa Kunya & Girmamawa protocols) to prevent conversational homogenization.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">6.3 Narrative Accountability</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">Requiring transparent trace logs and narrative explanations for all autonomous agent tool executions.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">6.4 Epistemic Humility</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">Equipping agentic architectures with boundary awareness to recognize what they do not know in non-Western epistemologies.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">6.5 Groundedness in Culture-Specific Knowledge Domains</strong>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif">Validating speech models against historical lexicography (e.g. Robinson 1914 Lexicon) and authenticated community corpuses (WAXAL).</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-amber-500 pl-3">
              7. Conclusion: The Humanities Are Not Waiting to Be Relevant — They Already Are
            </h2>
            <p className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
              The future of agentic AI will not be determined solely in server clusters or compute optimization pipelines. It will be decided by how faithfully these systems honor human complexity, protect vulnerable cultural heritages, and submit to ethical governance. In this grand endeavor, the humanities provide the essential compass.
            </p>
          </section>

          {/* BibTeX Section */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-xs">Cite This Working Paper (BibTeX)</span>
              <button
                onClick={handleCopyBibtex}
                className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
              >
                {copiedBibtex ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-white dark:bg-midnight-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
{bibtex}
            </pre>
          </div>

        </article>
      </div>
    </GlobalShell>
  )
}
