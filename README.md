# Wordle - MVC Architecture

## Motivation

Growing up, I had a love-hate relationship with the Wordle game on the New York Times website. Sometimes I could complete it with ease, but on other occasions it frustrated me so much. I always wished I had a hint sometimes! This inspired me to create my own alternate version of the game, with helpful hints and a fresh take on the experience.

This is a refactored version of the Wordle game using the Model-View-Controller (MVC) architectural pattern for better code organization and maintainability.

## File Structure

```
wordle/
├── index.html
├── styles.css
├── config.js
├── GameModel.js
├── WordService.js
├── GameView.js
├── GameController.js
├── main.js
└── README.md
```

## Architecture Overview

### Model-View-Controller Pattern

The application is organized using the MVC pattern:

- **Model** (`GameModel.js`): Manages game state, business logic, and data
- **View** (`GameView.js`): Handles all DOM manipulation and user interface
- **Controller** (`GameController.js`): Coordinates between Model and View, handles user interactions

### Additional Components

- **Config** (`config.js`): Centralized configuration management
- **WordService** (`WordService.js`): Handles word fetching and dictionary API calls

## Key Features of the Refactored Version

### 1. Separation of Concerns

- **GameModel**: Pure business logic, no DOM manipulation
- **GameView**: Pure UI logic, no business rules
- **GameController**: Orchestrates interactions between Model and View

### 2. Improved Maintainability

- Each class has a single responsibility
- Easy to test individual components
- Clear interfaces between components

### 3. Better Configuration Management

- Centralized configuration in `config.js`
- Environment variables support
- Easy to modify game settings

### 4. Enhanced Error Handling

- Graceful fallbacks for API failures
- Better error messages for users
- Comprehensive error logging

## Setup Instructions

### 1. File Organization

Make sure all JavaScript files are in the correct order in your HTML:

```html
<script src="config.js"></script>
<script src="GameModel.js"></script>
<script src="WordService.js"></script>
<script src="GameView.js"></script>
<script src="GameController.js"></script>
<script src="main.js"></script>
```

### 2. Environment Configuration

Set your API keys directly in `config.js`:

```js
this.API_KEYS = {
  sd3: "888041d8-79a2-4da0-bb77-3a3fa926176d",
  learners: "bca31600-ec0a-4087-a959-9f652ff2d8d7",
};
```

### 3. API Keys

Get your dictionary API keys from [Merriam-Webster Dictionary API](https://dictionaryapi.com/)

### 4. Word List

The word list is hardcoded directly in `config.js` as a JavaScript array, so no external `words.txt` file is needed. You can edit the array in `config.js` to customize the game's vocabulary.

## Class Documentation

### Config

- Manages all configuration settings
- Provides centralized access to API keys
- All configuration is managed directly in `config.js` for browser use

### GameModel

- Tracks game state (turns, hints, letters, etc.)
- Processes guesses and updates game state
- Calculates scores
- Validates input

### WordService

- Fetches random words from file or fallback list
- Handles dictionary API calls for definitions
- Manages word validation

### GameView

- Updates all DOM elements
- Handles user input events
- Manages UI state changes
- Displays game results

### GameController

- Initializes and coordinates all components
- Handles user interactions
- Manages game flow
- Processes hints and game actions

## Usage

The game initializes automatically when the page loads. The main controller handles all user interactions and coordinates between the model and view.

## Benefits of This Architecture

1. **Modularity**: Each component can be developed and tested independently
2. **Reusability**: Components can be easily reused or replaced
3. **Testability**: Each class has clear interfaces and can be unit tested
4. **Maintainability**: Changes to one component don't affect others
5. **Scalability**: Easy to add new features without major refactoring

## Future Enhancements

With this architecture, you can easily add:

- Multiplayer support
- Different difficulty levels
- Statistics tracking
- Custom word categories
- Different game modes
- Improved UI components
