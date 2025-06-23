import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const MinesweeperGame = () => {
  const [difficulty, setDifficulty] = useState("beginner");
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState("playing"); // playing, won, lost
  const [mineCount, setMineCount] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // Calculate cell size based on screen dimensions
  const calculateCellSize = () => {
    const availableWidth = screenWidth - 40; // padding
    const availableHeight = screenHeight - 200; // header and controls
    const cellWidth = Math.floor(availableWidth / cols);
    const cellHeight = Math.floor(availableHeight / rows);
    return Math.min(cellWidth, cellHeight, 40);
  };

  const cellSize = calculateCellSize();

  const createEmptyBoard = useCallback(() => {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );
  }, [rows, cols]);

  const placeMines = (board, firstClickRow, firstClickCol) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      // Don't place mine on first click or if already has mine
      if (
        !newBoard[row][col].isMine &&
        !(row === firstClickRow && col === firstClickCol)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                newBoard[nr][nc].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    return newBoard;
  };

  const initializeGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setGameState("playing");
    setMineCount(mines);
    setFlagCount(0);
    setFirstClick(true);
  }, [createEmptyBoard, mines]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const revealCell = (row, col) => {
    if (
      gameState !== "playing" ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return;
    }

    let newBoard = [...board];

    // Handle first click
    if (firstClick) {
      newBoard = placeMines(newBoard, row, col);
      setFirstClick(false);
    }

    const revealRecursive = (r, c) => {
      if (
        r < 0 ||
        r >= rows ||
        c < 0 ||
        c >= cols ||
        newBoard[r][c].isRevealed
      ) {
        return;
      }

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].isMine) {
        setGameState("lost");
        // Reveal all mines
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (newBoard[i][j].isMine) {
              newBoard[i][j].isRevealed = true;
            }
          }
        }
        return;
      }

      // If cell has no neighboring mines, reveal neighbors
      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealRecursive(r + dr, c + dc);
          }
        }
      }
    };

    revealRecursive(row, col);
    setBoard(newBoard);

    // Check win condition
    const revealedCount = newBoard
      .flat()
      .filter((cell) => cell.isRevealed).length;
    if (revealedCount === rows * cols - mines) {
      setGameState("won");
    }
  };

  const toggleFlag = (row, col) => {
    if (gameState !== "playing" || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    const newFlagCount = newBoard
      .flat()
      .filter((cell) => cell.isFlagged).length;
    setFlagCount(newFlagCount);
    setBoard(newBoard);
  };

  const handleCellPress = (row, col) => {
    revealCell(row, col);
  };

  const handleCellLongPress = (row, col) => {
    toggleFlag(row, col);
  };

  const getCellContent = (cell) => {
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.neighborMines === 0) return "";
    return cell.neighborMines.toString();
  };

  const getCellStyle = (cell) => {
    const baseStyle = [styles.cell, { width: cellSize, height: cellSize }];

    if (cell.isRevealed) {
      if (cell.isMine) {
        baseStyle.push(styles.mine);
      } else {
        baseStyle.push(styles.revealed);
      }
    } else {
      baseStyle.push(styles.hidden);
    }

    return baseStyle;
  };

  const getNumberColor = (num) => {
    const colors = [
      "",
      "#1976D2",
      "#388E3C",
      "#D32F2F",
      "#7B1FA2",
      "#F57C00",
      "#0097A7",
      "#616161",
      "#424242",
    ];
    return colors[num] || "#000";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minesweeper</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Mines: {mines - flagCount}</Text>
          <Text style={styles.statText}>Status: {gameState}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === "beginner" && styles.activeDifficulty,
          ]}
          onPress={() => setDifficulty("beginner")}
        >
          <Text style={styles.buttonText}>Beginner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === "intermediate" && styles.activeDifficulty,
          ]}
          onPress={() => setDifficulty("intermediate")}
        >
          <Text style={styles.buttonText}>Intermediate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={getCellStyle(cell)}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                  onLongPress={() => handleCellLongPress(rowIndex, colIndex)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cellText,
                      {
                        fontSize: cellSize * 0.6,
                        color:
                          cell.isRevealed && !cell.isMine
                            ? getNumberColor(cell.neighborMines)
                            : "#000",
                      },
                    ]}
                  >
                    {getCellContent(cell)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Tap to reveal • Long press to flag
        </Text>
        {gameState === "won" && (
          <Text style={styles.winText}>🎉 You Won! 🎉</Text>
        )}
        {gameState === "lost" && (
          <Text style={styles.loseText}>💥 Game Over 💥</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
    gap: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  difficultyButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeDifficulty: {
    backgroundColor: "#2196F3",
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  board: {
    borderWidth: 2,
    borderColor: "#999",
    backgroundColor: "#ccc",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  hidden: {
    backgroundColor: "#ddd",
  },
  revealed: {
    backgroundColor: "#fff",
  },
  mine: {
    backgroundColor: "#ff5722",
  },
  cellText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  instructions: {
    alignItems: "center",
    paddingVertical: 20,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  winText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  loseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f44336",
    marginTop: 10,
  },
});

export default MinesweeperGame;
