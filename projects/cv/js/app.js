/**
 * Main Application Controller for CV Builder
 * Orchestrates all modules and handles UI interactions
 */

const App = {
  currentResume: null,
  isInitialized: false,

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;
    
    try {
      // Load current resume or create new
      this.currentResume = Storage.getCurrentResume();
      
      // Initialize AI module
      AI.init();
      
      // Setup all event listeners
      this.setupEventListeners();
      
      // Load resume data into form
      this.loadFormData();
      
      // Initial preview render
      this.updatePreview();

      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();

      this.isInitialized = true;
      console.log('CV Builder initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      Utils.showToast('Failed to initialize application', 'error');
    }
  },

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    this.setupContactListeners();
    this.setupSummaryListeners();
    this.setupExperienceListeners();
    this.setupEducationListeners();
    this.setupSkillsListeners();
    this.setupTemplateListener();
    this.setupToolbarListeners();
    this.setupSettingsListeners();
    this.setupAtsListeners();
  },

  /**
   * Setup contact information listeners
   */
  setupContactListeners() {
    const contactFields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'website'];
    
    contactFields.forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener('input', Utils.debounce(() => {
          this.currentResume.content.contact[field] = input.value;
          this.saveAndUpdate();
        }, 300));
      }
    });
  },

  /**
   * Setup summary section listeners
   */
  setupSummaryListeners() {
    const summaryTextarea = document.getElementById('summary');
    const summaryCount = document.getElementById('summaryCount');
    const generateBtn = document.getElementById('generateSummaryBtn');

    if (summaryTextarea) {
      // Update character count
      summaryTextarea.addEventListener('input', () => {
        const count = summaryTextarea.value.length;
        summaryCount.textContent = count;
        
        // Color code the count
        if (count > 500) {
          summaryCount.className = 'text-red-600 font-semibold';
        } else if (count > 300) {
          summaryCount.className = 'text-yellow-600';
        } else {
          summaryCount.className = 'text-gray-500';
        }
        
        // Save and update
        this.currentResume.content.summary = summaryTextarea.value;
        this.saveAndUpdate();
      });

      // Trigger initial count
      summaryTextarea.dispatchEvent(new Event('input'));
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Generating...</span>
        `;

        try {
          const summary = await AI.generateSummaryWithFeedback();
          if (summary) {
            summaryTextarea.value = summary;
            this.currentResume.content.summary = summary;
            summaryTextarea.dispatchEvent(new Event('input'));
          }
        } finally {
          generateBtn.disabled = false;
          generateBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>AI Generate</span>
          `;
        }
  });
    }
  },

  /**
   * Setup experience section listeners
   */
  setupExperienceListeners() {
    const addBtn = document.getElementById('addExperienceBtn');
    
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addExperienceEntry();
      });
    }
  },

  /**
   * Add new experience entry
   */
  addExperienceEntry(data = null) {
    const entry = data || Storage.getExperienceTemplate();
    this.currentResume.content.experience.push(entry);
    
    const container = document.getElementById('experienceList');
    const entryElement = this.createExperienceElement(entry);
    container.appendChild(entryElement);
    
    this.saveAndUpdate();
  },

  /**
   * Create experience entry DOM element
   */
  createExperienceElement(entry) {
    const div = document.createElement('div');
    div.className = 'experience-entry bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4';
    div.dataset.id = entry.id;

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-4';
    
    const h3 = document.createElement('h3');
    h3.className = 'text-lg font-semibold text-gray-900';
    h3.textContent = 'Work Experience Entry';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-experience-btn text-red-600 hover:text-red-800 transition-colors';
    removeBtn.title = 'Remove entry';
    removeBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
    
    header.appendChild(h3);
    header.appendChild(removeBtn);

    const body = document.createElement('div');
    body.className = 'space-y-3';

    // Job title and company row
    const grid1 = document.createElement('div');
    grid1.className = 'grid md:grid-cols-2 gap-3';

    const titleWrap = document.createElement('div');
    const titleLabel = document.createElement('label');
    titleLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    titleLabel.textContent = 'Job Title *';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'exp-title w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    titleInput.placeholder = 'Software Engineer';
    titleInput.value = entry.title || '';
    titleWrap.appendChild(titleLabel);
    titleWrap.appendChild(titleInput);

    const companyWrap = document.createElement('div');
    const companyLabel = document.createElement('label');
    companyLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    companyLabel.textContent = 'Company *';
    const companyInput = document.createElement('input');
    companyInput.type = 'text';
    companyInput.className = 'exp-company w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    companyInput.placeholder = 'Company Name';
    companyInput.value = entry.company || '';
    companyWrap.appendChild(companyLabel);
    companyWrap.appendChild(companyInput);

    grid1.appendChild(titleWrap);
    grid1.appendChild(companyWrap);

    // Location and dates row
    const grid2 = document.createElement('div');
    grid2.className = 'grid md:grid-cols-3 gap-3';

    const locWrap = document.createElement('div');
    const locLabel = document.createElement('label');
    locLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    locLabel.textContent = 'Location';
    const locInput = document.createElement('input');
    locInput.type = 'text';
    locInput.className = 'exp-location w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    locInput.placeholder = 'San Francisco, CA';
    locInput.value = entry.location || '';
    locWrap.appendChild(locLabel);
    locWrap.appendChild(locInput);

    const startWrap = document.createElement('div');
    const startLabel = document.createElement('label');
    startLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    startLabel.textContent = 'Start Date';
    const startInput = document.createElement('input');
    startInput.type = 'month';
    startInput.className = 'exp-start w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    startInput.value = entry.startDate || '';
    startWrap.appendChild(startLabel);
    startWrap.appendChild(startInput);

    const endWrap = document.createElement('div');
    const endLabel = document.createElement('label');
    endLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    endLabel.textContent = 'End Date';
    const endInput = document.createElement('input');
    endInput.type = 'month';
    endInput.className = 'exp-end w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    endInput.value = entry.endDate || '';
    endInput.disabled = entry.current;
    endWrap.appendChild(endLabel);
    endWrap.appendChild(endInput);

    grid2.appendChild(locWrap);
    grid2.appendChild(startWrap);
    grid2.appendChild(endWrap);

    // Current job checkbox
    const currentWrap = document.createElement('div');
    currentWrap.className = 'flex items-center';
    const currentCheckbox = document.createElement('input');
    currentCheckbox.type = 'checkbox';
    currentCheckbox.className = 'exp-current mr-2';
    currentCheckbox.checked = entry.current || false;
    const currentLabel = document.createElement('label');
    currentLabel.className = 'text-sm text-gray-700';
    currentLabel.textContent = 'I currently work here';
    currentWrap.appendChild(currentCheckbox);
    currentWrap.appendChild(currentLabel);

    // Bullets section
    const bulletsHeader = document.createElement('div');
    bulletsHeader.className = 'flex items-center justify-between mt-4 mb-2';
    const bulletsTitle = document.createElement('h4');
    bulletsTitle.className = 'text-sm font-semibold text-gray-700';
    bulletsTitle.textContent = 'Key Achievements & Responsibilities';
    const addBulletBtn = document.createElement('button');
    addBulletBtn.className = 'add-bullet-btn text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors';
    addBulletBtn.textContent = '+ Add Bullet';
    bulletsHeader.appendChild(bulletsTitle);
    bulletsHeader.appendChild(addBulletBtn);

    const bulletsList = document.createElement('div');
    bulletsList.className = 'bullets-list space-y-2';
    
    // Add existing bullets
    (entry.bullets || []).forEach((bullet, index) => {
      const bulletEl = this.createBulletElement(bullet, index);
      bulletsList.appendChild(bulletEl);
    });

    body.appendChild(grid1);
    body.appendChild(grid2);
    body.appendChild(currentWrap);
    body.appendChild(bulletsHeader);
    body.appendChild(bulletsList);

    div.appendChild(header);
    div.appendChild(body);

    this.attachExperienceEventListeners(div, entry);
    return div;
  },

  /**
   * Create bullet point element
   */
  createBulletElement(bullet, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'bullet-item flex items-start space-x-2';
    wrapper.dataset.index = index;

    const textarea = document.createElement('textarea');
    textarea.className = 'bullet-text flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm';
    textarea.rows = 2;
    textarea.placeholder = 'Describe your achievement or responsibility...';
    textarea.value = bullet || '';

    const enhanceBtn = document.createElement('button');
    enhanceBtn.className = 'enhance-bullet-btn p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors';
    enhanceBtn.title = 'Enhance with AI';
    enhanceBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-bullet-btn p-2 text-red-600 hover:text-red-800 transition-colors';
    removeBtn.title = 'Remove bullet';
    removeBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;

    wrapper.appendChild(textarea);
    wrapper.appendChild(enhanceBtn);
    wrapper.appendChild(removeBtn);

    return wrapper;
  },

  /**
   * Attach event listeners to experience entry
   */
  attachExperienceEventListeners(entryElement, entry) {
    const id = entry.id;
    
    // Basic fields
    const titleInput = entryElement.querySelector('.exp-title');
    const companyInput = entryElement.querySelector('.exp-company');
    const locationInput = entryElement.querySelector('.exp-location');
    const startInput = entryElement.querySelector('.exp-start');
    const endInput = entryElement.querySelector('.exp-end');
    const currentCheckbox = entryElement.querySelector('.exp-current');
    
    const updateEntry = Utils.debounce(() => {
      const exp = this.currentResume.content.experience.find(e => e.id === id);
      if (exp) {
        exp.title = titleInput.value;
        exp.company = companyInput.value;
        exp.location = locationInput.value;
        exp.startDate = startInput.value;
        exp.endDate = endInput.value;
        exp.current = currentCheckbox.checked;
        this.saveAndUpdate();
      }
    }, 300);
    
    titleInput.addEventListener('input', updateEntry);
    companyInput.addEventListener('input', updateEntry);
    locationInput.addEventListener('input', updateEntry);
    startInput.addEventListener('change', updateEntry);
    endInput.addEventListener('change', updateEntry);
    
    currentCheckbox.addEventListener('change', () => {
      endInput.disabled = currentCheckbox.checked;
      if (currentCheckbox.checked) {
        endInput.value = '';
      }
      updateEntry();
    });
    
    // Remove entry button
    const removeBtn = entryElement.querySelector('.remove-experience-btn');
    removeBtn.addEventListener('click', () => {
      if (confirm('Remove this experience entry?')) {
        this.currentResume.content.experience = this.currentResume.content.experience.filter(e => e.id !== id);
        entryElement.remove();
        this.saveAndUpdate();
        Utils.showToast('Experience entry removed', 'success');
      }
    });
    
    // Add bullet button
    const addBulletBtn = entryElement.querySelector('.add-bullet-btn');
    addBulletBtn.addEventListener('click', () => {
      const exp = this.currentResume.content.experience.find(e => e.id === id);
      if (exp) {
        exp.bullets.push('');
        const bulletsList = entryElement.querySelector('.bullets-list');
        const bulletEl = this.createBulletElement('', exp.bullets.length - 1);
        bulletsList.appendChild(bulletEl);
        this.attachBulletEventListeners(bulletEl, id);
        this.saveAndUpdate();
      }
    });
    
    // Bullet point listeners
    entryElement.querySelectorAll('.bullet-item').forEach(bulletElement => {
      this.attachBulletEventListeners(bulletElement, id);
    });
  },

  /**
   * Attach event listeners to bullet point
   */
  attachBulletEventListeners(bulletElement, experienceId) {
    const textarea = bulletElement.querySelector('.bullet-text');
    const enhanceBtn = bulletElement.querySelector('.enhance-bullet-btn');
    const removeBtn = bulletElement.querySelector('.remove-bullet-btn');
    const index = parseInt(bulletElement.dataset.index);
    
    // Update bullet text
    textarea.addEventListener('input', Utils.debounce(() => {
      const exp = this.currentResume.content.experience.find(e => e.id === experienceId);
      if (exp && exp.bullets[index] !== undefined) {
        exp.bullets[index] = textarea.value;
        this.saveAndUpdate();
      }
    }, 300));
    
      // Enhance with AI (local)
    enhanceBtn.addEventListener('click', async () => {
      
      const originalText = textarea.value;
      if (!originalText.trim()) {
        Utils.showToast('Please enter some text first', 'warning');
        return;
      }
      
      enhanceBtn.disabled = true;
      enhanceBtn.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      `;
      
      try {
        const enhanced = await AI.enhanceBulletWithFeedback(originalText);
        if (enhanced) {
          textarea.value = enhanced;
          const exp = this.currentResume.content.experience.find(e => e.id === experienceId);
          if (exp && exp.bullets[index] !== undefined) {
            exp.bullets[index] = enhanced;
            this.saveAndUpdate();
          }
        }
      } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        `;
      }
    });
    
    // Remove bullet
    removeBtn.addEventListener('click', () => {
      const exp = this.currentResume.content.experience.find(e => e.id === experienceId);
      if (exp) {
        exp.bullets.splice(index, 1);
        bulletElement.remove();
        // Update indices
        bulletElement.parentElement.querySelectorAll('.bullet-item').forEach((el, idx) => {
          el.dataset.index = idx;
        });
        this.saveAndUpdate();
      }
    });
  },

  /**
   * Setup education section listeners
   */
  setupEducationListeners() {
    const addBtn = document.getElementById('addEducationBtn');
    
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addEducationEntry();
      });
    }
  },

  /**
   * Add new education entry
   */
  addEducationEntry(data = null) {
    const entry = data || Storage.getEducationTemplate();
    this.currentResume.content.education.push(entry);
    
    const container = document.getElementById('educationList');
    const entryElement = this.createEducationElement(entry);
    container.appendChild(entryElement);
    
    this.saveAndUpdate();
  },

  /**
   * Create education entry DOM element
   */
  createEducationElement(entry) {
  const div = document.createElement('div');
  div.className = 'education-entry bg-gray-50 p-4 rounded-lg border border-gray-200';
  div.dataset.id = entry.id;

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-4';
  const h3 = document.createElement('h3'); h3.className = 'text-lg font-semibold text-gray-900'; h3.textContent = 'Education Entry';
  const removeBtn = document.createElement('button'); removeBtn.className = 'remove-education-btn text-red-600 hover:text-red-800 transition-colors'; removeBtn.title = 'Remove entry'; removeBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
  header.appendChild(h3); header.appendChild(removeBtn);

  const body = document.createElement('div'); body.className = 'space-y-3';

  const grid1 = document.createElement('div'); grid1.className = 'grid md:grid-cols-2 gap-3';
  const degWrap = document.createElement('div');
  const degLabel = document.createElement('label'); degLabel.className = 'block text-sm font-medium text-gray-700 mb-1'; degLabel.textContent = 'Degree *';
  const degInput = document.createElement('input'); degInput.type = 'text'; degInput.className = 'edu-degree w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'; degInput.placeholder = 'Bachelor of Science in Computer Science'; degInput.value = entry.degree || '';
  degWrap.appendChild(degLabel); degWrap.appendChild(degInput);

  const instWrap = document.createElement('div');
  const instLabel = document.createElement('label'); instLabel.className = 'block text-sm font-medium text-gray-700 mb-1'; instLabel.textContent = 'Institution *';
  const instInput = document.createElement('input'); instInput.type = 'text'; instInput.className = 'edu-institution w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'; instInput.placeholder = 'University Name'; instInput.value = entry.institution || '';
  instWrap.appendChild(instLabel); instWrap.appendChild(instInput);

  grid1.appendChild(degWrap); grid1.appendChild(instWrap);

  const grid2 = document.createElement('div'); grid2.className = 'grid md:grid-cols-3 gap-3';
  const locWrap = document.createElement('div');
  const locLabel = document.createElement('label'); locLabel.className = 'block text-sm font-medium text-gray-700 mb-1'; locLabel.textContent = 'Location';
  const locInput = document.createElement('input'); locInput.type = 'text'; locInput.className = 'edu-location w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'; locInput.placeholder = 'Boston, MA'; locInput.value = entry.location || '';
  locWrap.appendChild(locLabel); locWrap.appendChild(locInput);

  const gradWrap = document.createElement('div');
  const gradLabel = document.createElement('label'); gradLabel.className = 'block text-sm font-medium text-gray-700 mb-1'; gradLabel.textContent = 'Graduation Date';
  const gradInput = document.createElement('input'); gradInput.type = 'month'; gradInput.className = 'edu-graduation w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'; gradInput.value = entry.graduationDate || '';
  gradWrap.appendChild(gradLabel); gradWrap.appendChild(gradInput);

  const gpaWrap = document.createElement('div');
  const gpaLabel = document.createElement('label'); gpaLabel.className = 'block text-sm font-medium text-gray-700 mb-1'; gpaLabel.textContent = 'GPA (optional)';
  const gpaInput = document.createElement('input'); gpaInput.type = 'text'; gpaInput.className = 'edu-gpa w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'; gpaInput.placeholder = '3.8'; gpaInput.value = entry.gpa || '';
  gpaWrap.appendChild(gpaLabel); gpaWrap.appendChild(gpaInput);

  grid2.appendChild(locWrap); grid2.appendChild(gradWrap); grid2.appendChild(gpaWrap);

  body.appendChild(grid1); body.appendChild(grid2);

  div.appendChild(header); div.appendChild(body);

  this.attachEducationEventListeners(div, entry);
  return div;
  },

  /**
   * Attach event listeners to education entry
   */
  attachEducationEventListeners(entryElement, entry) {
    const id = entry.id;
    
    const degreeInput = entryElement.querySelector('.edu-degree');
    const institutionInput = entryElement.querySelector('.edu-institution');
    const locationInput = entryElement.querySelector('.edu-location');
    const graduationInput = entryElement.querySelector('.edu-graduation');
    const gpaInput = entryElement.querySelector('.edu-gpa');
    
    const updateEntry = Utils.debounce(() => {
      const edu = this.currentResume.content.education.find(e => e.id === id);
      if (edu) {
        edu.degree = degreeInput.value;
        edu.institution = institutionInput.value;
        edu.location = locationInput.value;
        edu.graduationDate = graduationInput.value;
        edu.gpa = gpaInput.value;
        this.saveAndUpdate();
      }
    }, 300);
    
    degreeInput.addEventListener('input', updateEntry);
    institutionInput.addEventListener('input', updateEntry);
    locationInput.addEventListener('input', updateEntry);
    graduationInput.addEventListener('change', updateEntry);
    gpaInput.addEventListener('input', updateEntry);
    
    // Remove entry button
    const removeBtn = entryElement.querySelector('.remove-education-btn');
    removeBtn.addEventListener('click', () => {
      if (confirm('Remove this education entry?')) {
        this.currentResume.content.education = this.currentResume.content.education.filter(e => e.id !== id);
        entryElement.remove();
        this.saveAndUpdate();
        Utils.showToast('Education entry removed', 'success');
      }
    });
  },

  /**
   * Setup skills section listeners
   */
  setupSkillsListeners() {
    const addBtn = document.getElementById('addSkillBtn');
    
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.showAddSkillModal();
      });
    }
  },

  /**
   * Show add skill modal (inline prompt)
   */
  showAddSkillModal() {
    const category = document.getElementById('skillCategory').value;
    const skillName = prompt(`Enter a skill for ${category}:`);
    
    if (skillName && skillName.trim()) {
      this.addSkill(category, skillName.trim());
    }
  },

  /**
   * Add a skill to a category
   */
  addSkill(category, skillName) {
    if (!this.currentResume.content.skills[category]) {
      this.currentResume.content.skills[category] = [];
    }
    
    // Check for duplicates
    if (this.currentResume.content.skills[category].includes(skillName)) {
      Utils.showToast('Skill already exists', 'warning');
      return;
    }
    
    this.currentResume.content.skills[category].push(skillName);
    this.renderSkills();
    this.saveAndUpdate();
    Utils.showToast(`Added "${skillName}" to ${category}`, 'success');
  },

  /**
   * Remove a skill
   */
  removeSkill(category, skillName) {
    if (this.currentResume.content.skills[category]) {
      this.currentResume.content.skills[category] = this.currentResume.content.skills[category].filter(s => s !== skillName);
      this.renderSkills();
      this.saveAndUpdate();
    }
  },

  /**
   * Render all skills grouped by category
   */
  renderSkills() {
    const container = document.getElementById('skillsList');
    // Clear container
    container.innerHTML = '';

    const skills = this.currentResume.content.skills;

    Object.entries(skills).forEach(([category, skillList]) => {
      if (skillList && skillList.length > 0) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category mb-3';

        // Header
        const header = document.createElement('h4');
        header.className = 'text-sm font-semibold text-gray-700 mb-2';
        header.textContent = category;
        categoryDiv.appendChild(header);

        // Skills container
        const skillsWrap = document.createElement('div');
        skillsWrap.className = 'flex flex-wrap gap-2';

        skillList.forEach(skill => {
          const skillItem = document.createElement('div');
          skillItem.className = 'skill-item flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm';

          const span = document.createElement('span');
          span.className = 'skill-text';
          span.textContent = skill;

          const btn = document.createElement('button');
          btn.className = 'remove-skill-btn text-blue-600 hover:text-blue-900';
          btn.setAttribute('data-category', category);
          // Store raw skill value in dataset to avoid HTML-escaped entities
          btn.dataset.skill = skill;

          btn.innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>`;

          // Attach listener
          btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            const skill = btn.dataset.skill;
            if (confirm(`Remove "${skill}" from ${category}?`)) {
              this.removeSkill(category, skill);
              Utils.showToast('Skill removed', 'success');
            }
          });

          skillItem.appendChild(span);
          skillItem.appendChild(btn);
          skillsWrap.appendChild(skillItem);
        });

        categoryDiv.appendChild(skillsWrap);
        container.appendChild(categoryDiv);
      }
    });
    
    if (container.innerHTML === '') {
      container.innerHTML = '<p class="text-gray-500 text-sm italic">No skills added yet. Click "Add Skill" to get started.</p>';
    }
  },

  /**
   * Setup template selector listener
   */
  setupTemplateListener() {
    const selector = document.getElementById('templateSelector');
    
    if (selector) {
      selector.value = this.currentResume.template || 'professional';
      
      selector.addEventListener('change', () => {
        this.currentResume.template = selector.value;
        this.saveAndUpdate();
        Utils.showToast('Template changed', 'success');
      });
    }
  },

  /**
   * Setup toolbar button listeners
   */
  setupToolbarListeners() {
    // Export PDF button
    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        exportBtn.disabled = true;
        const originalHTML = exportBtn.innerHTML;
        exportBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span class="hidden sm:inline">Exporting...</span>
        `;
        
        try {
          await PDFExport.exportPDF(this.currentResume, this.currentResume.template);
        } finally {
          exportBtn.disabled = false;
          exportBtn.innerHTML = originalHTML;
        }
      });
    }
  },

  /**
   * Setup settings modal listeners
   */
  setupSettingsListeners() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('closeSettingsBtn');
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    const clearBtn = document.getElementById('clearAllBtn');
    
    // Open modal
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        // Load current settings (no API key required)
        const settings = Storage.getSettings();
        // Future settings can be loaded here
      });
    }
    
    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
      });
    }
    
    // Close on backdrop click
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
      }
    });
    
  // No API key to save (all AI features are local)
    
    // Export data
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonData = Storage.exportData();
        if (jsonData) {
          Utils.downloadFile(jsonData, 'cv-builder-data.json', 'application/json');
          Utils.showToast('Data exported successfully', 'success');
        }
      });
    }
    
    // Import data
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        importFileInput.click();
      });
    }
    
    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const success = Storage.importData(event.target.result);
            if (success) {
              Utils.showToast('Data imported successfully', 'success');
              // Reload current resume
              this.currentResume = Storage.getCurrentResume();
              this.loadFormData();
              this.updatePreview();
            } else {
              Utils.showToast('Failed to import data', 'error');
            }
          } catch (error) {
            Utils.showToast('Invalid JSON file', 'error');
          }
          importFileInput.value = '';
        };
        reader.readAsText(file);
      });
    }
    
    // Clear all data
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
          if (confirm('This will delete all your resumes and settings. Are you absolutely sure?')) {
            Storage.clearAll();
            // Reload page to reset
            window.location.reload();
          }
        }
      });
    }
  },

  /**
   * Setup ATS score modal listeners
   */
  setupAtsListeners() {
    const atsBtn = document.getElementById('atsScoreBtn');
    const atsModal = document.getElementById('atsModal');
    const closeBtn = document.getElementById('closeAtsBtn');
    const contentDiv = document.getElementById('atsScoreContent');
    
    // Open modal and calculate score
    if (atsBtn) {
      atsBtn.addEventListener('click', () => {
        atsModal.classList.remove('hidden');
        
        // Calculate score
        const scoreData = ATS.calculateScore(this.currentResume);
        
  // Render results (sanitize output before inserting)
  Utils.sanitizeAndSetInnerHTML(contentDiv, ATS.renderScoreModal(scoreData));
      });
    }
    
    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        atsModal.classList.add('hidden');
      });
    }
    
    // Close on backdrop click
    atsModal.addEventListener('click', (e) => {
      if (e.target === atsModal) {
        atsModal.classList.add('hidden');
      }
    });
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S or Cmd+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        Storage.saveCurrentResume(this.currentResume);
        Utils.showToast('Resume saved manually', 'success');
        this.updateSaveStatus('Saved');
      }
      
      // Ctrl+P or Cmd+P - Export PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        document.getElementById('exportPdfBtn').click();
      }
    });
  },

  /**
   * Load form data from current resume
   */
  loadFormData() {
    const { contact, summary, experience, education, skills } = this.currentResume.content;
    
    // Load contact information
    Object.keys(contact).forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.value = contact[field] || '';
      }
    });
    
    // Load summary
    const summaryTextarea = document.getElementById('summary');
    if (summaryTextarea) {
      summaryTextarea.value = summary || '';
      summaryTextarea.dispatchEvent(new Event('input')); // Trigger character count
    }
    
    // Load experience entries
    const experienceContainer = document.getElementById('experienceList');
    experienceContainer.innerHTML = '';
    experience.forEach(exp => {
      const element = this.createExperienceElement(exp);
      experienceContainer.appendChild(element);
    });
    
    // Load education entries
    const educationContainer = document.getElementById('educationList');
    educationContainer.innerHTML = '';
    education.forEach(edu => {
      const element = this.createEducationElement(edu);
      educationContainer.appendChild(element);
    });
    
    // Load skills
    this.renderSkills();
    
    // Load template selection
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
      templateSelector.value = this.currentResume.template || 'professional';
    }
  },

  /**
   * Save current resume and update preview
   */
  saveAndUpdate() {
    this.updateSaveStatus('Saving...');
    Storage.autoSave(this.currentResume);
    this.debouncedUpdatePreview();
  },

  /**
   * Update save status indicator
   */
  updateSaveStatus(status) {
    const statusEl = document.getElementById('saveStatus');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = status === 'Saved' 
        ? 'text-xs text-green-600'
        : 'text-xs text-yellow-600';
    }
  },

  /**
   * Update preview (debounced)
   */
  debouncedUpdatePreview: Utils.debounce(function() {
    App.updatePreview();
  }, 500),

  /**
   * Update preview panel
   */
  updatePreview() {
    const previewContainer = document.getElementById('resumePreview');
    if (!previewContainer) return;
    
    try {
  const html = Templates.render(this.currentResume, this.currentResume.template);
  // Safely set preview HTML to avoid executing any injected scripts or event handlers
  Utils.sanitizeAndSetInnerHTML(previewContainer, html);
    } catch (error) {
      console.error('Preview render error:', error);
      previewContainer.innerHTML = `
        <div class="p-12 text-center text-red-600">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-lg">Error rendering preview</p>
        </div>
      `;
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
