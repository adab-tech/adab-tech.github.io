# Rigorous Assessment & Engineering Workplan for Adamu.tech

Adamu.tech is a strong personal research-and-product portfolio with a distinctive thesis: African-language AI should be locally controllable, culturally grounded, and usable in low-connectivity environments. The site is most persuasive as a **researcher-builder portfolio** and less persuasive, at present, as a fully substantiated production-platform or healthcare-technology website. The homepage identifies the author as Adamu Danjuma Abubakar, a University of Alabama Ph.D. candidate and teaching fellow, and presents Murya, a Hausa speech-AI system, alongside linguistic datasets, research, and healthcare applications.

---

### 1. Strategic Positioning: Strong and Differentiated

The site has a rare combination of technical, linguistic, and political differentiation:

- Hausa and West Chadic speech technology
- Ajami manuscript and philological work
- Open weights and self-hosting
- Offline browser inference
- Cultural pragmatics
- African digital sovereignty
- Applied healthcare language tools

This is substantially more memorable than a generic “AI researcher” portfolio. The best strategic idea is the connection between **language preservation, infrastructure independence, and practical AI deployment**.

However, the positioning is broad enough to create a focus problem. The site simultaneously presents itself as:

- An academic profile
- A speech-AI product site
- An open-data repository
- An AI-governance research project
- A healthcare technology portfolio
- A commercial or partnership landing page

Those are related, but they serve different audiences. A university reviewer, ML engineer, funder, healthcare organization, and potential employer need different evidence and calls to action.

**Assessment:** Excellent differentiation; moderate audience focus.

---

### 2. Evidence Quality: Promising, but Not Yet Audit-Grade

The website claims that its technical claims are supported by open weights, dataset cards, and rater evaluations. It reports:

- 4.12/5.0 MOS from 40 native Kano and Zaria speakers
- 3.24 baseline MOS
- 30,708 lexicon entries
- Under 110 ms time-to-first-audio
- 24 kHz output
- Multi-speaker Piper VITS
- ONNX/WASM and Python FastAPI runtimes

These details are valuable because they are measurable and technically specific. The reported MOS is approximately **27.2% higher than the stated baseline**, calculated as \((4.12 - 3.24) / 3.24\). But that comparison cannot be treated as meaningful without knowing whether the same speakers, utterances, recording conditions, rating scale, and evaluation protocol were used for both systems. The homepage does not expose those methodological details in the content available here.

For rigorous validation, the site should publish:

- Evaluation-set size and composition
- Exact baseline model and configuration
- Speaker demographics and dialect distribution
- Rater recruitment and compensation
- Blind or non-blind evaluation procedure
- Confidence intervals or statistical tests
- Per-speaker and per-dialect scores
- Audio examples and transcripts
- Hardware, browser, and network conditions for latency
- Reproduction commands and versioned artifacts

The term **“validated lexicon entries”** is also underspecified. Validation could mean deduplication, expert review, spelling normalization, source comparison, or successful model retrieval. These are different claims and should not be conflated.

**Assessment:** Good claim selection; insufficient public methodology for independent verification.

---

### 3. Technical Coherence: Plausible, with Several Points Needing Clarification

The architecture described is technically plausible: Piper VITS, ONNX, WASM, IndexedDB, and FastAPI can support browser-based speech inference and an offline-first experience. The site also usefully identifies the current dialect boundary as Standard Kano Hausa and acknowledges that Sokoto and Gobirawa acoustic tuning is future work. That limitation increases credibility because it avoids pretending that one model covers all Hausa or all West Chadic varieties.

Several technical phrases need more precision:

- **“Client-side ONNX WASM & WebSocket rising-edge streaming.”** Client-side inference and WebSocket streaming imply different operating modes. If the model runs locally, WebSocket may be used for optional server orchestration, telemetry, conversational services, or fallback inference. The site should diagram these paths and clearly state what works with the network disconnected.
- **“Offline.”** IndexedDB can cache models and lexicons, but offline capability depends on whether every required component—including conversational logic, speech recognition, authentication, and application assets—is local. The site should distinguish between:
  - Offline text-to-speech
  - Offline lexicon lookup
  - Offline speech recognition
  - Offline conversational generation
  - Online fallback features
- **“24 kHz acoustic fidelity.”** 24 kHz is an output sampling rate, not itself a measure of acoustic quality. It should be labeled “24 kHz output audio” unless supported by a separate fidelity metric.
- **“Zero-hallucination dictionary grounding.”** This is too absolute. A dictionary can constrain or validate lexical output, but it does not establish zero hallucinations in a conversational system. Better wording would be “dictionary-constrained lexical grounding” accompanied by a measured error rate.

**Assessment:** The stack is credible; the architecture and terminology need clearer operational definitions.

---

### 4. Data and Intellectual-Property Risk

The homepage describes a 30,708-entry lexicon combining Robinson 1914 with Paul Newman’s 1977 dictionary, while also referring to authorization for the latter source. That is an important issue, but “authorization” is not sufficient documentation for users or downstream developers. The dataset page should state:

