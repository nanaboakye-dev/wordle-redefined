// GameView.js - Handles all DOM manipulation and user interface
class GameView {
    constructor() {
        this.initializeElements();
        this.setupBasicEventListeners();
    }
    
    initializeElements() {
        // Game state elements
        this.wordPatternElement = document.getElementById("word-pattern");
        this.turnsCountElement = document.getElementById("turns-count");
        this.hintsCountElement = document.getElementById("hints-count");
        
        // Input elements
        this.guessInputElement = document.getElementById("guess-input");
        this.guessButtonElement = document.getElementById("guess-button");
        
        // Feedback elements
        this.guessesListElement = document.getElementById("guesses-list");
        this.misplacedLettersElement = document.getElementById("misplaced-letters");
        this.incorrectLettersElement = document.getElementById("incorrect-letters");
        this.hintDisplayElement = document.getElementById("hint-display");
        
        // Game result elements
        this.gameResultElement = document.getElementById("game-result");
        this.resultMessageElement = document.getElementById("result-message");
        this.wordRevealElement = document.getElementById("word-reveal");
        this.scoreDisplayElement = document.getElementById("score-display");
        this.newGameButtonElement = document.getElementById("new-game-button");
        
        // Hint buttons
        this.hint1ButtonElement = document.getElementById("hint1-button");
        this.hint2ButtonElement = document.getElementById("hint2-button");
        this.hint3ButtonElement = document.getElementById("hint3-button");
    }
    
    setupBasicEventListeners() {
        // Enter key in input field
        this.guessInputElement.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.handleGuessSubmit();
            }
        });
    }
    
    // Event listener setup methods
    onGuessSubmit(callback) {
        this.guessSubmitCallback = callback;
        
        this.guessButtonElement.addEventListener("click", () => {
            this.handleGuessSubmit();
        });
    }
    
    onHintRequest(callback) {
        this.hintRequestCallback = callback;
        
        this.hint1ButtonElement.addEventListener("click", () => {
            this.hintRequestCallback("vowel-positions");
        });
        
        this.hint2ButtonElement.addEventListener("click", () => {
            this.hintRequestCallback("vowels-used");
        });
        
        this.hint3ButtonElement.addEventListener("click", () => {
            this.hintRequestCallback("definition");
        });
    }
    
    onNewGameRequest(callback) {
        this.newGameRequestCallback = callback;
        
        this.newGameButtonElement.addEventListener("click", () => {
            this.newGameRequestCallback();
        });
    }
    
    handleGuessSubmit() {
        const guess = this.guessInputElement.value.trim();
        if (guess && this.guessSubmitCallback) {
            this.guessSubmitCallback(guess);
            this.guessInputElement.value = ""; // Clear input
        }
    }
    
    // UI Update methods
    updateGameState(gameState) {
        this.updateTurnsCount(gameState.turnsLeft);
        this.updateHintsCount(gameState.hintsLeft);
        this.updateWordPattern(gameState.wordPattern);
        this.updateLetterFeedback(gameState.misplacedLetters, gameState.incorrectLetters);
        this.updateHintDisplay(gameState.currentHint);
        this.updateGuessHistory(gameState.guessHistory);
        this.updateInputState(gameState.gameOver);
        this.updateHintButtons(gameState.canUseHints && !gameState.gameOver);
    }
    
    updateTurnsCount(turnsLeft) {
        this.turnsCountElement.textContent = turnsLeft;
    }
    
    updateHintsCount(hintsLeft) {
        this.hintsCountElement.textContent = hintsLeft;
    }
    
    updateWordPattern(pattern) {
        this.wordPatternElement.textContent = pattern;
    }
    
    updateLetterFeedback(misplacedLetters, incorrectLetters) {
        this.misplacedLettersElement.textContent = 
            misplacedLetters.length > 0 ? misplacedLetters.join(", ") : "None";
        
        this.incorrectLettersElement.textContent = 
            incorrectLetters.length > 0 ? incorrectLetters.join(", ") : "None";
    }
    
    updateHintDisplay(hint) {
        this.hintDisplayElement.textContent = hint || "";
    }
    
    updateGuessHistory(guessHistory) {
        // Clear existing guesses
        this.guessesListElement.innerHTML = "";
        
        guessHistory.forEach(guess => {
            this.addGuessToHistory(guess);
        });
    }
    
    addGuessToHistory(guess) {
        const guessElement = document.createElement("div");
        guessElement.className = "guess-item";
        
        // Format guess with feedback
        let formattedGuess = "";
        guess.letters.forEach(letterInfo => {
            const cssClass = this.getLetterCssClass(letterInfo.status);
            formattedGuess += `<span class="${cssClass}">${letterInfo.letter}</span>`;
        });
        
        guessElement.innerHTML = `Guess #${guess.number}: ${formattedGuess}`;
        this.guessesListElement.appendChild(guessElement);
    }
    
    getLetterCssClass(status) {
        switch (status) {
            case "correct":
                return "correct-letter";
            case "misplaced":
                return "misplaced-letter";
            case "incorrect":
                return "incorrect-letter";
            default:
                return "";
        }
    }
    
    updateInputState(gameOver) {
        this.guessInputElement.disabled = gameOver;
        this.guessButtonElement.disabled = gameOver;
    }
    
    updateHintButtons(enabled) {
        this.hint1ButtonElement.disabled = !enabled;
        this.hint2ButtonElement.disabled = !enabled;
        this.hint3ButtonElement.disabled = !enabled;
    }
    
    // Game result methods
    showGameResult(result) {
        this.gameResultElement.classList.remove("hidden");
        
        if (result.won) {
            this.resultMessageElement.textContent = "🎉 Congratulations! You Won!";
            this.wordRevealElement.textContent = `You guessed the word: ${result.word}`;
            this.scoreDisplayElement.textContent = `Your score: ${result.score} points`;
        } else {
            this.resultMessageElement.textContent = "Game Over";
            this.wordRevealElement.textContent = `The word was: ${result.word}`;
            this.scoreDisplayElement.textContent = "Better luck next time!";
        }
    }
    
    resetView() {
        // Hide game result
        this.gameResultElement.classList.add("hidden");
        
        // Clear guess history
        this.guessesListElement.innerHTML = "";
        
        // Clear hint display
        this.hintDisplayElement.textContent = "";
        
        // Enable input
        this.guessInputElement.disabled = false;
        this.guessButtonElement.disabled = false;
        this.guessInputElement.focus();
        
        // Enable hint buttons
        this.hint1ButtonElement.disabled = false;
        this.hint2ButtonElement.disabled = false;
        this.hint3ButtonElement.disabled = false;
    }
    
    // Utility methods
    showMessage(message) {
        alert(message); // Could be replaced with a more elegant notification system
    }
    
    showHint(hint) {
        this.hintDisplayElement.textContent = hint;
    }
    
    focusInput() {
        this.guessInputElement.focus();
    }
}

// Export for use in other modules
window.GameView = GameView;