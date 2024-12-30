const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍', '🍓', '🍊', '🍑', '🍋', '🍍', '🍒', '🍌', '🍎', '🍉', '🍇', '🍑', '🍓', '🍋', '🍊', '🍈', '🥥', '🥝', '🍒']; // Array of emoji values
let gameCards = [];
let flippedCards = [];
let moveCount = 0;
let gameStarted = false;
let timer;
let seconds = 0;
let isMultiplayer = false;
let currentPlayer = 1;
let player1Moves = 0;
let player2Moves = 0;
let bgMusic = document.getElementById('bg-music');
let flipSound = document.getElementById('flip-sound');
let winSound = document.getElementById('win-sound');
let lossSound = document.getElementById('loss-sound');
let wrongSound = document.getElementById('wrong-sound');
let matchSound = document.getElementById('match-sound');

// Game Mode Selection
document.getElementById('easy').addEventListener('click', () => startGame('easy'));
document.getElementById('hard').addEventListener('click', () => startGame('hard'));
document.getElementById('extreme').addEventListener('click', () => startGame('extreme'));
document.getElementById('timer').addEventListener('click', () => startGame('timer'));
document.getElementById('multiplayer').addEventListener('click', () => startGame('multiplayer'));

// Play Again Button
document.getElementById('play-again').addEventListener('click', () => {
    document.getElementById('play-again').style.display = 'none';
    startGame('hard'); // Resetting to 'hard' mode for simplicity
});

// Start Game Logic
function startGame(mode) {
    resetGame();
    gameStarted = true;

    // Set up game cards based on mode
    if (mode === 'easy') {
        gameCards = emojis.slice(0, 4);
    } else if (mode === 'hard') {
        gameCards = emojis.slice(0, 6);
    } else if (mode === 'extreme') {
        gameCards = emojis.slice(0, 12);
    } else if (mode === 'timer') {
        gameCards = emojis.slice(0, 6); // Hard difficulty with timer mode
        startTimer();
    } else if (mode === 'multiplayer') {
        isMultiplayer = true;
        gameCards = emojis.slice(0, 6);
    }

    gameCards = shuffleArray(gameCards.concat(gameCards)); // Shuffle the cards
    createCards(); // Generate cards
    document.getElementById('play-again').style.display = 'none';
    document.getElementById('play-music').style.display = 'block';
    moveCount = 0;
    document.getElementById('move-count').textContent = moveCount;
    document.getElementById('timer-display').textContent = "00:00";
    seconds = 0;
}

// Reset Game State
function resetGame() {
    flippedCards = [];
    moveCount = 0;
    isMultiplayer = false;
    currentPlayer = 1;
    player1Moves = 0;
    player2Moves = 0;
    clearInterval(timer);
    document.getElementById('timer-display').textContent = "00:00";
    document.querySelector('.grid-container').innerHTML = ''; // Clear existing cards
}

// Shuffle function
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create cards
function createCards() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // Clear previous cards

    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${emoji}</div>
        `;
        card.addEventListener('click', flipCard);
        gridContainer.appendChild(card);
    });
}

// Flip card logic
function flipCard() {
    const card = this;

    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        flipSound.play();
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moveCount++;
            document.getElementById('move-count').textContent = moveCount;
            checkMatch();
        }
    }
}

// Check for match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        matchSound.play();
        flippedCards = [];
        checkWin();
    } else {
        wrongSound.play();
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Check if the game is won
function checkWin() {
    const totalCards = gameCards.length * 2;
    const flippedCardsCount = document.querySelectorAll('.card.flipped').length;
    if (flippedCardsCount === totalCards) {
        if (isMultiplayer) {
            alert(`Player ${currentPlayer} wins!`);
            switchPlayer();
        } else {
            winSound.play();
            alert('You win!');
        }
        document.getElementById('play-again').style.display = 'block';
    }
}

// Switch between multiplayer players
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Timer Logic for Timer Mode
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let displaySeconds = seconds % 60;
        if (displaySeconds < 10) {
            displaySeconds = '0' + displaySeconds;
        }
        document.getElementById('timer-display').textContent = `${minutes}:${displaySeconds}`;
        if (seconds === 300) { // 5-minute limit
            clearInterval(timer);
            lossSound.play();
            alert('Time is up! You lose!');
            document.getElementById('play-again').style.display = 'block';
        }
    }, 1000);
}