- Which portions are public domain
- Which portions remain copyrighted
- What permission was obtained
- Whether the permission covers redistribution and derivative works
- How attribution must be provided
- Whether the combined dataset can legally be released under the stated license

The model and dataset are presented under **CC-BY-NC-SA 4.0**, which is not an ideal software or model-weight license for many technical users. It restricts commercial use and requires share-alike licensing. The site should provide a plain-language license guide and explain whether commercial, governmental, educational, and healthcare deployment is permitted.

The use of named voice personas—“Malama Asabe” and “Malam Garba”—also deserves documentation. If these are real speakers, the site should clarify consent, compensation, voice rights, permitted use, and whether the names are pseudonyms. If they are synthetic personas, that should be stated.

**Assessment:** Potentially significant adoption and compliance risk unless the data, voice, and licensing records are made public.

---

### 5. Healthcare Claims: The Highest-Risk Area

The “Imodoye Health & Language Suite” is described as providing localized Yoruba and Hausa clinical diagnostic assistance for West African community healthcare. This wording creates a much higher burden of evidence than the speech-AI claims. “Diagnostic assist” can be interpreted as clinical decision support or medical diagnosis, especially by nontechnical visitors.

The site should explicitly state:

- Whether the system is informational, administrative, translation-oriented, or diagnostic
- Whether clinicians review all outputs
- What clinical guidelines or datasets support it
- How performance was evaluated
- What populations and conditions are covered
- How uncertainty and escalation are handled
- Whether personal health information is processed
- Whether the system has undergone regulatory review
- That it does not replace a qualified clinician, if applicable

A safer public description would be **“localized clinical communication and documentation assistance”** unless the system has formal clinical validation and appropriate regulatory status.

**Assessment:** Important project, but current wording risks overstating capability and creating avoidable liability.

---

### 6. Privacy and Security Wording

The contact policy says communications are routed via “encrypted Cloudflare DNS forwarding” to a private inbox. This is technically imprecise. DNS forwarding is not the same thing as secure email transport, end-to-end encryption, or encrypted storage. The site should separate:

- Domain DNS configuration
- Email forwarding
- Encryption in transit
- Inbox storage
- Retention period
- Access controls
- Deletion process

The statement that contact information is never shared, marketed, or monetized is clear, but it would be stronger with a short, conventional contact-data policy specifying the actual retention period and service providers involved.

**Assessment:** Good intent; inaccurate or confusing terminology should be corrected.

---

### 7. Credibility Signals

The site benefits from:

- A named researcher and institutional affiliation
- Links to a CV, Google Scholar, GitHub, Hugging Face, and LinkedIn
- Technical model specifications
- Acknowledged dialect limitations
- A distinction between products, datasets, and preprint research

The homepage also displays a live-visit count. That is a weak credibility signal: it shows activity but not research impact, product adoption, or user satisfaction. The displayed count varied between the supplied page context and the retrieved page, showing 1,421 versus 1,420 visits, so it should not be used as substantive evidence of traction.

The external search footprint appears limited but directionally consistent: a developer profile describes Murya as an open-sourced Hausa TTS model trained on the WAXAL dataset and lists relevant technical skills. This supports the general identity and project narrative, but it does not independently validate the homepage’s benchmark claims.

---

### 8. Most Important Improvements (Action Items)

The highest-value changes to implement on `adamu.tech`:

1. **Replace absolute technical claims** such as “zero hallucination” with measurable, narrower claims (e.g., "dictionary-constrained lexical grounding").
2. **Publish benchmark methodology** alongside headline numbers (rater demographics, protocols, confidence intervals).
3. **Add a system architecture diagram** showing exactly what works offline and what requires a server.
4. **Separate academic research, deployed products, datasets, and speculative work** into distinct sections or pages.
5. **Rewrite the healthcare description** to “localized clinical communication and documentation assistance” to avoid implying clinically validated diagnosis unless evidence exists.
6. **Add data-provenance and licensing documentation** for the lexicon and voice data.
7. **Clarify the meaning of 24 kHz**, MOS, latency, and “validated.”
8. **Correct email-security terminology** (distinguish DNS routing, SMTP TLS encryption in transit, and inbox storage).
9. **Make the Murya demo the primary conversion path**, with visible audio samples, transcripts, dialect labels, and download links.
10. **Add dates and version numbers** to models, datasets, benchmarks, and project status.

---

## Bottom Line

Adamu.tech is intellectually distinctive and technically literate. Its strongest asset is not any single metric; it is the coherent idea of building African-language AI around local control, linguistic expertise, and cultural context.

Its principal weakness is an **evidence-to-claim mismatch**: the site uses the language of rigorous reproducible research, but the homepage exposes mostly summarized metrics rather than the protocols and artifacts needed to audit them. The most serious risks concern absolute performance language, unclear offline architecture, source-data licensing, voice consent, and healthcare terminology.

As a portfolio, it is strong. As a research artifact, it needs fuller reproducibility. As a production and healthcare platform, it needs substantially clearer documentation, governance, and risk boundaries.
