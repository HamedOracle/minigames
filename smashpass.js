document.addEventListener('DOMContentLoaded', function() {
    // Game data for different categories
    const gameData = {
        'celebrities': [
            { name: 'Celebrity 1', image: 'https://via.placeholder.com/400x600?text=Celebrity+1' },
            { name: 'Celebrity 2', image: 'https://via.placeholder.com/400x600?text=Celebrity+2' },
            { name: 'Celebrity 3', image: 'https://via.placeholder.com/400x600?text=Celebrity+3' },
            { name: 'Celebrity 4', image: 'https://via.placeholder.com/400x600?text=Celebrity+4' },
            { name: 'Celebrity 5', image: 'https://via.placeholder.com/400x600?text=Celebrity+5' }
        ],
        'game-characters': [
            { name: 'Game Character 1', image: 'https://via.placeholder.com/400x600?text=Game+Character+1' },
            { name: 'Game Character 2', image: 'https://via.placeholder.com/400x600?text=Game+Character+2' },
            { name: 'Game Character 3', image: 'https://via.placeholder.com/400x600?text=Game+Character+3' },
            { name: 'Game Character 4', image: 'https://via.placeholder.com/400x600?text=Game+Character+4' },
            { name: 'Game Character 5', image: 'https://via.placeholder.com/400x600?text=Game+Character+5' }
        ],
        'anime': [
            { name: 'Anime Character 1', image: 'https://via.placeholder.com/400x600?text=Anime+Character+1' },
            { name: 'Anime Character 2', image: 'https://via.placeholder.com/400x600?text=Anime+Character+2' },
            { name: 'Anime Character 3', image: 'https://via.placeholder.com/400x600?text=Anime+Character+3' },
            { name: 'Anime Character 4', image: 'https://via.placeholder.com/400x600?text=Anime+Character+4' },
            { name: 'Anime Character 5', image: 'https://via.placeholder.com/400x600?text=Anime+Character+5' }
        ]
    };

    // DOM elements
    const categorySelect = document.querySelector('.category-select');
    const gameScreen = document.querySelector('.game-screen');
    const resultsScreen = document.querySelector('.results-screen');
    const currentImage = document.getElementById('current-image');
    const smashBtn = document.getElementById('smash-btn');
    const passBtn = document.getElementById('pass-btn');
    const currentCount = document.getElementById('current-count');
    const totalCount = document.getElementById('total-count');
    const resultsStats = document.getElementById('results-stats');
    const playAgainBtn = document.getElementById('play-again-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Game state
    let currentCategory = null;
    let currentItems = [];
    let currentIndex = 0;
    let smashCount = 0;
    let passCount = 0;

    // Event listeners for category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.dataset.category;
            startGame(currentCategory);
        });
    });

    // Event listeners for game buttons
    smashBtn.addEventListener('click', function() {
        smashCount++;
        nextItem();
    });

    passBtn.addEventListener('click', function() {
        passCount++;
        nextItem();
    });

    // Play again button
    playAgainBtn.addEventListener('click', function() {
        resetGame();
    });

    // Start the game with selected category
    function startGame(category) {
        currentItems = [...gameData[category]];
        currentIndex = 0;
        smashCount = 0;
        passCount = 0;
        
        // Shuffle the array
        currentItems = shuffleArray(currentItems);
        
        // Update UI
        categorySelect.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        totalCount.textContent = currentItems.length;
        
        // Show first item
        showCurrentItem();
    }

    // Show current item
    function showCurrentItem() {
        currentImage.src = currentItems[currentIndex].image;
        currentImage.alt = currentItems[currentIndex].name;
        currentCount.textContent = currentIndex + 1;
    }

    // Move to next item or end game
    function nextItem() {
        currentIndex++;
        
        if (currentIndex < currentItems.length) {
            showCurrentItem();
        } else {
            endGame();
        }
    }

    // End the game and show results
    function endGame() {
        gameScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        const total = smashCount + passCount;
        const smashPercentage = Math.round((smashCount / total) * 100);
        const passPercentage = Math.round((passCount / total) * 100);
        
        resultsStats.innerHTML = `
            <p>Total items: ${total}</p>
            <p>Smash: ${smashCount} (${smashPercentage}%)</p>
            <p>Pass: ${passCount} (${passPercentage}%)</p>
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