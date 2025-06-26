// config.js - Environment configuration
class Config {
    constructor() {
        
        this.API_KEYS = {
            sd3: "888041d8-79a2-4da0-bb77-3a3fa926176d",
            learners: "bca31600-ec0a-4087-a959-9f652ff2d8d7"
        };
        
        this.GAME_SETTINGS = {
            MAX_TURNS: 6,
            WORD_LENGTH: 5,
            MAX_HINTS: 3,
            VOWELS: "aeiou",
            SCORE_BASE: 100,
            HINT_PENALTY: 25
        };
        
        this.API_ENDPOINTS = {
            DICTIONARY_BASE: "https://dictionaryapi.com/api/v3/references",
            WORDS_FILE: "words.txt"
        };
        
        this.FALLBACK_WORDS = [
            "games", "house", "plant", "shirt", "green", 
            "water", "music", "dance", "earth", "light",
            "power", "space", "ocean", "phone", "table",
            "chair", "heart", "smile", "dream", "world"
        ];
    }
    
    getApiKey(service) {
        return this.API_KEYS[service];
    }
    
    getGameSetting(setting) {
        return this.GAME_SETTINGS[setting];
    }
    
    getApiEndpoint(endpoint) {
        return this.API_ENDPOINTS[endpoint];
    }
    
    getFallbackWords() {
        return this.FALLBACK_WORDS;
    }
}

// Export for use in other modules
window.Config = Config;