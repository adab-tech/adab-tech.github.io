/**
 * Khad App — offline clinical communication engine (no external APIs).
 */
class KhadLocalEngine {
  constructor() {
    this.symptomPatterns = [
      { re: /\b(chest pain|heart pain|tight chest|angina)\b/i, label: 'Chest pain', urgency: 'HIGH' },
      { re: /\b(shortness of breath|can't breathe|cannot breathe|difficulty breathing|breathless)\b/i, label: 'Breathing difficulty', urgency: 'HIGH' },
      { re: /\b(severe bleeding|heavy bleeding|blood loss)\b/i, label: 'Heavy bleeding', urgency: 'HIGH' },
      { re: /\b(unconscious|fainted|passed out|seizure|convulsion)\b/i, label: 'Loss of consciousness / seizure', urgency: 'HIGH' },
      { re: /\b(suicidal|self[- ]harm|kill myself)\b/i, label: 'Mental health crisis indicators', urgency: 'HIGH' },
      { re: /\b(high fever|very hot|burning up|39|40\s*c)\b/i, label: 'High fever', urgency: 'MEDIUM' },
      { re: /\b(vomit|vomiting|throwing up|nausea)\b/i, label: 'Nausea / vomiting', urgency: 'MEDIUM' },
      { re: /\b(diarrhea|diarrhoea|loose stool)\b/i, label: 'Diarrhea', urgency: 'MEDIUM' },
      { re: /\b(headache|migraine|head pain)\b/i, label: 'Headache', urgency: 'MEDIUM' },
      { re: /\b(cough|coughing|sore throat)\b/i, label: 'Respiratory symptoms', urgency: 'MEDIUM' },
      { re: /\b(pain|ache|hurts|sore)\b/i, label: 'General pain', urgency: 'MEDIUM' },
      { re: /\b(fever|temperature|chills)\b/i, label: 'Fever', urgency: 'MEDIUM' },
      { re: /\b(dizzy|dizziness|lightheaded)\b/i, label: 'Dizziness', urgency: 'MEDIUM' },
      { re: /\b(rash|itching|itchy|swelling)\b/i, label: 'Skin reaction', urgency: 'LOW' },
      { re: /\b(tired|fatigue|weakness|exhausted)\b/i, label: 'Fatigue', urgency: 'LOW' },
      { re: /\b(cold|runny nose|stuffy nose)\b/i, label: 'Cold symptoms', urgency: 'LOW' },
    ];

    this.phraseBook = {
      en: {
        'I have a headache.': 'Ina da ciwon kai.',
        'I feel dizzy.': 'Ina jin zamani.',
        'I have a fever.': 'Ina da zazzabi.',
        'I feel nauseous.': 'Ina jin ciwon ciki.',
        'I have chest pain.': 'Ina da ciwon kirji.',
        'I cannot breathe well.': 'Ba na iya numfashi da kyau.',
        'I need help.': 'Ina bukatar taimako.',
        'I have been coughing.': 'Ina tari.',
        'My stomach hurts.': 'Ciwon ciki na yi.',
        'I feel very tired.': 'Na gaji sosai.',
      },
      ha: {
        'Ina da ciwon kai.': 'I have a headache.',
        'Ina jin zamani.': 'I feel dizzy.',
        'Ina da zazzabi.': 'I have a fever.',
        'Ina jin ciwon ciki.': 'I feel nauseous.',
        'Ina da ciwon kirji.': 'I have chest pain.',
        'Ba na iya numfashi da kyau.': 'I cannot breathe well.',
        'Ina bukatar taimako.': 'I need help.',
        'Ina tari.': 'I have been coughing.',
        'Ciwon ciki na yi.': 'My stomach hurts.',
        'Na gaji sosai.': 'I feel very tired.',
      },
    };
  }

  normalize(text) {
    const cleaned = String(text || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return '';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  extractSymptoms(text) {
    const normalized = this.normalize(text);
    const found = [];
    const seen = new Set();

    for (const pattern of this.symptomPatterns) {
      if (pattern.re.test(normalized) && !seen.has(pattern.label)) {
        seen.add(pattern.label);
        found.push({ label: pattern.label, urgency: pattern.urgency });
      }
    }

    if (!found.length && normalized.length > 8) {
      found.push({ label: 'General health concern (review with clinician)', urgency: 'MEDIUM' });
    }

    return found;
  }

  summarizeSymptoms(text) {
    const items = this.extractSymptoms(text);
    return items.map((item) => `• ${item.label}`).join('\n');
  }

  assessRisk(text) {
    const items = this.extractSymptoms(text);
    if (items.some((i) => i.urgency === 'HIGH')) return 'HIGH';
    if (items.some((i) => i.urgency === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  translate(text, targetLang, sourceLang = 'en') {
    const normalized = this.normalize(text);
    const book = this.phraseBook[targetLang] || {};
    const reverse = this.phraseBook[sourceLang] || {};

    for (const [phrase, translated] of Object.entries(book)) {
      if (normalized.toLowerCase().includes(phrase.toLowerCase())) {
        return normalized.replace(new RegExp(phrase, 'i'), translated);
      }
    }

    for (const [phrase, translated] of Object.entries(reverse)) {
      if (normalized.toLowerCase().includes(phrase.toLowerCase()) && targetLang === 'en') {
        return normalized.replace(new RegExp(phrase, 'i'), translated);
      }
    }

    const langNames = {
      en: 'English', ha: 'Hausa', yo: 'Yoruba', ig: 'Igbo', fr: 'French', ar: 'Arabic', es: 'Spanish',
    };
    return `[Offline phrase library — partial ${langNames[targetLang] || targetLang} support]\n${normalized}`;
  }

  processPatientReport({ text, sourceLang, targetLang }) {
    const normalized = this.normalize(text);
    const summary = this.summarizeSymptoms(normalized);
    const risk = this.assessRisk(normalized);
    const translated = targetLang ? this.translate(normalized, targetLang, sourceLang) : null;

    return {
      normalized,
      summary,
      risk,
      translated: translated && !translated.startsWith('[Offline') ? translated : null,
      translatedNote: translated && translated.startsWith('[Offline') ? translated : null,
      engine: 'khad-local-v1',
      processedAt: new Date().toISOString(),
    };
  }
}

const khadEngine = new KhadLocalEngine();
window.khadEngine = khadEngine;
