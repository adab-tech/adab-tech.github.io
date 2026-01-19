/**
 * ATS (Applicant Tracking System) Scoring Module
 * Analyzes resume content and provides optimization suggestions
 */

const ATS = {
  /**
   * Action verbs commonly used in resumes
   */
  actionVerbs: [
    'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'completed',
    'coordinated', 'created', 'delivered', 'designed', 'developed', 'directed',
    'enhanced', 'established', 'executed', 'generated', 'implemented', 'improved',
    'increased', 'initiated', 'launched', 'led', 'managed', 'optimized', 'organized',
    'pioneered', 'produced', 'reduced', 'resolved', 'streamlined', 'strengthened',
    'transformed', 'accelerated', 'accomplished', 'orchestrated', 'spearheaded'
  ],

  /**
   * Industry keywords (sample - in production would be larger)
   */
  industryKeywords: [
    'agile', 'api', 'cloud', 'database', 'frontend', 'backend', 'fullstack',
    'leadership', 'project management', 'data analysis', 'machine learning',
    'customer service', 'sales', 'marketing', 'budget', 'strategy', 'compliance',
    'optimization', 'automation', 'scalability', 'security', 'performance'
  ],

  /**
   * Calculate overall ATS score
   */
  calculateScore(resumeData) {
    const formatScore = this.checkFormat(resumeData);
    const contentScore = this.checkContent(resumeData);
    const keywordScore = this.checkKeywords(resumeData);

    const totalScore = formatScore.score + contentScore.score + keywordScore.score;
    const grade = this.getGrade(totalScore);

    return {
      totalScore,
      grade,
      breakdown: {
        format: formatScore,
        content: contentScore,
        keywords: keywordScore
      },
      suggestions: [
        ...formatScore.suggestions,
        ...contentScore.suggestions,
        ...keywordScore.suggestions
      ]
    };
  },

  /**
   * Check format (30 points max)
   */
  checkFormat(resumeData) {
    let score = 0;
    const suggestions = [];
    const maxScore = 30;

    // Standard font check (10 pts)
    score += 10;

    // No tables/graphics check (5 pts) - we control format
    score += 5;

    // Proper section headers (5 pts)
    const { summary, experience, education, skills } = resumeData.content;
    const hasSections = [summary, experience?.length, education?.length, 
                        Object.values(skills || {}).some(arr => arr?.length)].filter(Boolean).length;
    
    if (hasSections >= 3) {
      score += 5;
    } else {
      suggestions.push({
        category: 'Format',
        issue: 'Missing key sections',
        suggestion: 'Include all major sections: Summary, Experience, Education, and Skills',
        severity: 'medium'
      });
    }

    // Consistent formatting (5 pts)
    if (experience && experience.length > 0) {
      const hasConsistentDates = experience.every(exp => exp.startDate);
      if (hasConsistentDates) {
        score += 5;
      } else {
        suggestions.push({
          category: 'Format',
          issue: 'Inconsistent date formatting',
          suggestion: 'Ensure all work experience entries have start dates',
          severity: 'low'
        });
      }
    } else {
      score += 5; // No experience to check
    }

    // Optimal length check (5 pts)
    const contentLength = JSON.stringify(resumeData.content).length;
    if (contentLength > 500 && contentLength < 8000) {
      score += 5;
    } else if (contentLength <= 500) {
      suggestions.push({
        category: 'Format',
        issue: 'Resume is too short',
        suggestion: 'Add more details about your experience and accomplishments',
        severity: 'high'
      });
    } else {
      suggestions.push({
        category: 'Format',
        issue: 'Resume might be too long',
        suggestion: 'Consider condensing to 1-2 pages for better readability',
        severity: 'low'
      });
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      suggestions
    };
  },

  /**
   * Check content (40 points max)
   */
  checkContent(resumeData) {
    let score = 0;
    const suggestions = [];
    const maxScore = 40;
    const { contact, summary, experience, education, skills } = resumeData.content;

    // Contact information complete (10 pts)
    const requiredContact = ['fullName', 'email', 'phone'];
    const hasAllContact = requiredContact.every(field => contact[field]?.trim());
    
    if (hasAllContact) {
      score += 10;
    } else {
      const missing = requiredContact.filter(field => !contact[field]?.trim());
      suggestions.push({
        category: 'Content',
        issue: 'Incomplete contact information',
        suggestion: `Add missing contact details: ${missing.join(', ')}`,
        severity: 'high'
      });
      score += Math.floor((requiredContact.length - missing.length) / requiredContact.length * 10);
    }

    // Professional summary present (10 pts)
    if (summary && summary.trim().length > 50) {
      score += 10;
    } else if (!summary || summary.trim().length === 0) {
      suggestions.push({
        category: 'Content',
        issue: 'Missing professional summary',
        suggestion: 'Add a professional summary highlighting your key qualifications',
        severity: 'high'
      });
    } else {
      score += 5;
      suggestions.push({
        category: 'Content',
        issue: 'Professional summary is too brief',
        suggestion: 'Expand your summary to 3-5 sentences (aim for 50-150 words)',
        severity: 'medium'
      });
    }

    // Work experience with dates (10 pts)
    if (experience && experience.length > 0) {
      const validExperience = experience.filter(exp => 
        exp.title && exp.company && exp.startDate
      );
      const ratio = validExperience.length / experience.length;
      score += Math.floor(ratio * 10);
      
      if (ratio < 1) {
        suggestions.push({
          category: 'Content',
          issue: 'Incomplete work experience entries',
          suggestion: 'Ensure all experience entries have job title, company, and dates',
          severity: 'high'
        });
      }

      // Check for bullet points
      const hasBullets = experience.some(exp => exp.bullets && exp.bullets.length > 0);
      if (!hasBullets) {
        suggestions.push({
          category: 'Content',
          issue: 'No accomplishment bullets',
          suggestion: 'Add 3-5 bullet points for each role describing your achievements',
          severity: 'high'
        });
      }
    } else {
      suggestions.push({
        category: 'Content',
        issue: 'No work experience listed',
        suggestion: 'Add your work experience with detailed accomplishments',
        severity: 'high'
      });
    }

    // Education section present (5 pts)
    if (education && education.length > 0) {
      const validEducation = education.filter(edu => edu.degree && edu.institution);
      score += validEducation.length > 0 ? 5 : 2;
      
      if (validEducation.length < education.length) {
        suggestions.push({
          category: 'Content',
          issue: 'Incomplete education entries',
          suggestion: 'Include degree and institution for all education entries',
          severity: 'medium'
        });
      }
    } else {
      suggestions.push({
        category: 'Content',
        issue: 'No education listed',
        suggestion: 'Add your educational background',
        severity: 'medium'
      });
    }

    // Skills section present (5 pts)
    const totalSkills = Object.values(skills || {}).flat().length;
    if (totalSkills >= 5) {
      score += 5;
    } else if (totalSkills > 0) {
      score += 3;
      suggestions.push({
        category: 'Content',
        issue: 'Limited skills listed',
        suggestion: 'Add more relevant skills (aim for at least 5-10 skills)',
        severity: 'medium'
      });
    } else {
      suggestions.push({
        category: 'Content',
        issue: 'No skills listed',
        suggestion: 'Add a skills section with relevant technical and soft skills',
        severity: 'high'
      });
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      suggestions
    };
  },

  /**
   * Check keywords (30 points max)
   */
  checkKeywords(resumeData) {
    let score = 0;
    const suggestions = [];
    const maxScore = 30;
    const { summary, experience } = resumeData.content;

    // Combine all text content
    const allText = [
      summary || '',
      ...(experience || []).map(exp => 
        [exp.title, exp.company, ...(exp.bullets || [])].join(' ')
      )
    ].join(' ').toLowerCase();

    // Check for action verbs (10 pts)
    const actionVerbsFound = this.actionVerbs.filter(verb => 
      allText.includes(verb.toLowerCase())
    );
    const actionVerbScore = Math.min(10, Math.floor((actionVerbsFound.length / 5) * 10));
    score += actionVerbScore;

    if (actionVerbScore < 7) {
      suggestions.push({
        category: 'Keywords',
        issue: 'Limited use of action verbs',
        suggestion: 'Start bullet points with strong action verbs (achieved, developed, led, etc.)',
        severity: 'medium',
        examples: ['achieved', 'developed', 'led', 'implemented', 'optimized']
      });
    }

    // Check for industry keywords (10 pts)
    const industryKeywordsFound = this.industryKeywords.filter(keyword =>
      allText.includes(keyword.toLowerCase())
    );
    const keywordScore = Math.min(10, Math.floor((industryKeywordsFound.length / 3) * 10));
    score += keywordScore;

    if (keywordScore < 7) {
      suggestions.push({
        category: 'Keywords',
        issue: 'Few industry-relevant keywords',
        suggestion: 'Include more industry-specific terms and technologies relevant to your field',
        severity: 'medium'
      });
    }

    // Check for quantifiable metrics (10 pts)
    const metricPatterns = [
      /\d+%/g,  // percentages
      /\$\d+/g, // dollar amounts
      /\d+\+/g, // numbers with plus
      /\d+ (users|customers|clients|employees|team members)/gi,
      /(increased|decreased|reduced|improved|grew) (by )?\d+/gi,
    ];

    let metricsFound = 0;
    metricPatterns.forEach(pattern => {
      const matches = allText.match(pattern);
      if (matches) metricsFound += matches.length;
    });

    const metricScore = Math.min(10, Math.floor((metricsFound / 3) * 10));
    score += metricScore;

    if (metricScore < 7) {
      suggestions.push({
        category: 'Keywords',
        issue: 'Lack of quantifiable achievements',
        suggestion: 'Add specific numbers and metrics to demonstrate impact (e.g., "increased sales by 30%")',
        severity: 'high',
        examples: [
          'Increased revenue by 25%',
          'Managed team of 12 developers',
          'Reduced processing time by 40%',
          'Grew user base to 50,000+'
        ]
      });
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      suggestions,
      stats: {
        actionVerbs: actionVerbsFound.length,
        industryKeywords: industryKeywordsFound.length,
        metrics: metricsFound
      }
    };
  },

  /**
   * Convert score to letter grade
   */
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },

  /**
   * Get color for score
   */
  getScoreColor(score) {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  },

  /**
   * Render ATS score modal content
   */
  renderScoreModal(scoreData) {
    const { totalScore, grade, breakdown, suggestions } = scoreData;
    const scoreColor = this.getScoreColor(totalScore);

    return `
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" style="background: conic-gradient(${scoreColor} ${totalScore * 3.6}deg, #e5e7eb ${totalScore * 3.6}deg);">
          <div class="flex items-center justify-center w-28 h-28 bg-white rounded-full">
            <div>
              <div class="text-5xl font-bold" style="color: ${scoreColor};">${totalScore}</div>
              <div class="text-sm text-gray-500">Grade: ${grade}</div>
            </div>
          </div>
        </div>
        <h4 class="text-xl font-bold text-gray-900">
          ${totalScore >= 80 ? 'Excellent!' : totalScore >= 60 ? 'Good Progress' : 'Needs Improvement'}
        </h4>
        <p class="text-gray-600">
          ${totalScore >= 80 
            ? 'Your resume is well-optimized for ATS systems' 
            : 'Follow the suggestions below to improve your score'}
        </p>
      </div>

      <!-- Score Breakdown -->
      <div class="space-y-4 mb-6">
        ${Object.entries(breakdown).map(([category, data]) => `
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold text-gray-700 capitalize">${category}</span>
              <span class="text-sm text-gray-600">${data.score}/${data.maxScore} (${data.percentage}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="h-3 rounded-full transition-all" style="width: ${data.percentage}%; background: ${this.getScoreColor(data.percentage)};"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Suggestions -->
      ${suggestions.length > 0 ? `
        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-3">Improvement Suggestions</h4>
          <div class="space-y-3">
            ${suggestions.slice(0, 8).map(sug => `
              <div class="p-4 rounded-lg border-l-4 ${
                sug.severity === 'high' ? 'border-red-500 bg-red-50' :
                sug.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }">
                <div class="flex items-start">
                  <svg class="w-5 h-5 mt-0.5 mr-2 ${
                    sug.severity === 'high' ? 'text-red-600' :
                    sug.severity === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900 text-sm">${sug.issue}</div>
                    <div class="text-sm text-gray-700 mt-1">${sug.suggestion}</div>
                    ${sug.examples ? `
                      <div class="mt-2 text-xs text-gray-600">
                        <span class="font-semibold">Examples:</span> ${sug.examples.join(', ')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<p class="text-green-600 font-medium">✓ No issues found! Your resume looks great.</p>'}
    `;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ATS;
}
