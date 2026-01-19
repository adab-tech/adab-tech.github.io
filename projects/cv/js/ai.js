/**
 * Local AI-like utilities
 *
 * This module provides deterministic, client-side content generation and
 * enhancement utilities so the app works completely offline without any
 * external API keys. The functions are heuristic and template-driven but
 * designed to give consistent, useful output for summaries, bullets, and
 * keyword suggestions.
 */

const AI = {
  // No external API required. init left for compatibility.
  init() {},

  isConfigured() {
    // Always configured: local features require no key
    return true;
  },

  // Small curated lists used to improve bullets and summaries
  _actionVerbs: [
    'Led', 'Designed', 'Implemented', 'Built', 'Developed', 'Managed', 'Improved', 'Optimized',
    'Spearheaded', 'Directed', 'Coordinated', 'Delivered', 'Authored', 'Reduced', 'Increased', 'Scaled'
  ],

  _impactPhrases: [
    'resulting in', 'achieving', 'delivering', 'leading to', 'with an outcome of', 'producing'
  ],

  _commonKeywords: [
    'team leadership', 'project management', 'stakeholder engagement', 'data analysis', 'machine learning',
    'NLP', 'Python', 'JavaScript', 'cloud', 'AWS', 'communication', 'research', 'product', 'UX', 'agile'
  ],

  _pickRandom(list, seed = 0) {
    // deterministic pseudo-random: use simple hash of list length and seed
    const idx = Math.abs((list.length + seed) * 9301) % list.length;
    return list[idx];
  },

  /**
   * Generate a short professional summary using provided inputs.
   * Returns a concise 2-4 sentence paragraph suitable for an ATS.
   */
  async generateSummary(jobTitle = 'Professional', yearsExperience = '5+', skills = '') {
    try {
      const skillsList = skills ? skills.split(/[,;]\s*/).slice(0,5) : [];
      const skillPhrase = skillsList.length ? skillsList.join(', ') : 'cross-functional skills';

      const templates = [
        `${jobTitle} with ${yearsExperience} years of experience in ${skillPhrase}. Proven track record of delivering measurable results and driving projects to completion on time and within scope. Excels at collaborating across teams and translating business needs into technical solutions.`,
        `Results-oriented ${jobTitle} with ${yearsExperience} years' experience and expertise in ${skillPhrase}. Demonstrated ability to improve processes and drive impact through data-informed decisions and clear communication. Ready to contribute to high-performing teams and deliver value immediately.`,
        `Experienced ${jobTitle} (${yearsExperience} years) skilled in ${skillPhrase}. Strong background in problem solving, execution, and delivering client-focused solutions that improve outcomes and efficiency.`
      ];

      // Choose a template deterministically using jobTitle length
      const seed = jobTitle.length;
      const summary = templates[Math.abs(seed) % templates.length];
      return summary;
    } catch (err) {
      console.error('generateSummary error', err);
      return '';
    }
  },

  /**
   * Enhance a single bullet point with an action verb and optional metric hints.
   * This is a heuristic upgrade that tries to make bullets more achievement-focused.
   */
  async enhanceBullet(bulletPoint) {
    try {
      if (!bulletPoint || !bulletPoint.trim()) return bulletPoint;
      let text = bulletPoint.trim();

      // If text already starts with a past-tense verb, trust it
      const startsWithVerb = /^([A-Z][a-z]+ed|Led|Managed|Designed)\b/.test(text);
      if (!startsWithVerb) {
        // Prepend a strong action verb deterministically
        const verb = this._pickRandom(this._actionVerbs, text.length);
        text = `${verb} ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
      }

      // If bullet contains a number or percent, assume it's quantified
      const hasNumber = /\d+%?|\$\d+/.test(text);
      if (!hasNumber) {
        // Add a short outcome phrase if it seems appropriate
        const phrase = this._pickRandom(this._impactPhrases, text.length);
        // Add a neutral measurable hint to encourage quantification
        text = `${text} — ${phrase} improved performance.`;
      }

      // Keep result concise: strip excessive whitespace
      return text.replace(/\s+/g, ' ').trim();
    } catch (err) {
      console.error('enhanceBullet error', err);
      return bulletPoint;
    }
  },

  /**
   * Generate keyword suggestions based on a job title and available skills.
   * Returns up to 10 keywords as an array.
   */
  async generateKeywords(jobTitle = '', extraSkills = []) {
    try {
      const tokens = (jobTitle || '').split(/[^A-Za-z0-9]+/).filter(Boolean).map(t => t.toLowerCase());
      const keywords = new Set();

      // Add tokens from job title
      tokens.forEach(t => {
        if (t.length > 2) keywords.add(t);
      });

      // Add curated common keywords
      this._commonKeywords.forEach(k => keywords.add(k));

      // Add extra skills passed as array
      (Array.isArray(extraSkills) ? extraSkills : []).slice(0,10).forEach(s => {
        s.split(/[,;]+/).forEach(x => keywords.add(x.trim()));
      });

      // Return up to 10 items, prioritize title tokens then common keywords
      const result = Array.from(keywords).slice(0,10);
      return result;
    } catch (err) {
      console.error('generateKeywords error', err);
      return [];
    }
  },

  /**
   * UI helpers kept for compatibility (local messages only)
   */
  showConfigModal() {
    return `
      <div class="text-center p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-3">Local AI Features Ready</h3>
        <p class="text-gray-600 mb-4">All AI-powered features run locally in your browser. No API key or account is required.</p>
        <div class="space-y-3">
          <button onclick="document.getElementById('settingsBtn').click()" class="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">Open Settings</button>
        </div>
      </div>
    `;
  },

  showLoadingState(message = 'Working...') {
    return `
      <div class="flex items-center justify-center space-x-3 p-4">
        <div class="spinner"></div>
        <span class="text-gray-600">${message}</span>
      </div>
    `;
  },

  /**
   * Wrappers used by the UI — keep the same names as before but operate locally
   */
  async generateSummaryWithFeedback() {
    const jobTitle = (document.getElementById('fullName')?.value || 'Professional').trim() || 'Professional';
    const allSkills = this.getAllSkills();
    const skills = allSkills.slice(0,5).join(', ');
    try {
      Utils.showToast('Generating professional summary (local)...', 'info');
      const summary = await this.generateSummary(jobTitle, '5+', skills);
      Utils.showToast('Summary generated locally', 'success');
      return summary;
    } catch (err) {
      Utils.showToast('Failed to generate summary', 'error');
      return null;
    }
  },

  async enhanceBulletWithFeedback(bulletText) {
    if (!bulletText || bulletText.trim().length < 3) {
      Utils.showToast('Please enter some text to enhance', 'warning');
      return null;
    }
    try {
      Utils.showToast('Enhancing bullet locally...', 'info');
      const enhanced = await this.enhanceBullet(bulletText);
      Utils.showToast('Bullet enhanced', 'success');
      return enhanced;
    } catch (err) {
      Utils.showToast('Failed to enhance bullet', 'error');
      return null;
    }
  },

  getAllSkills() {
    const skills = [];
    document.querySelectorAll('.skill-item').forEach(item => {
      const skillText = item.querySelector('.skill-text')?.textContent;
      if (skillText) skills.push(skillText);
    });
    return skills;
  }
};

// Initialize (no-op) to preserve expected lifecycle
if (typeof Storage !== 'undefined') {
  AI.init();
}

// Export for CommonJS/ESM compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AI;
}
