import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

// This function's classic colors are preserved, but could also be themed.
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

const MinesweeperGame = () => {
  const { theme } = useTheme(); // 2. Get theme from context
  const styles = useMemo(() => getStyles(theme), [theme]); // 3. Create dynamic styles

  const [difficulty, setDifficulty] = useState("beginner");
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState("playing"); // playing, won, lost
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

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

      if (
        !newBoard[row][col].isMine &&
        !(row === firstClickRow && col === firstClickCol)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

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
    setFlagCount(0);
    setFirstClick(true);
  }, [createEmptyBoard, mines]);

  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]); // Re-initialize if difficulty changes

  const revealCell = (row, col) => {
    if (
      gameState !== "playing" ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return;
    }

    let newBoard = board.map((r) => r.map((c) => ({ ...c })));

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
        newBoard[r][c].isRevealed ||
        newBoard[r][c].isFlagged
      ) {
        return;
      }

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].isMine) {
        setGameState("lost");
        newBoard.forEach((row) =>
          row.forEach((cell) => {
            if (cell.isMine) cell.isRevealed = true;
          })
        );
        return;
      }

      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              revealRecursive(r + dr, c + dc);
            }
          }
        }
      }
    };

    revealRecursive(row, col);
    setBoard(newBoard);

    const revealedCount = newBoard
      .flat()
      .filter((cell) => cell.isRevealed).length;
    if (revealedCount === rows * cols - mines && gameState === "playing") {
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
      if (cell.isMine) baseStyle.push(styles.mine);
      else baseStyle.push(styles.revealed);
    } else {
      baseStyle.push(styles.hidden);
    }
    return baseStyle;
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
          <Text
            style={[
              styles.buttonText,
              difficulty === "beginner" && styles.activeButtonText,
            ]}
          >
            Beginner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === "intermediate" && styles.activeDifficulty,
          ]}
          onPress={() => setDifficulty("intermediate")}
        >
          <Text
            style={[
              styles.buttonText,
              difficulty === "intermediate" && styles.activeButtonText,
            ]}
          >
            Intermediate
          </Text>
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
                  onPress={() => revealCell(rowIndex, colIndex)}
                  onLongPress={() => toggleFlag(rowIndex, colIndex)}
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
                            : theme.textPrimary,
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.textPrimary,
      marginBottom: 10,
    },
    stats: {
      flexDirection: "row",
      gap: 20,
    },
    statText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    controls: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    difficultyButton: {
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeDifficulty: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    resetButton: {
      backgroundColor: theme.success,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    buttonText: {
      color: theme.textSecondary,
      fontWeight: "600",
      fontSize: 14,
    },
    activeButtonText: {
      color: theme.buttonText,
    },
    boardContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    board: {
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.borderLight,
    },
    row: {
      flexDirection: "row",
    },
    cell: {
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    hidden: {
      backgroundColor: theme.disabledBackground,
    },
    revealed: {
      backgroundColor: theme.cardBackground,
    },
    mine: {
      backgroundColor: theme.warningBackground,
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
      color: theme.textSecondary,
      textAlign: "center",
    },
    winText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.success,
      marginTop: 10,
    },
    loseText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.warning,
      marginTop: 10,
    },
  });

export default MinesweeperGame;
