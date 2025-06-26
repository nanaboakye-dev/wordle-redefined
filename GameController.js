// GameController.js - Main controller that orchestrates the game
class GameController {
    constructor() {
        this.config = new Config();
        this.model = new GameModel(this.config);
        this.wordService = new WordService(this.config);
        this.view = new GameView();
        
        this.initializeGame();
    }
    
    async initializeGame() {
        try {
            // Get a random word
            const word = await this.wordService.getRandomWord();
            this.model.setSelectedWord(word);
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update the view
            this.updateView();
            
            // For debugging (remove in production)
            console.log("Selected word:", word);
            
        } catch (error) {
            console.error("Error initializing game:", error);
            this.view.showMessage("Error starting game. Please refresh the page.");
        }
    }
    
    setupEventListeners() {
        // Guess submission
        this.view.onGuessSubmit((guess) => {
            this.handleGuess(guess);
        });
        
        // Hint requests
        this.view.onHintRequest((hintType) => {
            this.handleHint(hintType);
        });
        
        // New game request
        this.view.onNewGameRequest(() => {
            this.handleNewGame();
        });
    }
    
    handleGuess(guess) {
        if (this.model.gameOver) return;
        
        const result = this.model.processGuess(guess);
        
        if (!result.success) {
            this.view.showMessage(result.message);
            return;
        }
        
        // Update view
        this.updateView();
        
        // Check if game ended
        if (result.gameOver) {
            this.handleGameEnd();
        }
    }
    
    async handleHint(hintType) {
        if (!this.model.canUseHint()) return;
        
        if (!this.model.useHint()) return;
        
        let hintText = "";
        
        try {
            switch (hintType) {
                case "vowel-positions":
                    hintText = this.generateVowelPositionsHint();
                    break;
                case "vowels-used":
                    hintText = this.generateVowelsUsedHint();
                    break;
                case "definition":
                    this.view.showHint("Looking up definition...");
                    hintText = await this.generateDefinitionHint();
                    break;
                default:
                    hintText = "Invalid hint type";
            }
        } catch (error) {
            console.error("Error generating hint:", error);
            hintText = "Error generating hint. Please try again.";
        }
        
        this.model.setCurrentHint(hintText);
        this.updateView();
    }
    
    generateVowelPositionsHint() {
        const positions = this.model.getVowelPositions();
        
        if (positions.length > 0) {
            return `This word contains vowels at the following positions: ${positions.join(', ')}`;
        } else {
            return "This word doesn't contain any vowels.";
        }
    }
    
    generateVowelsUsedHint() {
        const vowels = this.model.getVowelsInWord();
        
        if (vowels.length > 0) {
            return `This word contains the following vowels: ${vowels.join(', ')}`;
        } else {
            return "This word doesn't contain any vowels.";
        }
    }
    
    async generateDefinitionHint() {
        try {
            const definition = await this.wordService.getDefinition(this.model.selectedWord);
            return `Definition: ${definition}`;
        } catch (error) {
            console.error("Error getting definition:", error);
            return "Unable to fetch definition at this time.";
        }
    }
    
    handleGameEnd() {
        const gameResult = {
            won: this.model.gameWon,
            word: this.model.selectedWord,
            score: this.model.calculateScore(),
            turnsUsed: this.model.usedTurns,
            hintsUsed: this.model.usedHints
        };
        
        this.view.showGameResult(gameResult);
        this.updateView();
    }
    
    async handleNewGame() {
        try {
            // Reset the model
            this.model.reset();
            
            // Get a new word
            const word = await this.wordService.getRandomWord();
            this.model.setSelectedWord(word);
            
            // Update view
            this.view.resetView();
            this.updateView();
            
            // For debugging (remove in production)
            console.log("New word:", word);
            
        } catch (error) {
            console.error("Error starting new game:", error);
            this.view.showMessage("Error starting new game. Please refresh the page.");
        }
    }
    
    updateView() {
        const gameState = {
            turnsLeft: this.model.getTurnsLeft(),
            hintsLeft: this.model.getHintsLeft(),
            wordPattern: this.model.getWordPattern(),
            misplacedLetters: this.model.getMisplacedLetters(),
            incorrectLetters: this.model.getIncorrectLetters(),
            currentHint: this.model.getCurrentHint(),
            guessHistory: this.model.getGuessHistory(),
            gameOver: this.model.gameOver,
            canUseHints: this.model.canUseHint()
        };
        
        this.view.updateGameState(gameState);
    }
}

// Export for use in other modules
window.GameController = GameController;