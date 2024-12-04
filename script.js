const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };
  return { getBoard, updateCell, resetBoard };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameActive = true;

  const initializeGame = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    Gameboard.resetBoard();
    gameActive = true;
  };

  const playTurn = (index) => {
    if (!gameActive) {
      console.log("Game is over. Restart to play again.");
      return;
    }

    if (Gameboard.updateCell(index, players[currentPlayerIndex].marker)) {
      if (checkWinner(players[currentPlayerIndex].marker)) {
        console.log(`${players[currentPlayerIndex].name} wins!`);
        gameActive = false;
        return;
      }

      if (isTie()) {
        console.log("It's a tie!");
        gameActive = false;
        return;
      }

      currentPlayerIndex = 1 - currentPlayerIndex; // Switch players
    } else {
      console.log("Cell is already taken. Try again.");
    }
  };

  const checkWinner = (marker) => {
    const board = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some((pattern) =>
      pattern.every((index) => board[index] === marker)
    );
  };

  const isTie = () => {
    const board = Gameboard.getBoard();
    return board.every((cell) => cell !== "");
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const isGameOver = () => !gameActive;

  const restartGame = () => {
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
    gameActive = true;
    console.log("Game restarted.");
  };

  return { initializeGame, playTurn, restartGame, getCurrentPlayer, isGameOver };
})();

const DisplayController = (() => {
  const boardContainer = document.getElementById("gameboard");
  const messageDisplay = document.getElementById("message");

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    boardContainer.innerHTML = ""; // clear the board
    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      cellElement.dataset.index = index;
      boardContainer.appendChild(cellElement);
    });
  };

  const setMessage = (message) => {
    messageDisplay.textContent = message;
  };

  const bindCellClick = (callback) => {
    boardContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (target.classList.contains("cell")) {
        const index = target.dataset.index;
        callback(parseInt(index, 10));
      }
    });
  };
  return { renderBoard, setMessage, bindCellClick };
})();

// Initialize the game and bind events
GameController.initializeGame("Player 1", "Player 2");
DisplayController.renderBoard();
DisplayController.setMessage("Player 1's turn");

// Bind cell click event
DisplayController.bindCellClick((index) => {
  GameController.playTurn(index);
  DisplayController.renderBoard();

  if (GameController.isGameOver) {
    DisplayController.setMessage("Game Over!");
  } else {
    const currentPlayer = GameController.getCurrentPlayer();
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);
  }
});

// Restart
document.getElementById("restart").addEventListener("click", () => {
  GameController.restartGame();
  DisplayController.renderBoard();
  DisplayController.setMessage("Player 1's turn");
});
