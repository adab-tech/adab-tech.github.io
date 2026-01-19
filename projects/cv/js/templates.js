/**
 * Resume Templates Module
 * Defines professional resume templates and rendering logic
 */

const Templates = {
  /**
   * Render resume based on selected template
   */
  render(resumeData, templateId = 'professional') {
    const template = this.templates[templateId];
    if (!template) {
      console.error('Template not found:', templateId);
      return '';
    }
    return template.render(resumeData);
  },

  /**
   * Available templates
   */
  templates: {
    /**
     * Professional Template - Two column layout
     */
    professional: {
      id: 'professional',
      name: 'Professional',
      render(data) {
        const { contact, summary, experience, education, skills } = data.content;
        
        return `
          <div class="bg-white" style="width: 8.5in; min-height: 11in; padding: 0.75in; font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.4;">
            <!-- Header -->
            <div class="mb-6 pb-4 border-b-2" style="border-color: #2563eb;">
              <h1 class="text-4xl font-bold mb-2" style="color: #1e293b;">${Utils.escapeHtml(contact.fullName || 'Your Name')}</h1>
              <div class="flex flex-wrap gap-3 text-sm" style="color: #64748b;">
                ${contact.email ? `<span>✉ ${Utils.escapeHtml(contact.email)}</span>` : ''}
                ${contact.phone ? `<span>📞 ${Utils.escapeHtml(contact.phone)}</span>` : ''}
                ${contact.location ? `<span>📍 ${Utils.escapeHtml(contact.location)}</span>` : ''}
                ${contact.linkedin ? `<span>💼 ${Utils.escapeHtml(contact.linkedin)}</span>` : ''}
                ${contact.website ? `<span>🌐 ${Utils.escapeHtml(contact.website)}</span>` : ''}
              </div>
            </div>

            <!-- Professional Summary -->
            ${summary ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-2 uppercase" style="color: #2563eb;">Professional Summary</h2>
                <p style="color: #334155; text-align: justify;">${Utils.escapeHtml(summary)}</p>
              </div>
            ` : ''}

            <!-- Work Experience -->
            ${experience && experience.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-3 uppercase" style="color: #2563eb;">Work Experience</h2>
                ${experience.map(exp => `
                  <div class="mb-4">
                    <div class="flex justify-between items-baseline mb-1">
                      <h3 class="font-bold" style="color: #1e293b;">${Utils.escapeHtml(exp.title || '')}</h3>
                      <span class="text-sm" style="color: #64748b;">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <div class="text-sm mb-2" style="color: #475569;">
                      <span class="font-semibold">${Utils.escapeHtml(exp.company || '')}</span>
                      ${exp.location ? ` - ${Utils.escapeHtml(exp.location)}` : ''}
                    </div>
                    ${exp.bullets && exp.bullets.length > 0 ? `
                      <ul class="list-disc ml-5 space-y-1" style="color: #334155;">
                        ${exp.bullets.map(bullet => `<li>${Utils.escapeHtml(bullet)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${education && education.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-3 uppercase" style="color: #2563eb;">Education</h2>
                ${education.map(edu => `
                  <div class="mb-3">
                    <div class="flex justify-between items-baseline">
                      <h3 class="font-bold" style="color: #1e293b;">${Utils.escapeHtml(edu.degree || '')}</h3>
                      <span class="text-sm" style="color: #64748b;">${Utils.escapeHtml(edu.graduationDate || '')}</span>
                    </div>
                    <div class="text-sm" style="color: #475569;">
                      ${Utils.escapeHtml(edu.institution || '')}
                      ${edu.location ? ` - ${Utils.escapeHtml(edu.location)}` : ''}
                      ${edu.gpa ? ` | GPA: ${Utils.escapeHtml(edu.gpa)}` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Skills -->
            ${skills && Object.keys(skills).some(cat => skills[cat].length > 0) ? `
              <div>
                <h2 class="text-xl font-bold mb-3 uppercase" style="color: #2563eb;">Skills</h2>
                ${Object.entries(skills).map(([category, skillList]) => {
                  if (!skillList || skillList.length === 0) return '';
                  return `
                    <div class="mb-2">
                      <span class="font-semibold" style="color: #1e293b;">${category}:</span>
                      <span style="color: #334155;"> ${skillList.map(s => Utils.escapeHtml(s)).join(', ')}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      },

      formatDateRange(start, end, current) {
        if (!start) return '';
        const startDate = Utils.formatDate(start);
        const endDate = current ? 'Present' : (end ? Utils.formatDate(end) : '');
        return `${startDate} - ${endDate}`;
      }
    },

    /**
     * Modern Template - Single column, bold headers
     */
    modern: {
      id: 'modern',
      name: 'Modern',
      render(data) {
        const { contact, summary, experience, education, skills } = data.content;
        
        return `
          <div class="bg-white" style="width: 8.5in; min-height: 11in; padding: 0.75in; font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5;">
            <!-- Header with gradient -->
            <div class="mb-6 pb-4" style="border-bottom: 3px solid; border-image: linear-gradient(to right, #667eea, #764ba2) 1;">
              <h1 class="text-5xl font-bold mb-3" style="color: #1a202c; letter-spacing: -0.02em;">${Utils.escapeHtml(contact.fullName || 'Your Name')}</h1>
              <div class="grid grid-cols-2 gap-2 text-sm" style="color: #4a5568;">
                ${contact.email ? `<div>Email: ${Utils.escapeHtml(contact.email)}</div>` : ''}
                ${contact.phone ? `<div>Phone: ${Utils.escapeHtml(contact.phone)}</div>` : ''}
                ${contact.location ? `<div>Location: ${Utils.escapeHtml(contact.location)}</div>` : ''}
                ${contact.linkedin ? `<div>LinkedIn: ${Utils.escapeHtml(contact.linkedin)}</div>` : ''}
              </div>
            </div>

            <!-- Summary with highlight -->
            ${summary ? `
              <div class="mb-6 p-4" style="background: linear-gradient(to right, #f7fafc, #edf2f7); border-left: 4px solid #667eea;">
                <p style="color: #2d3748; font-size: 11pt;">${Utils.escapeHtml(summary)}</p>
              </div>
            ` : ''}

            <!-- Experience with modern styling -->
            ${experience && experience.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-2xl font-bold mb-4" style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem;">EXPERIENCE</h2>
                ${experience.map(exp => `
                  <div class="mb-5">
                    <div class="flex justify-between items-start mb-1">
                      <div>
                        <h3 class="text-lg font-bold" style="color: #1a202c;">${Utils.escapeHtml(exp.title || '')}</h3>
                        <div style="color: #667eea; font-weight: 600;">${Utils.escapeHtml(exp.company || '')}</div>
                      </div>
                      <div class="text-right text-sm" style="color: #718096;">
                        <div>${exp.location || ''}</div>
                        <div>${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                      </div>
                    </div>
                    ${exp.bullets && exp.bullets.length > 0 ? `
                      <ul class="mt-2 space-y-1" style="color: #2d3748;">
                        ${exp.bullets.map(bullet => `<li style="padding-left: 1.5em; text-indent: -1.5em;">▸ ${Utils.escapeHtml(bullet)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${education && education.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-2xl font-bold mb-4" style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem;">EDUCATION</h2>
                ${education.map(edu => `
                  <div class="mb-3 flex justify-between">
                    <div>
                      <h3 class="font-bold" style="color: #1a202c;">${Utils.escapeHtml(edu.degree || '')}</h3>
                      <div style="color: #4a5568;">${Utils.escapeHtml(edu.institution || '')}</div>
                    </div>
                    <div class="text-right text-sm" style="color: #718096;">
                      ${edu.graduationDate || ''}
                      ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Skills with tags -->
            ${skills && Object.keys(skills).some(cat => skills[cat].length > 0) ? `
              <div>
                <h2 class="text-2xl font-bold mb-4" style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem;">SKILLS</h2>
                <div class="flex flex-wrap gap-2">
                  ${Object.values(skills).flat().map(skill => 
                    `<span style="background: #edf2f7; color: #667eea; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 9pt; font-weight: 600;">${Utils.escapeHtml(skill)}</span>`
                  ).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      },

      formatDateRange(start, end, current) {
        if (!start) return '';
        const startDate = Utils.formatDate(start);
        const endDate = current ? 'Present' : (end ? Utils.formatDate(end) : '');
        return `${startDate} - ${endDate}`;
      }
    },

    /**
     * Executive Template - Traditional, formal
     */
    executive: {
      id: 'executive',
      name: 'Executive',
      render(data) {
        const { contact, summary, experience, education, skills } = data.content;
        
        return `
          <div class="bg-white" style="width: 8.5in; min-height: 11in; padding: 1in; font-family: Georgia, serif; font-size: 11pt; line-height: 1.6;">
            <!-- Formal Header -->
            <div class="text-center mb-8 pb-4" style="border-bottom: 3px double #1e3a8a;">
              <h1 class="text-4xl font-bold mb-2" style="color: #1e3a8a; font-family: Georgia, serif;">${Utils.escapeHtml(contact.fullName || 'Your Name')}</h1>
              <div style="color: #475569; font-size: 10pt;">
                ${[contact.email, contact.phone, contact.location, contact.linkedin].filter(Boolean).map(Utils.escapeHtml).join(' | ')}
              </div>
            </div>

            <!-- Executive Summary -->
            ${summary ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-3 text-center" style="color: #1e3a8a; letter-spacing: 0.05em; font-family: Georgia, serif;">EXECUTIVE SUMMARY</h2>
                <p style="color: #1e293b; text-align: justify; text-indent: 2em;">${Utils.escapeHtml(summary)}</p>
              </div>
            ` : ''}

            <!-- Professional Experience -->
            ${experience && experience.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-4 text-center" style="color: #1e3a8a; letter-spacing: 0.05em; font-family: Georgia, serif;">PROFESSIONAL EXPERIENCE</h2>
                ${experience.map(exp => `
                  <div class="mb-5">
                    <div class="mb-1">
                      <div class="flex justify-between">
                        <strong style="color: #1e293b; font-size: 12pt;">${Utils.escapeHtml(exp.title || '')}</strong>
                        <span style="color: #64748b; font-style: italic;">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                      </div>
                      <div style="color: #475569; font-style: italic;">
                        ${Utils.escapeHtml(exp.company || '')}${exp.location ? `, ${Utils.escapeHtml(exp.location)}` : ''}
                      </div>
                    </div>
                    ${exp.bullets && exp.bullets.length > 0 ? `
                      <ul style="color: #1e293b; margin-top: 0.5rem; padding-left: 1.5rem;">
                        ${exp.bullets.map(bullet => `<li style="margin-bottom: 0.25rem;">${Utils.escapeHtml(bullet)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${education && education.length > 0 ? `
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-4 text-center" style="color: #1e3a8a; letter-spacing: 0.05em; font-family: Georgia, serif;">EDUCATION</h2>
                ${education.map(edu => `
                  <div class="mb-3">
                    <div class="flex justify-between">
                      <strong style="color: #1e293b;">${Utils.escapeHtml(edu.degree || '')}</strong>
                      <span style="color: #64748b; font-style: italic;">${Utils.escapeHtml(edu.graduationDate || '')}</span>
                    </div>
                    <div style="color: #475569; font-style: italic;">
                      ${Utils.escapeHtml(edu.institution || '')}${edu.location ? `, ${Utils.escapeHtml(edu.location)}` : ''}
                      ${edu.gpa ? ` | GPA: ${Utils.escapeHtml(edu.gpa)}` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Professional Skills -->
            ${skills && Object.keys(skills).some(cat => skills[cat].length > 0) ? `
              <div>
                <h2 class="text-xl font-bold mb-4 text-center" style="color: #1e3a8a; letter-spacing: 0.05em; font-family: Georgia, serif;">PROFESSIONAL COMPETENCIES</h2>
                ${Object.entries(skills).map(([category, skillList]) => {
                  if (!skillList || skillList.length === 0) return '';
                  return `
                    <p style="color: #1e293b; margin-bottom: 0.5rem;">
                      <strong style="color: #1e3a8a;">${category}:</strong> ${skillList.map(s => Utils.escapeHtml(s)).join(', ')}
                    </p>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      },

      formatDateRange(start, end, current) {
        if (!start) return '';
        const startDate = Utils.formatDate(start);
        const endDate = current ? 'Present' : (end ? Utils.formatDate(end) : '');
        return `${startDate} - ${endDate}`;
      }
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Templates;
}
