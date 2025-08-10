const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const closePopupButton = document.getElementById('close-popup');
const levelDisplay = document.getElementById('level-display');
const difficultySelect = document.getElementById('difficulty-select');
const activeBadge = document.getElementById('active-badge');
const computerModeBtn = document.getElementById('computer-mode-btn');
const friendsModeBtn = document.getElementById('friends-mode-btn');
const computerControls = document.getElementById('computer-controls');

let boardState;
let currentPlayer;
let gameActive;
let currentLevel = 1;
let difficulty;
let lastWinner = 'user';
let lastSecondPlayer = 'O';
let gameMode = 'computer';

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const initializeGame = (resetLevel = false) => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    if (resetLevel) {
        currentLevel = 1;
        lastWinner = 'user'; 
        lastSecondPlayer = 'O'; 
    }
    
    // Set first player based on last result and mode
    if (gameMode === 'computer') {
        if (lastWinner === 'user') {
            currentPlayer = 'X';
        } else if (lastWinner === 'ai') {
            currentPlayer = 'O';
        } else {
            if (lastSecondPlayer === 'X') {
                currentPlayer = 'X';
            } else {
                currentPlayer = 'O';
            }
        }
    } else { // Friends mode
        currentPlayer = 'X';
    }

    difficulty = difficultySelect.value;
    message.textContent = `आपकी बारी (${currentPlayer})`;
    levelDisplay.textContent = `Level: ${currentLevel}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning');
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    popup.style.display = 'none';

    if (gameMode === 'computer') {
        computerControls.classList.remove('hidden');
        if (currentPlayer === 'O') {
            message.textContent = 'AI सोच रहा है...';
            setTimeout(handleAITurn, 700);
        }
    } else { // Friends mode
        computerControls.classList.add('hidden');
    }

    updateBadge();
};

const updateBadge = () => {
    activeBadge.className = '';
    
    if (gameMode === 'friends') {
        activeBadge.style.display = 'none';
        return;
    }
    
    let badgeClass = '';
    if (currentLevel >= 5 && currentLevel < 10) {
        badgeClass = 'gold-player';
    } else if (currentLevel >= 10 && currentLevel < 15) {
        badgeClass = 'diamond-player';
    } else if (currentLevel >= 15 && currentLevel < 20) {
        badgeClass = 'heroic-player';
    } else if (currentLevel >= 20) {
        badgeClass = 'master-player';
    }

    if (badgeClass) {
        if (difficulty === 'easy') activeBadge.classList.add(`badge-${badgeClass}`);
        else if (difficulty === 'medium') activeBadge.classList.add(`badge-medium-${badgeClass.split('-')[0]}`);
        else if (difficulty === 'hard') activeBadge.classList.add(`badge-hard-${badgeClass.split('-')[0]}`);
        activeBadge.style.display = 'block';
    } else {
        activeBadge.style.display = 'none';
    }
};

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handlePlayerTurn(clickedCell, clickedCellIndex);
    checkResult();

    if (gameActive) {
        if (gameMode === 'computer') {
            message.textContent = 'AI सोच रहा है...';
            setTimeout(handleAITurn, 700);
        } else { // Friends mode
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `आपकी बारी (${currentPlayer})`;
        }
    }
};

const handlePlayerTurn = (cell, index) => {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.removeEventListener('click', handleCellClick);
};

const checkResult = () => {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        winningCells.forEach(index => { cells[index].classList.add('winning'); });
        
        let stars = 0;
        let resultText = '';
        if (currentPlayer === 'X') {
            resultText = 'बधाई हो, आप जीत गए! 🎉';
            stars = 5; 
            if (gameMode === 'computer') {
                currentLevel++;
                updateBadge();
                lastWinner = 'user';
            }
        } else {
            resultText = 'बधाई हो, AI जीत गया! अगली बार कोशिश करें।';
            if (gameMode === 'friends') {
                resultText = 'बधाई हो, O जीत गया! 🎉';
            }
            stars = 0;
            if (gameMode === 'computer') {
                lastWinner = 'ai';
            }
        }
        showPopup(resultText, stars);
        return;
    }

    let roundDraw = !boardState.includes('');
    if (roundDraw) {
        gameActive = false;
        const resultText = 'यह एक ड्रॉ है! 🤝';
        showPopup(resultText, 1);
        if (gameMode === 'computer') {
            lastWinner = 'draw';
            lastSecondPlayer = currentPlayer;
        }
        return;
    }
    
    if (gameMode === 'computer') {
        lastSecondPlayer = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

const showPopup = (text, stars) => {
    popupText.textContent = text;
    // starsContainer.innerHTML = '⭐'.repeat(stars); 
    
    popupText.classList.remove('win-text', 'lose-text', 'draw-text');
    if (text.includes('बधाई हो')) {
        popupText.classList.add('win-text');
        closePopupButton.textContent = 'Next Level';
    } else if (text.includes('जीत गया!')) {
        popupText.classList.add('lose-text');
        closePopupButton.textContent = 'Play Again';
    } else {
        popupText.classList.add('draw-text');
        closePopupButton.textContent = 'Play Again';
    }

    popup.style.display = 'flex';
};

const handleAITurn = () => {
    let playSmart;

    if (difficulty === 'hard') {
        playSmart = true;
    } else if (difficulty === 'medium') {
        playSmart = Math.random() < 0.95;
    } else {
        playSmart = Math.random() < 0.70;
    }

    let bestMove = null;
    if (playSmart) {
        bestMove = getBestMove(boardState, 'O');
    } else {
        const availableMoves = boardState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    if (bestMove !== undefined && bestMove !== null) {
        handlePlayerTurn(cells[bestMove], bestMove);
        checkResult();
    }
};

const getBestMove = (board, player) => {
    for (const winCondition of winConditions) {
        const [a, b, c] = winCondition;
        const tempBoard = [...board];
        if (tempBoard[a] === player && tempBoard[b] === player && tempBoard[c] === '') return c;
        if (tempBoard[a] === player && tempBoard[c] === player && tempBoard[b] === '') return b;
        if (tempBoard[b] === player && tempBoard[c] === player && tempBoard[a] === '') return a;
    }
    
    const opponent = player === 'O' ? 'X' : 'O';
    for (const winCondition of winConditions) {
        const [a, b, c] = winCondition;
        const tempBoard = [...board];
        if (tempBoard[a] === opponent && tempBoard[b] === opponent && tempBoard[c] === '') return c;
        if (tempBoard[a] === opponent && tempBoard[c] === opponent && tempBoard[b] === '') return b;
        if (tempBoard[b] === opponent && tempBoard[c] === opponent && tempBoard[a] === '') return a;
    }
    
    const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        let tempBoard = [...board];
        tempBoard[move] = player;
        let score = minimax(tempBoard, 0, false);
        tempBoard[move] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
};

const minimax = (board, depth, isMaximizing) => {
    let winner = checkWinner(board);
    if (winner !== null) {
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWinner = (board) => {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes('')) return 'draw';
    return null;
};

// Event Listeners for new mode buttons
computerModeBtn.addEventListener('click', () => {
    gameMode = 'computer';
    computerModeBtn.classList.add('active');
    friendsModeBtn.classList.remove('active');
    initializeGame(true);
});

friendsModeBtn.addEventListener('click', () => {
    gameMode = 'friends';
    friendsModeBtn.classList.add('active');
    computerModeBtn.classList.remove('active');
    initializeGame(true);
});

restartButton.addEventListener('click', () => initializeGame(false));
closePopupButton.addEventListener('click', () => {
    initializeGame(false);
});
difficultySelect.addEventListener('change', () => initializeGame(true));

initializeGame(true);
