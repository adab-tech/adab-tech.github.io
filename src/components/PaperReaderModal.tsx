'use client'

import React, { useState } from 'react'
import { BookOpen, X, Download, Quote, Check, Clock, Globe, Shield, Sparkles } from 'lucide-react'

export function PaperReaderModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedBibtex, setCopiedBibtex] = useState(false)

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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>Read Full Paper (Working Manuscript)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-2xl overflow-hidden">
            {/* Header Bar */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-midnight-900/95 backdrop-blur-md flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                  // SCHOLARLY WORKING PAPER · FULL MANUSCRIPT
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

            {/* Scrollable Reader Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 font-serif text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-3xl mx-auto">
              
              {/* Paper Title & Metadata */}
              <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6 font-sans">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">
                  Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-amber-600 dark:text-amber-400">Adamu Danjuma Abubakar</span>
                  <span>·</span>
                  <span>University of Alabama</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~18 min read
                  </span>
                  <span>·</span>
                  <span>Aug 2026</span>
                </div>
              </div>

              {/* Abstract Callout Box */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 font-sans">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Abstract
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The emergence of agentic AI—systems that plan, act, adapt, and operate with increasing autonomy—marks a fundamental shift in the relationship between artificial intelligence and human society. This shift demands not only technical innovation but rigorous humanistic inquiry. This paper argues that the humanities, and literary and cultural studies in particular, are not peripheral but central to the ethical governance of agentic AI. Drawing on philosophical analysis, empirical case studies, and postcolonial theory, it makes three interconnected contributions: demonstrating the contested ontology of agency, analyzing four global case studies across continents, and establishing a humanistic governance blueprint.
                </p>
              </div>

              {/* Section 1: Introduction & The Philosophical Contest */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                  1. The Contested Ontology of "Agency"
                </h2>
                <p className="font-serif leading-relaxed">
                  Technical discourse routinely defines agency in instrumental terms: an agent is a software artifact capable of perceiving its environment, formulating goal-directed sub-plans, executing actions via tools or APIs, and adjusting trajectories based on environmental feedback. Yet in the humanities, agency has never been reducible to functional autonomy. From postcolonial critique to African communitarian philosophies (such as <em>Ubuntu</em> and West African linguistic relationality), agency is intrinsically dialogic, socially situated, and inextricably bound to cultural legitimacy and ethical accountability.
                </p>
                <p className="font-serif leading-relaxed">
                  When autonomous systems interact with low-resource linguistic communities or underrepresented cultural epistemologies, functional definitions fail to capture the asymmetric power dynamics, historical extraction, and cultural epistemic violence that automated agents can enact.
                </p>
              </div>

              {/* Section 2: Four Global Case Studies */}
              <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                  2. Four Global Case Studies in Agentic Action
                </h2>

                {/* Case 1: Wole Soyinka Deepfake */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Shield className="h-4 w-4" />
                    Case 1: Nigeria — The AI Deepfake of Nobel Laureate Wole Soyinka
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed">
                    The unauthorized synthesis and distribution of an AI-generated voice clone of Africa's first Nobel laureate in Literature, Wole Soyinka, demonstrated how agentic generative models exploit linguistic authority. In low-resource African information ecosystems, where oral authority carries profound social weight, the synthetic usurpation of an elder's voice is not merely a copyright infringement—it is an assault on epistemic trust and cultural integrity.
                  </p>
                </div>

                {/* Case 2: China's Agent Hospital */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    <Globe className="h-4 w-4" />
                    Case 2: China — State-Sanctioned "Agent Hospital"
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed">
                    Tsinghua University's autonomous "Agent Hospital," populated entirely by AI doctors, nurses, and patient agents simulating thousands of medical consultations daily, illustrates the transition from decision-support tools to autonomous institutional actors. Humanistic inquiry reveals how medical triage norms, embedded bureaucratic values, and state power are tacitly codified into multi-agent protocols.
                  </p>
                </div>

                {/* Case 3: Sophia Robot Citizenship */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                    Case 3: Saudi Arabia — Performative Citizenship of Sophia
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed">
                    The ceremonial granting of full legal citizenship to Hanson Robotics' humanoid robot "Sophia" in Riyadh highlighted the performative theatricality of artificial personhood. Literary and gender theory illuminate how Sophia was granted rights and mobility denied to human migrant workers and women under the same legal jurisdiction, underscoring the political instrumentalization of artificial agents.
                  </p>
                </div>

                {/* Case 4: Project CETI */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Globe className="h-4 w-4" />
                    Case 4: Interspecies Bioacoustics — Project CETI (Cetacean Translation)
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed">
                    Applying large language models and unsupervised pattern discovery to sperm whale coda sequences in the Caribbean exposes the anthropocentric boundaries of NLP. Non-human communicative agency forces computational linguists to confront non-linear syntax, acoustic prosody, and the radical alterity of non-human semiotic systems.
                  </p>
                </div>
              </div>

              {/* Section 3: Framework for Governance */}
              <div className="space-y-3 font-sans">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                  3. A Humanistic, Postcolonial Governance Blueprint
                </h2>
                <p className="font-serif leading-relaxed">
                  We propose a tripartite governance framework centered on:
                </p>
                <ol className="list-decimal pl-5 space-y-2 font-serif text-xs leading-relaxed">
                  <li>
                    <strong>Epistemic Pluralism in Agent Design:</strong> Mandating that low-resource speech and conversational agents respect local linguistic honorifics (e.g., Hausa <em>Kunya & Girmamawa</em> protocols) rather than imposing monolingual Anglo-Western conversational norms.
                  </li>
                  <li>
                    <strong>Sovereign Cultural Provenance:</strong> Establishing verifiable cryptographic provenance for oral and literary cultural figures to prevent synthetic impersonation and cultural erasure.
                  </li>
                  <li>
                    <strong>Communitarian Accountability Audits:</strong> Replacing purely statistical benchmark metrics with participatory community audits evaluating representational accuracy and historical fidelity.
                  </li>
                </ol>
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
