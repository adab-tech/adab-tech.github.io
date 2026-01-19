/**
 * AI Integration Module
 * Handles OpenAI API calls for content generation
 */

const AI = {
  apiKey: null,
  baseUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  
  /**
   * Initialize AI module with API key from settings
   */
  init() {
    const settings = Storage.getSettings();
    this.apiKey = settings.apiKey;
  },

  /**
   * Check if API key is configured
   */
  isConfigured() {
    return this.apiKey && this.apiKey.length > 0 && !this.apiKey.includes('[REDACTED]');
  },

  /**
   * Make API call to OpenAI
   */
  async callAPI(messages, maxTokens = 300, temperature = 0.7) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please add your API key in Settings.');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  },

  /**
   * Generate professional summary
   */
  async generateSummary(jobTitle, yearsExperience, skills) {
    const prompt = `You are a professional resume writer. Generate a compelling 3-5 sentence professional summary for a ${jobTitle} with ${yearsExperience} years of experience. Focus on these key skills: ${skills}. Make it ATS-friendly and impactful. Return only the summary text without any introductory phrases.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume writer specializing in creating ATS-optimized professional summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.callAPI(messages, 250, 0.7);
  },

  /**
   * Enhance bullet point
   */
  async enhanceBullet(bulletPoint) {
    const prompt = `Enhance this resume bullet point to be more impactful using action verbs and quantifiable metrics where possible: "${bulletPoint}". Keep it concise (1-2 lines). Return only the enhanced bullet point without any introductory phrases or explanations.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume writer who enhances achievement descriptions with strong action verbs and metrics.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.callAPI(messages, 150, 0.7);
  },

  /**
   * Generate keyword suggestions
   */
  async generateKeywords(jobTitle) {
    const prompt = `Generate 10 relevant ATS keywords for a ${jobTitle} position. Return as a comma-separated list without any introductory text or explanations.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an ATS optimization expert who provides relevant keywords for resume optimization.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const keywords = await this.callAPI(messages, 150, 0.7);
    return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  },

  /**
   * Show API key configuration modal
   */
  showConfigModal() {
    return `
      <div class="text-center p-6">
        <svg class="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-3">OpenAI API Key Required</h3>
        <p class="text-gray-600 mb-4">
          To use AI-powered features, you need to configure your OpenAI API key.
          Your key is stored locally and never sent to our servers.
        </p>
        <div class="space-y-3">
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Get API Key from OpenAI
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          <button onclick="document.getElementById('settingsBtn').click()" class="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Configure in Settings
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Show loading state during AI generation
   */
  showLoadingState(message = 'Generating with AI...') {
    return `
      <div class="flex items-center justify-center space-x-3 p-4">
        <div class="spinner"></div>
        <span class="text-gray-600">${message}</span>
      </div>
    `;
  },

  /**
   * Generate summary with UI feedback
   */
  async generateSummaryWithFeedback() {
    if (!this.isConfigured()) {
      Utils.showToast('Please configure your OpenAI API key in Settings', 'warning');
      return null;
    }

    // Get job title and skills from form
    const jobTitle = document.getElementById('fullName')?.value || 'Professional';
    const allSkills = this.getAllSkills();
    const skills = allSkills.slice(0, 5).join(', ') || 'various technical and soft skills';
    
    try {
      Utils.showToast('Generating professional summary...', 'info');
      const summary = await this.generateSummary(jobTitle, '5+', skills);
      Utils.showToast('Summary generated successfully!', 'success');
      return summary;
    } catch (error) {
      Utils.showToast(error.message || 'Failed to generate summary', 'error');
      return null;
    }
  },

  /**
   * Enhance bullet with UI feedback
   */
  async enhanceBulletWithFeedback(bulletText) {
    if (!this.isConfigured()) {
      Utils.showToast('Please configure your OpenAI API key in Settings', 'warning');
      return null;
    }

    if (!bulletText || bulletText.trim().length < 10) {
      Utils.showToast('Please enter some text to enhance (at least 10 characters)', 'warning');
      return null;
    }

    try {
      Utils.showToast('Enhancing bullet point...', 'info');
      const enhanced = await this.enhanceBullet(bulletText);
      Utils.showToast('Bullet point enhanced!', 'success');
      return enhanced;
    } catch (error) {
      Utils.showToast(error.message || 'Failed to enhance bullet point', 'error');
      return null;
    }
  },

  /**
   * Get all skills from the current form
   */
  getAllSkills() {
    const skills = [];
    document.querySelectorAll('.skill-item').forEach(item => {
      const skillText = item.querySelector('.skill-text')?.textContent;
      if (skillText) skills.push(skillText);
    });
    return skills;
  }
};

// Initialize AI module on load
if (typeof Storage !== 'undefined') {
  AI.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AI;
}
