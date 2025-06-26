// GameModel.js - Handles game state and business logic
class GameModel {
    constructor(config) {
        this.config = config;
        this.reset();
    }
    
    reset() {
        this.selectedWord = null;
        this.usedTurns = 0;
        this.usedHints = 0;
        this.incorrectLetters = [];
        this.misplacedLetters = [];
        this.correctlyPlacedLetters = Array(this.config.getGameSetting('WORD_LENGTH')).fill("_");
        this.gameWon = false;
        this.gameOver = false;
        this.guesses = [];
        this.currentHint = "";
    }
    
    setSelectedWord(word) {
        this.selectedWord = word.toLowerCase();
    }
    
    processGuess(guess) {
        const normalizedGuess = guess.toLowerCase().trim();
        
        // Validate input
        if (!this.isValidGuess(normalizedGuess)) {
            return {
                success: false,
                message: this.getValidationMessage(normalizedGuess)
            };
        }
        
        // Increment turns
        this.usedTurns++;
        
        // Add to guesses
        this.guesses.push(normalizedGuess);
        
        // Check if guess is correct
        if (normalizedGuess === this.selectedWord) {
            this.gameWon = true;
            this.gameOver = true;
            // Fill in all correct letters
            for (let i = 0; i < this.config.getGameSetting('WORD_LENGTH'); i++) {
                this.correctlyPlacedLetters[i] = this.selectedWord[i];
            }
        } else {
            this.updateLetterStates(normalizedGuess);
            
            // Check if out of turns
            if (this.usedTurns >= this.config.getGameSetting('MAX_TURNS')) {
                this.gameOver = true;
            }
        }
        
        return {
            success: true,
            gameWon: this.gameWon,
            gameOver: this.gameOver
        };
    }
    
    isValidGuess(guess) {
        return guess.length === this.config.getGameSetting('WORD_LENGTH') && 
               /^[a-z]+$/.test(guess);
    }
    
    getValidationMessage(guess) {
        if (guess.length !== this.config.getGameSetting('WORD_LENGTH')) {
            return `Please enter a ${this.config.getGameSetting('WORD_LENGTH')}-letter word`;
        }
        if (!guess.match(/^[a-z]+$/i)) {
            return "Your guess must contain only letters";
        }
        return "";
    }
    
    updateLetterStates(guess) {
        // Reset misplaced letters for this guess
        const newMisplacedLetters = [...this.misplacedLetters];
        
        for (let i = 0; i < this.config.getGameSetting('WORD_LENGTH'); i++) {
            const letter = guess[i];
            
            if (letter === this.selectedWord[i]) {
                // Correct position
                this.correctlyPlacedLetters[i] = letter;
                
                // Remove from misplaced if it was there
                const misplacedIndex = newMisplacedLetters.indexOf(letter);
                if (misplacedIndex !== -1) {
                    newMisplacedLetters.splice(misplacedIndex, 1);
                }
            } else if (this.selectedWord.includes(letter)) {
                // Wrong position but in word
                if (!newMisplacedLetters.includes(letter) && 
                    !this.correctlyPlacedLetters.includes(letter)) {
                    newMisplacedLetters.push(letter);
                }
            } else {
                // Not in word
                if (!this.incorrectLetters.includes(letter)) {
                    this.incorrectLetters.push(letter);
                }
            }
        }
        
        this.misplacedLetters = newMisplacedLetters;
    }
    
    canUseHint() {
        return !this.gameOver && this.usedHints < this.config.getGameSetting('MAX_HINTS');
    }
    
    useHint() {
        if (this.canUseHint()) {
            this.usedHints++;
            return true;
        }
        return false;
    }
    
    getVowelPositions() {
        const vowels = this.config.getGameSetting('VOWELS');
        const positions = [];
        
        for (let i = 0; i < this.selectedWord.length; i++) {
            if (vowels.includes(this.selectedWord[i])) {
                positions.push(i + 1);
            }
        }
        
        return positions;
    }
    
    getVowelsInWord() {
        const vowels = this.config.getGameSetting('VOWELS');
        return [...new Set(this.selectedWord.split('').filter(char => vowels.includes(char)))];
    }
    
    calculateScore() {
        if (!this.gameWon) return 0;
        
        const baseScore = (this.config.getGameSetting('MAX_TURNS') - this.usedTurns + 1) * 
                         this.config.getGameSetting('SCORE_BASE');
        const hintPenalty = this.usedHints * this.config.getGameSetting('HINT_PENALTY');
        
        return Math.max(0, baseScore - hintPenalty);
    }
    
    getGuessHistory() {
        return this.guesses.map((guess, index) => ({
            number: index + 1,
            word: guess,
            letters: this.getLetterFeedback(guess)
        }));
    }
    
    getLetterFeedback(guess) {
        const feedback = [];
        
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            let status = 'incorrect';
            
            if (letter === this.selectedWord[i]) {
                status = 'correct';
            } else if (this.selectedWord.includes(letter)) {
                status = 'misplaced';
            }
            
            feedback.push({
                letter: letter,
                status: status
            });
        }
        
        return feedback;
    }
    
    // Getters for game state
    getTurnsLeft() {
        return this.config.getGameSetting('MAX_TURNS') - this.usedTurns;
    }
    
    getHintsLeft() {
        return this.config.getGameSetting('MAX_HINTS') - this.usedHints;
    }
    
    getWordPattern() {
        return this.correctlyPlacedLetters.join(" ");
    }
    
    getMisplacedLetters() {
        return this.misplacedLetters;
    }
    
    getIncorrectLetters() {
        return this.incorrectLetters;
    }
    
    getCurrentHint() {
        return this.currentHint;
    }
    
    setCurrentHint(hint) {
        this.currentHint = hint;
    }
}

// Export for use in other modules
window.GameModel = GameModel;