// WordService.js - Handles word fetching and dictionary API calls
class WordService {
    constructor(config) {
        this.config = config;
    }
    
    async getRandomWord() {
        // Use the hardcoded word list from config.js
        const words = this.config.getWordList();
        return this.selectRandomWord(words);
    }
    
    parseWordsFromText(text) {
        return text.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => 
                word.length === this.config.getGameSetting('WORD_LENGTH') && 
                /^[a-z]+$/.test(word)
            );
    }
    
    selectRandomWord(words) {
        return words[Math.floor(Math.random() * words.length)];
    }
    
    async getDefinition(word) {
        const apis = [
            {
                endpoint: "sd3",
                key: this.config.getApiKey("sd3")
            },
            {
                endpoint: "learners", 
                key: this.config.getApiKey("learners")
            }
        ];
        
        for (const api of apis) {
            try {
                const definition = await this.fetchDefinitionFromAPI(word, api);
                if (definition) {
                    return definition;
                }
            } catch (error) {
                console.error(`Error fetching definition from ${api.endpoint}:`, error);
                continue;
            }
        }
        
        return "No definition available for this word.";
    }
    
    async fetchDefinitionFromAPI(word, api) {
        const url = `${this.config.getApiEndpoint('DICTIONARY_BASE')}/${api.endpoint}/json/${word}?key=${api.key}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        
        // Check if we got valid entries
        if (!data || data.length === 0) {
            return null;
        }
        
        // Check if we got suggestions instead of definitions
        if (typeof data[0] === "string") {
            return null;
        }
        
        // Extract the first definition
        for (const entry of data) {
            if (entry.shortdef && entry.shortdef.length > 0) {
                return entry.shortdef[0];
            }
        }
        
        return null;
    }
    
    async validateWord(word) {
        // This could be extended to validate words against a dictionary API
        // For now, just check basic format
        return word.length === this.config.getGameSetting('WORD_LENGTH') && 
               /^[a-z]+$/i.test(word);
    }
}

// Export for use in other modules
window.WordService = WordService;