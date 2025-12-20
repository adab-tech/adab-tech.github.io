/**
 * Prompt Templates for Khad App
 * Reusable, prompt-driven workflows for AI operations
 */

window.PROMPTS = {
    /**
     * Translation prompt
     */
    translation: (text, targetLanguage, sourceLanguage = 'auto') => {
        return `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain the original meaning and tone. Only provide the translation, no explanations.

Text to translate:
${text}`;
    },

    /**
     * Text normalization prompt
     */
    normalization: (text) => {
        return `Normalize the following text by:
1. Correcting spelling and grammar errors
2. Standardizing punctuation and capitalization
3. Maintaining the original meaning
4. Keeping the same language

Only provide the normalized text, no explanations.

Text to normalize:
${text}`;
    },

    /**
     * System prompt for symptom extraction
     */
    symptomSystem: () => {
        return `You are a healthcare communication assistant that helps extract and clarify symptoms from patient descriptions.

IMPORTANT GUIDELINES:
- Extract only symptoms, complaints, and relevant medical information
- Use clear, professional medical terminology
- Never provide diagnoses, treatment recommendations, or medical advice
- Format as a clear, bulleted list
- If no symptoms are mentioned, state "No specific symptoms identified"

Remember: This tool is for communication clarity only, not clinical assessment.`;
    },

    /**
     * Symptom summary prompt
     */
    symptomSummary: (text) => {
        return `Extract and list all symptoms, complaints, or health concerns mentioned in the following patient description:

Patient Input:
${text}

Provide a clear, bulleted list of symptoms. Be specific and use medical terminology where appropriate.`;
    },

    /**
     * System prompt for risk assessment
     */
    riskSystem: () => {
        return `You are a healthcare triage assistant that assesses symptom urgency levels for communication purposes.

URGENCY LEVELS:
- LOW: Minor symptoms, non-urgent, can wait for routine care
- MEDIUM: Concerning symptoms that warrant timely medical attention
- HIGH: Serious symptoms requiring immediate medical evaluation

IMPORTANT:
- This is for communication triage only, not medical diagnosis
- Base assessment on symptom severity, duration, and potential urgency
- When uncertain, err on the side of higher urgency
- Never provide diagnoses or treatment recommendations

Respond with ONLY one word: LOW, MEDIUM, or HIGH`;
    },

    /**
     * Risk assessment prompt
     */
    riskAssessment: (symptoms) => {
        return `Assess the urgency level for the following symptoms. Respond with only ONE word: LOW, MEDIUM, or HIGH

Symptoms:
${symptoms}

Urgency Level:`;
    },

    /**
     * Get safety disclaimer
     */
    safetyDisclaimer: () => {
        return `⚕️ IMPORTANT DISCLAIMER: This tool is for communication assistance only. It does not provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.`;
    },

    /**
     * Get patient interface disclaimer
     */
    patientDisclaimer: () => {
        return `This tool helps you describe your symptoms clearly. It is NOT a substitute for professional medical advice. If you have a medical emergency, call emergency services immediately.`;
    },

    /**
     * Get provider interface disclaimer
     */
    providerDisclaimer: () => {
        return `This tool provides communication clarity and symptom organization. It does not diagnose conditions or recommend treatments. All clinical decisions must be made by qualified healthcare professionals.`;
    }
};
