/**
 * Storage Module for CV Builder
 * Handles localStorage persistence and data management
 */

const Storage = {
  STORAGE_KEY: 'cvbuilder_data',
  CURRENT_RESUME_KEY: 'cvbuilder_current',
  
  /**
   * Initialize storage
   */
  init() {
    if (!Utils.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }
    
    // Initialize storage structure if it doesn't exist
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = {
        resumes: [],
        settings: {
          defaultTemplate: 'professional',
          autoSave: true
        }
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
    
    return true;
  },

  /**
   * Get all data from storage
   */
  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  /**
   * Save all data to storage
   */
  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      if (error.name === 'QuotaExceededError') {
        Utils.showToast('Storage quota exceeded. Please export your data.', 'error');
      }
      return false;
    }
  },

  /**
   * Get current resume data
   */
  getCurrentResume() {
    const currentId = localStorage.getItem(this.CURRENT_RESUME_KEY);
    if (!currentId) {
      return this.getDefaultResumeData();
    }
    
    const data = this.getData();
    if (!data) return this.getDefaultResumeData();
    
    const resume = data.resumes.find(r => r.id === currentId);
    return resume || this.getDefaultResumeData();
  },

  /**
   * Save current resume
   */
  saveCurrentResume(resumeData) {
    const data = this.getData();
    if (!data) return false;
    
    // Ensure resume has an ID
    if (!resumeData.id) {
      resumeData.id = Utils.generateId();
    }
    
    // Update timestamp
    resumeData.lastModified = new Date().toISOString();
    
    // Find and update or add new
    const index = data.resumes.findIndex(r => r.id === resumeData.id);
    if (index !== -1) {
      data.resumes[index] = resumeData;
    } else {
      data.resumes.push(resumeData);
    }
    
    // Save current resume ID
    localStorage.setItem(this.CURRENT_RESUME_KEY, resumeData.id);
    
    return this.saveData(data);
  },

  /**
   * Delete resume by ID
   */
  deleteResume(id) {
    const data = this.getData();
    if (!data) return false;
    
    data.resumes = data.resumes.filter(r => r.id !== id);
    
    // If deleted resume was current, clear current
    if (localStorage.getItem(this.CURRENT_RESUME_KEY) === id) {
      localStorage.removeItem(this.CURRENT_RESUME_KEY);
    }
    
    return this.saveData(data);
  },

  /**
   * Get all resumes list
   */
  listResumes() {
    const data = this.getData();
    if (!data) return [];
    
    return data.resumes.map(r => ({
      id: r.id,
      title: r.title || 'Untitled Resume',
      lastModified: r.lastModified
    }));
  },

  /**
   * Get settings
   */
  getSettings() {
    const data = this.getData();
    return data?.settings || {
      defaultTemplate: 'professional',
      autoSave: true
    };
  },

  /**
   * Save settings
   */
  saveSettings(settings) {
    const data = this.getData();
    if (!data) return false;
    
    data.settings = { ...data.settings, ...settings };
    return this.saveData(data);
  },

  /**
   * Export all data as JSON
   */
  exportData() {
  const data = this.getData();
  if (!data) return null;
  return JSON.stringify(data, null, 2);
  },

  /**
   * Import data from JSON
   */
  importData(jsonString) {
    try {
      const importedData = JSON.parse(jsonString);
      
      // Validate structure
      if (!importedData.resumes || !Array.isArray(importedData.resumes)) {
        throw new Error('Invalid data structure');
      }
      
      // Merge with existing data (don't overwrite settings)
      const currentData = this.getData();
      const mergedData = {
        resumes: [...currentData.resumes, ...importedData.resumes],
        settings: currentData.settings // Keep existing settings
      };
      
      return this.saveData(mergedData);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  /**
   * Clear all data
   */
  clearAll() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.CURRENT_RESUME_KEY);
      this.init(); // Reinitialize with empty data
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  /**
   * Get default empty resume data
   */
  getDefaultResumeData() {
    return {
      id: Utils.generateId(),
      title: 'My Resume',
      template: 'professional',
      lastModified: new Date().toISOString(),
      content: {
        contact: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: {
          Technical: [],
          Soft: [],
          Languages: [],
          Tools: [],
          Other: []
        }
      }
    };
  },

  /**
   * Get experience entry template
   */
  getExperienceTemplate() {
    return {
      id: Utils.generateId(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: []
    };
  },

  /**
   * Get education entry template
   */
  getEducationTemplate() {
    return {
      id: Utils.generateId(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
  },

  /**
   * Auto-save resume data (debounced)
   */
  autoSave: null, // Will be set to debounced function

  /**
   * Initialize auto-save
   */
  initAutoSave() {
    this.autoSave = Utils.debounce((resumeData) => {
      const settings = this.getSettings();
      if (!settings.autoSave) return;
      
      if (this.saveCurrentResume(resumeData)) {
        const statusEl = document.getElementById('saveStatus');
        if (statusEl) {
          statusEl.textContent = 'Saved';
          statusEl.className = 'text-xs text-green-600';
        }
      }
    }, 5000); // 5 second debounce
  }
};

// Initialize storage on load
Storage.init();
Storage.initAutoSave();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
