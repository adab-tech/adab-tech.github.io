/**
 * AI Router Module for Khad App
 * Abstracts OpenAI GPT and Google Gemini API integrations
 * Provides unified interface for AI-based text analysis
 */

class AIRouter {
    constructor() {
        this.provider = 'openai'; // default provider
        this.apiKey = null;
        this.model = 'gpt-3.5-turbo';
    }

    /**
     * Set the API key for the selected provider
     */
    setApiKey(key) {
        this.apiKey = key;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('khad_api_key', key);
        }
    }

    /**
     * Get stored API key
     */
    getApiKey() {
        if (!this.apiKey && typeof localStorage !== 'undefined') {
            this.apiKey = localStorage.getItem('khad_api_key');
        }
        return this.apiKey;
    }

    /**
     * Set AI provider (openai or gemini)
     */
    setProvider(provider) {
        if (['openai', 'gemini'].includes(provider)) {
            this.provider = provider;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('khad_provider', provider);
            }
        }
    }

    /**
     * Get current provider
     */
    getProvider() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('khad_provider');
            if (stored) this.provider = stored;
        }
        return this.provider;
    }

    /**
     * Set model name
     */
    setModel(model) {
        this.model = model;
    }

    /**
     * Call AI with prompt
     */
    async query(prompt, systemPrompt = null) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('API key not set. Please configure your API key in settings.');
        }

        if (this.provider === 'openai') {
            return await this.queryOpenAI(prompt, systemPrompt);
        } else if (this.provider === 'gemini') {
            return await this.queryGemini(prompt, systemPrompt);
        }
        
        throw new Error(`Unknown provider: ${this.provider}`);
    }

    /**
     * Query OpenAI GPT
     */
    async queryOpenAI(userPrompt, systemPrompt) {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }
        
        messages.push({
            role: 'user',
            content: userPrompt
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Query Google Gemini
     */
    async queryGemini(userPrompt, systemPrompt) {
        // Combine system and user prompts for Gemini
        let fullPrompt = userPrompt;
        if (systemPrompt) {
            fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Translate text to target language
     */
    async translate(text, targetLanguage, sourceLanguage = 'auto') {
        const prompt = window.PROMPTS?.translation(text, targetLanguage, sourceLanguage) || 
            `Translate the following text to ${targetLanguage}:\n\n${text}`;
        
        return await this.query(prompt);
    }

    /**
     * Normalize input text
     */
    async normalize(text) {
        const prompt = window.PROMPTS?.normalization(text) || 
            `Normalize and correct the following text, fixing spelling and grammar:\n\n${text}`;
        
        return await this.query(prompt);
    }

    /**
     * Summarize symptoms from text
     */
    async summarizeSymptoms(text) {
        const systemPrompt = window.PROMPTS?.symptomSystem() || 
            'You are a healthcare communication assistant. Extract and summarize symptoms clearly. Never provide medical diagnoses.';
        
        const userPrompt = window.PROMPTS?.symptomSummary(text) || 
            `Extract and list all symptoms mentioned in the following text:\n\n${text}`;
        
        return await this.query(userPrompt, systemPrompt);
    }

    /**
     * Assess risk level of symptoms
     */
    async assessRisk(symptoms) {
        const systemPrompt = window.PROMPTS?.riskSystem() || 
            'You are a healthcare triage assistant. Assess symptom urgency as LOW, MEDIUM, or HIGH. Never diagnose.';
        
        const userPrompt = window.PROMPTS?.riskAssessment(symptoms) || 
            `Assess the urgency level (LOW/MEDIUM/HIGH) for these symptoms:\n\n${symptoms}\n\nRespond with only: LOW, MEDIUM, or HIGH`;
        
        return await this.query(userPrompt, systemPrompt);
    }
}

// Create singleton instance
if (typeof window !== 'undefined') {
    window.aiRouter = new AIRouter();
}
