document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const wordleGrid = document.getElementById('wordle-grid');
    const scoreDisplay = document.getElementById('score');
    const streakDisplay = document.getElementById('streak');
    const messageDisplay = document.getElementById('message');
    const gameOverScreen = document.getElementById('game-over');
    const targetWordDisplay = document.getElementById('target-word');
    const playAgainBtn = document.getElementById('play-again-btn');
    const enterBtn = document.getElementById('enter-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const keys = document.querySelectorAll('.key[data-key]');
    
    // Game state
    let targetWord = '';
    let currentRow = 0;
    let currentTile = 0;
    let gameOver = false;
    let score = 0;
    let streak = 0;
    
    // Word list (5-letter words)
    const wordList = [
        'APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE',
        'FLAME', 'GHOST', 'HONEY', 'IGLOO', 'JELLY',
        'KOALA', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN',
        'PIANO', 'QUEEN', 'RIVER', 'SUNNY', 'TIGER',
        'UMBRA', 'VIOLA', 'WATER', 'XENON', 'YACHT',
        'ZEBRA', 'ALPHA', 'BRAVO', 'CANDY', 'DELTA',
        'EARTH', 'FRUIT', 'GRAPE', 'HOTEL', 'INBOX',
        'JUICE', 'KARMA', 'LIGHT', 'MAGIC', 'NOVEL',
        'OLIVE', 'PEACH', 'QUILT', 'ROBOT', 'SALAD',
        'TULIP', 'UNITY', 'VITAL', 'WHEAT', 'YOUTH'
    ];
    
    // Initialize the game
    function initGame() {
        // Reset game state
        currentRow = 0;
        currentTile = 0;
        gameOver = false;
        
        // Select a random target word
        targetWord = wordList[Math.floor(Math.random() * wordList.length)];
        
        // Clear the grid
        wordleGrid.innerHTML = '';
        
        // Create the grid
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                row.appendChild(tile);
            }
            
            wordleGrid.appendChild(row);
        }
        
        // Hide game over screen and message
        gameOverScreen.classList.add('hidden');
        messageDisplay.classList.add('hidden');
        
        // Reset keyboard colors
        keys.forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
        
        // Update score displays
        updateScoreDisplays();
    }
    
    // Update score displays
    function updateScoreDisplays() {
        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
    }
    
    // Handle key press
    function handleKeyPress(key) {
        if (gameOver) return;
        
        const rows = document.querySelectorAll('.wordle-row');
        const currentRowTiles = rows[currentRow].querySelectorAll('.wordle-tile');
        
        if (/^[A-Z]$/.test(key)) {
            // Letter key
            if (currentTile < 5) {
                currentRowTiles[currentTile].textContent = key;
                currentRowTiles[currentTile].classList.add('filled');
                currentTile++;
            }
        } else if (key === 'BACKSPACE' || key === 'DEL') {
            // Delete key
            if (currentTile > 0) {
                currentTile--;
                currentRowTiles[currentTile].textContent = '';
                currentRowTiles[currentTile].classList.remove('filled');
            }
        } else if (key === 'ENTER') {
            // Enter key
            if (currentTile === 5) {
                checkWord();
            } else {
                showMessage('Not enough letters');
            }
        }
    }
    
    // Check the current word
    function checkWord() {
        const rows = document.querySelectorAll('.wordle-row');
        const currentRowTiles = rows[currentRow].querySelectorAll('.wordle-tile');
        
        // Get the guessed word
        let guessedWord = '';
        currentRowTiles.forEach(tile => {
            guessedWord += tile.textContent;
        });
        
        // Check if the word is valid
        if (!wordList.includes(guessedWord)) {
            showMessage('Not in word list');
            return;
        }
        
        // Check each letter
        const targetLetters = targetWord.split('');
        const guessedLetters = guessedWord.split('');
        const result = [];
        
        // First pass: find correct letters
        for (let i = 0; i < 5; i++) {
            if (guessedLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null; // Mark as used
            } else {
                result[i] = null;
            }
        }
        
        // Second pass: find present letters
        for (let i = 0; i < 5; i++) {
            if (result[i] === null) {
                const index = targetLetters.indexOf(guessedLetters[i]);
                if (index !== -1) {
                    result[i] = 'present';
                    targetLetters[index] = null; // Mark as used
                } else {
                    result[i] = 'absent';
                }
            }
        }
        
        // Update tile colors
        for (let i = 0; i < 5; i++) {
            currentRowTiles[i].classList.add(result[i]);
        }
        
        // Update keyboard colors
        for (let i = 0; i < 5; i++) {
            const key = document.querySelector(`.key[data-key="${guessedLetters[i]}"]`);
            if (key) {
                // Don't override correct keys with present/absent
                if (!key.classList.contains('correct')) {
                    if (result[i] === 'present' && !key.classList.contains('present')) {
                        key.classList.add('present');
                    } else if (result[i] === 'absent' && !key.classList.contains('present') && !key.classList.contains('correct')) {
                        key.classList.add('absent');
                    }
                }
            }
        }
        
        // Check if the word is correct
        if (guessedWord === targetWord) {
            gameWon();
            return;
        }
        
        // Move to next row
        currentRow++;
        currentTile = 0;
        
        // Check if game over
        if (currentRow === 6) {
            gameLost();
        }
    }
    
    // Game won
    function gameWon() {
        gameOver = true;
        score += 10;
        streak++;
        updateScoreDisplays();
        showMessage('You won!', true);
        setTimeout(() => {
            initGame();
        }, 2000);
    }
    
    // Game lost
    function gameLost() {
        gameOver = true;
        streak = 0;
        updateScoreDisplays();
        targetWordDisplay.textContent = targetWord;
        gameOverScreen.classList.remove('hidden');
    }
    
    // Show message
    function showMessage(text, isSuccess = false) {
        messageDisplay.textContent = text;
        messageDisplay.style.color = isSuccess ? '#4CAF50' : '#FFC107';
        messageDisplay.classList.remove('hidden');
        setTimeout(() => {
            messageDisplay.classList.add('hidden');
        }, 2000);
    }
    
    // Event listeners
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleKeyPress('ENTER');
        } else if (e.key === 'Backspace') {
            handleKeyPress('BACKSPACE');
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            handleKeyPress(e.key.toUpperCase());
        }
    });
    
    keys.forEach(key => {
        key.addEventListener('click', function() {
            handleKeyPress(this.dataset.key);
        });
    });
    
    enterBtn.addEventListener('click', function() {
        handleKeyPress('ENTER');
    });
    
    deleteBtn.addEventListener('click', function() {
        handleKeyPress('BACKSPACE');
    });
    
    playAgainBtn.addEventListener('click', function() {
        initGame();
    });
    
    // Start the game
    initGame();
});
