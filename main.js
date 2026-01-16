// Game state
let riddles = [];
let svgMap = {};
let currentRiddleIndex = 0;
let svgCache = {};

// DOM elements
const itemsGrid = document.getElementById('items-grid');
const explanationBox = document.getElementById('explanation-box');
const explanationText = document.getElementById('explanation-text');

// Initialize game
async function initGame() {
    try {
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.log('Service Worker registration failed', err));
        }
        
        // Load riddles and SVG map
        const [riddlesResponse, svgMapResponse] = await Promise.all([
            fetch('data/riddles.json'),
            fetch('data/svg-map.json')
        ]);
        
        riddles = await riddlesResponse.json();
        svgMap = await svgMapResponse.json();
        
        // Preload all SVGs
        await preloadSVGs();
        
        // Start with first riddle
        currentRiddleIndex = 0;
        loadRiddle(currentRiddleIndex);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        itemsGrid.innerHTML = '<div class="loading">שגיאה בטעינת המשחק</div>';
    }
}

// Preload SVG files
async function preloadSVGs() {
    const promises = Object.entries(svgMap).map(async ([type, path]) => {
        try {
            const response = await fetch(path);
            const svgText = await response.text();
            svgCache[type] = svgText;
        } catch (error) {
            console.error(`Error loading SVG for ${type}:`, error);
        }
    });
    
    await Promise.all(promises);
}

// Load a riddle
function loadRiddle(index) {
    if (index >= riddles.length) {
        // Shuffle and restart
        shuffleRiddles();
        index = 0;
        currentRiddleIndex = 0;
    }
    
    const riddle = riddles[index];
    
    // Clear grid and hide explanation
    itemsGrid.innerHTML = '';
    explanationBox.classList.add('hidden');
    
    // Create item buttons
    riddle.items.forEach((item, itemIndex) => {
        const button = createItemButton(item, itemIndex, riddle.correctIndex);
        itemsGrid.appendChild(button);
    });
}

// Create an item button
function createItemButton(item, itemIndex, correctIndex) {
    const button = document.createElement('button');
    button.className = 'item-button';
    button.setAttribute('aria-label', item.type);
    
    // Get SVG from cache
    const svgContent = svgCache[item.type] || '';
    button.innerHTML = svgContent;
    
    // Add click handler
    button.addEventListener('click', () => handleItemClick(itemIndex, correctIndex, button));
    
    return button;
}

// Handle item click
function handleItemClick(itemIndex, correctIndex, clickedButton) {
    const riddle = riddles[currentRiddleIndex];
    
    if (itemIndex === correctIndex) {
        // Correct answer!
        clickedButton.classList.add('correct');
        
        // Disable all buttons
        disableAllButtons();
        
        // Show success and move to next riddle after delay
        setTimeout(() => {
            currentRiddleIndex++;
            loadRiddle(currentRiddleIndex);
        }, 1000);
        
    } else {
        // Wrong answer
        clickedButton.classList.add('wrong');
        
        // Show explanation
        explanationText.textContent = riddle.explanation;
        explanationBox.classList.remove('hidden');
        
        // Remove wrong class after animation
        setTimeout(() => {
            clickedButton.classList.remove('wrong');
        }, 500);
    }
}

// Disable all buttons
function disableAllButtons() {
    const buttons = document.querySelectorAll('.item-button');
    buttons.forEach(button => {
        button.classList.add('disabled');
    });
}

// Shuffle riddles array
function shuffleRiddles() {
    for (let i = riddles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [riddles[i], riddles[j]] = [riddles[j], riddles[i]];
    }
}

// Start the game when page loads
window.addEventListener('load', initGame);

// Handle visibility change to pause/resume if needed
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Game paused');
    } else {
        console.log('Game resumed');
    }
});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });
