document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const gemsDisplay = document.getElementById('gems');
    const gemsPerSecondDisplay = document.getElementById('gems-per-second');
    const clickArea = document.getElementById('click-area');
    const clickEffect = document.getElementById('click-effect');
    const gemImage = document.getElementById('gem-image');
    
    // Click power upgrade elements
    const currentClickPowerDisplay = document.getElementById('current-click-power');
    const nextClickPowerDisplay = document.getElementById('next-click-power');
    const clickPowerCostDisplay = document.getElementById('click-power-cost');
    const clickPowerBtn = document.getElementById('click-power-btn');
    
    // Auto clicker upgrade elements
    const currentAutoClickerDisplay = document.getElementById('current-auto-clicker');
    const nextAutoClickerDisplay = document.getElementById('next-auto-clicker');
    const autoClickerCostDisplay = document.getElementById('auto-clicker-cost');
    const autoClickerBtn = document.getElementById('auto-clicker-btn');

    // Game state
    let gems = 0;
    let gemsPerSecond = 0;
    let clickPower = 1;
    
    // Upgrade costs and levels
    const clickPowerUpgrades = [
        { power: 2, cost: 20 },
        { power: 5, cost: 50 },
        { power: 10, cost: 100 },
        { power: 20, cost: 200 },
        { power: 50, cost: 500 }
    ];
    let clickPowerLevel = 0;
    
    const autoClickerUpgrades = [
        { power: 1, cost: 1000 },
        { power: 2, cost: 2000 },
        { power: 5, cost: 5000 },
        { power: 10, cost: 10000 },
        { power: 20, cost: 20000 }
    ];
    let autoClickerLevel = 0;

    // Initialize the game
    function init() {
        // Load saved game if available
        const savedGame = localStorage.getItem('gemClickerSave');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            gems = gameState.gems || 0;
            gemsPerSecond = gameState.gemsPerSecond || 0;
            clickPower = gameState.clickPower || 1;
            clickPowerLevel = gameState.clickPowerLevel || 0;
            autoClickerLevel = gameState.autoClickerLevel || 0;
        }
        
        updateDisplays();
        startAutoClicker();
        
        // Set up event listeners
        clickArea.addEventListener('click', handleClick);
        clickPowerBtn.addEventListener('click', upgradeClickPower);
        autoClickerBtn.addEventListener('click', upgradeAutoClicker);
    }

    // Handle click on the gem
    function handleClick(e) {
        // Get click position
        const rect = clickArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Position the click effect
        clickEffect.style.left = `${x - 15}px`;
        clickEffect.style.top = `${y - 15}px`;
        clickEffect.textContent = `+${clickPower}`;
        
        // Show and animate the effect
        clickEffect.classList.remove('hidden');
        setTimeout(() => {
            clickEffect.classList.add('hidden');
        }, 1000);
        
        // Add gems
        addGems(clickPower);
        
        // Add a little "pop" effect to the gem
        gemImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            gemImage.style.transform = 'scale(1)';
        }, 100);
    }

    // Add gems to the total
    function addGems(amount) {
        gems += amount;
        updateDisplays();
        saveGame();
    }

    // Start the auto clicker interval
    function startAutoClicker() {
        setInterval(() => {
            if (gemsPerSecond > 0) {
                addGems(gemsPerSecond / 10);
            }
        }, 100);
    }

    // Upgrade click power
    function upgradeClickPower() {
        if (clickPowerLevel < clickPowerUpgrades.length) {
            const upgrade = clickPowerUpgrades[clickPowerLevel];
            
            if (gems >= upgrade.cost) {
                gems -= upgrade.cost;
                clickPower = upgrade.power;
                clickPowerLevel++;
                updateDisplays();
                saveGame();
            }
        }
    }

    // Upgrade auto clicker
    function upgradeAutoClicker() {
        if (autoClickerLevel < autoClickerUpgrades.length) {
            const upgrade = autoClickerUpgrades[autoClickerLevel];
            
            if (gems >= upgrade.cost) {
                gems -= upgrade.cost;
                gemsPerSecond += upgrade.power;
                autoClickerLevel++;
                updateDisplays();
                saveGame();
            }
        }
    }

    // Update all displays
    function updateDisplays() {
        gemsDisplay.textContent = Math.floor(gems);
        gemsPerSecondDisplay.textContent = gemsPerSecond.toFixed(1);
        
        // Update click power upgrade display
        if (clickPowerLevel < clickPowerUpgrades.length) {
            const nextUpgrade = clickPowerUpgrades[clickPowerLevel];
            currentClickPowerDisplay.textContent = clickPower;
            nextClickPowerDisplay.textContent = nextUpgrade.power;
            clickPowerCostDisplay.textContent = nextUpgrade.cost;
            clickPowerBtn.disabled = gems < nextUpgrade.cost;
        } else {
            currentClickPowerDisplay.textContent = clickPower;
            nextClickPowerDisplay.textContent = "MAX";
            clickPowerCostDisplay.textContent = "MAX";
            clickPowerBtn.disabled = true;
            clickPowerBtn.textContent = "MAX LEVEL";
        }
        
        // Update auto clicker upgrade display
        if (autoClickerLevel < autoClickerUpgrades.length) {
            const nextUpgrade = autoClickerUpgrades[autoClickerLevel];
            currentAutoClickerDisplay.textContent = gemsPerSecond;
            nextAutoClickerDisplay.textContent = (gemsPerSecond + nextUpgrade.power).toFixed(1);
            autoClickerCostDisplay.textContent = nextUpgrade.cost;
            autoClickerBtn.disabled = gems < nextUpgrade.cost;
        } else {
            currentAutoClickerDisplay.textContent = gemsPerSecond.toFixed(1);
            nextAutoClickerDisplay.textContent = "MAX";
            autoClickerCostDisplay.textContent = "MAX";
            autoClickerBtn.disabled = true;
            autoClickerBtn.textContent = "MAX LEVEL";
        }
    }

    // Save game state to localStorage
    function saveGame() {
        const gameState = {
            gems,
            gemsPerSecond,
            clickPower,
            clickPowerLevel,
            autoClickerLevel
        };
        localStorage.setItem('gemClickerSave', JSON.stringify(gameState));
    }

    // Initialize the game
    init();
});