// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Check if all required classes are loaded
    if (typeof Config === 'undefined' || 
        typeof GameModel === 'undefined' || 
        typeof WordService === 'undefined' || 
        typeof GameController === 'undefined' || 
        typeof GameView === 'undefined') {
        
        console.error("One or more required classes are not loaded. Please check your script imports.");
        return;
    }
    
    // Initialize the game controller
    try {
        window.gameController = new GameController();
        console.log("Wordle game initialized successfully!");
    } catch (error) {
        console.error("Error initializing game:", error);
        alert("Failed to initialize the game. Please refresh the page and try again.");
    }
});