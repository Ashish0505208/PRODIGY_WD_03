let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let isComputer = false;
let difficulty = "easy";

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function showDifficultySelection() {
    resetGame();
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("difficulty-screen").classList.remove("hidden");
}

function startGame(vsComputer, level = "easy") {
    resetGame();
    isComputer = vsComputer;
    difficulty = level;
    gameActive = true;

    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("difficulty-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    if (isComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function goBack() {
    resetGame();
    
    if (!document.getElementById("game-screen").classList.contains("hidden")) {
        if (isComputer) {
            document.getElementById("difficulty-screen").classList.remove("hidden");
        } else {
            document.getElementById("welcome-screen").classList.remove("hidden");
        }
        document.getElementById("game-screen").classList.add("hidden");
    } else if (!document.getElementById("difficulty-screen").classList.contains("hidden")) {
        document.getElementById("difficulty-screen").classList.add("hidden");
        document.getElementById("welcome-screen").classList.remove("hidden");
    }
}


function makeMove(index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        document.getElementsByClassName("cell")[index].innerText = currentPlayer;
        checkWinner();

        if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            if (isComputer && currentPlayer === "O") {
                setTimeout(computerMove, 500);
            }
        }
    }
}

function computerMove() {
    if (!gameActive) return;

    let move;
    let availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter(v => v !== null);

    if (difficulty === "easy") {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === "medium") {
        move = bestMoveForMedium() || availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        move = bestMove();
    }

    makeMove(move);
}

function bestMoveForMedium() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        let values = [board[a], board[b], board[c]];

        if (values.filter(v => v === "X").length === 2 && values.includes("")) {
            return combo[values.indexOf("")];
        }
    }
    return null;
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerForAI();
    if (result !== null) {
        return result === "O" ? 10 - depth : result === "X" ? depth - 10 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForAI() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes("") ? null : "draw";
}

function checkWinner() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            document.getElementById("status").innerText = `${board[a]} Wins!`;
            return;
        }
    }
    if (!board.includes("")) {
        gameActive = false;
        document.getElementById("status").innerText = "It's a Draw!";
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.innerText = "";
    }

    document.getElementById("status").innerText = "";
}