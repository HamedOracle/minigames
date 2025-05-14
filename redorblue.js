document.addEventListener('DOMContentLoaded', function() {
    // Game data for different categories
    const gameData = {
        'foods': [
            { name: 'Pizza', image: 'https://via.placeholder.com/400x300?text=Pizza' },
            { name: 'Burger', image: 'https://via.placeholder.com/400x300?text=Burger' },
            { name: 'Sushi', image: 'https://via.placeholder.com/400x300?text=Sushi' },
            { name: 'Pasta', image: 'https://via.placeholder.com/400x300?text=Pasta' },
            { name: 'Salad', image: 'https://via.placeholder.com/400x300?text=Salad' },
            { name: 'Steak', image: 'https://via.placeholder.com/400x300?text=Steak' },
            { name: 'Tacos', image: 'https://via.placeholder.com/400x300?text=Tacos' },
            { name: 'Ice Cream', image: 'https://via.placeholder.com/400x300?text=Ice+Cream' }
        ],
        'games': [
            { name: 'Mario', image: 'https://via.placeholder.com/400x300?text=Mario' },
            { name: 'Zelda', image: 'https://via.placeholder.com/400x300?text=Zelda' },
            { name: 'Fortnite', image: 'https://via.placeholder.com/400x300?text=Fortnite' },
            { name: 'Minecraft', image: 'https://via.placeholder.com/400x300?text=Minecraft' },
            { name: 'Call of Duty', image: 'https://via.placeholder.com/400x300?text=Call+of+Duty' },
            { name: 'Among Us', image: 'https://via.placeholder.com/400x300?text=Among+Us' },
            { name: 'Pokémon', image: 'https://via.placeholder.com/400x300?text=Pokémon' },
            { name: 'GTA', image: 'https://via.placeholder.com/400x300?text=GTA' }
        ],
        'animals': [
            { name: 'Lion', image: 'https://via.placeholder.com/400x300?text=Lion' },
            { name: 'Tiger', image: 'https://via.placeholder.com/400x300?text=Tiger' },
            { name: 'Bear', image: 'https://via.placeholder.com/400x300?text=Bear' },
            { name: 'Elephant', image: 'https://via.placeholder.com/400x300?text=Elephant' },
            { name: 'Dolphin', image: 'https://via.placeholder.com/400x300?text=Dolphin' },
            { name: 'Eagle', image: 'https://via.placeholder.com/400x300?text=Eagle' },
            { name: 'Wolf', image: 'https://via.placeholder.com/400x300?text=Wolf' },
            { name: 'Panda', image: 'https://via.placeholder.com/400x300?text=Panda' }
        ]
    };

    // DOM elements
    const categorySelect = document.querySelector('.category-select');
    const gameScreen = document.querySelector('.game-screen');
    const resultsScreen = document.querySelector('.results-screen');
    const redImage = document.getElementById('red-image');
    const blueImage = document.getElementById('blue-image');
    const redBtn = document.getElementById('red-btn');
    const blueBtn = document.getElementById('blue-btn');
    const currentCount = document.getElementById('current-count');
    const totalCount = document.getElementById('total-count');
    const resultsStats = document.getElementById('results-stats');
    const playAgainBtn = document.getElementById('play-again-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Game state
    let currentCategory = null;
    let currentItems = [];
    let currentPairs = [];
    let currentIndex = 0;
    let redCount = 0;
    let blueCount = 0;

    // Event listeners for category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.dataset.category;
            startGame(currentCategory);
        });
    });

    // Event listeners for choice buttons
    redBtn.addEventListener('click', function() {
        redCount++;
        nextPair();
    });

    blueBtn.addEventListener('click', function() {
        blueCount++;
        nextPair();
    });

    // Play again button
    playAgainBtn.addEventListener('click', function() {
        resetGame();
    });

    // Start the game with selected category
    function startGame(category) {
        currentItems = [...gameData[category]];
        currentIndex = 0;
        redCount = 0;
        blueCount = 0;
        
        // Shuffle the array
        currentItems = shuffleArray(currentItems);
        
        // Create pairs
        currentPairs = createPairs(currentItems);
        
        // Update UI
        categorySelect.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        totalCount.textContent = currentPairs.length;
        
        // Show first pair
        showCurrentPair();
    }

    // Create pairs of items
    function createPairs(items) {
        const pairs = [];
        const shuffled = [...items];
        
        // Make sure we have an even number of items
        if (shuffled.length % 2 !== 0) {
            shuffled.pop();
        }
        
        // Create pairs
        for (let i = 0; i < shuffled.length; i += 2) {
            pairs.push({
                red: shuffled[i],
                blue: shuffled[i + 1]
            });
        }
        
        return pairs;
    }

    // Show current pair
    function showCurrentPair() {
        const pair = currentPairs[currentIndex];
        redImage.src = pair.red.image;
        redImage.alt = pair.red.name;
        blueImage.src = pair.blue.image;
        blueImage.alt = pair.blue.name;
        currentCount.textContent = currentIndex + 1;
    }

    // Move to next pair or end game
    function nextPair() {
        currentIndex++;
        
        if (currentIndex < currentPairs.length) {
            showCurrentPair();
        } else {
            endGame();
        }
    }

    // End the game and show results
    function endGame() {
        gameScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        const total = redCount + blueCount;
        const redPercentage = Math.round((redCount / total) * 100);
        const bluePercentage = Math.round((blueCount / total) * 100);
        
        resultsStats.innerHTML = `
            <p>Total choices: ${total}</p>
            <p>Red choices: ${redCount} (${redPercentage}%)</p>
            <p>Blue choices: ${blueCount} (${bluePercentage}%)</p>
        `;
    }

    // Reset the game to initial state
    function resetGame() {
        resultsScreen.classList.add('hidden');
        categorySelect.classList.remove('hidden');
    }

    // Helper function to shuffle array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});