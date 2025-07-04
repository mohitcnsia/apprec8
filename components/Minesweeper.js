import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

// --- Game Configuration ---
const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

// A fixed cell size ensures tap targets are always large enough.
const CELL_SIZE = 35;

// Helper function to get the color for the number in a cell
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

// --- Game Component ---
const MinesweeperGame = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // --- State Management ---
  const [difficulty, setDifficulty] = useState("beginner");
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'won', 'lost'
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // --- Game Logic ---

  /**
   * Creates a new, empty board based on the current difficulty.
   */
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

  /**
   * Places mines randomly on the board, avoiding the first-clicked cell.
   * After placing mines, it calculates the number of neighboring mines for each cell.
   */
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

  /**
   * Initializes or resets the game to its starting state.
   */
  const initializeGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setGameState("playing");
    setFlagCount(0);
    setFirstClick(true);
  }, [createEmptyBoard]);

  // Reset game when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  // Hide the tab bar on this screen
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () =>
        parent?.setOptions({
          tabBarStyle: {
            display: "flex",
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border,
          },
        });
    }, [navigation, theme])
  );

  /**
   * Handles the logic for revealing a cell.
   * If it's the first click, it places the mines first.
   * It recursively reveals adjacent cells if an empty cell is clicked.
   */
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
        newBoard.forEach((boardRow) =>
          boardRow.forEach((cell) => {
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

    const revealedCount = newBoard
      .flat()
      .filter((cell) => cell.isRevealed).length;
    if (revealedCount === rows * cols - mines && gameState === "playing") {
      setGameState("won");
    }
    setBoard(newBoard);
  };

  /**
   * Handles toggling a flag on a cell via long press.
   */
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

  // --- Rendering Helpers ---

  const getCellContent = (cell) => {
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.neighborMines === 0) return "";
    return cell.neighborMines.toString();
  };

  const getCellStyle = (cell) => {
    const baseStyle = [styles.cell, { width: CELL_SIZE, height: CELL_SIZE }];
    if (cell.isRevealed) {
      if (cell.isMine) baseStyle.push(styles.mine);
      else baseStyle.push(styles.revealed);
    } else {
      baseStyle.push(styles.hidden);
    }
    return baseStyle;
  };

  // --- Component Render ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stats}>
          <Text style={styles.statText}>Mines: {mines - flagCount}</Text>
          <Text style={styles.statText}>Status: {gameState}</Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap to reveal • Long press to flag
          </Text>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
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
                          fontSize: CELL_SIZE * 0.6,
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
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {gameState === "won" && (
          <Text style={styles.winText}>🎉 You Won! 🎉</Text>
        )}
        {gameState === "lost" && (
          <Text style={styles.loseText}>💥 Game Over 💥</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const getStyles = (theme) =>
  StyleSheet.create({
    /**
     * ✅ FIX: The main container no longer has horizontal padding.
     * This allows the board container to use the full screen width.
     */
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
    },
    /**
     * ✅ FIX: Padding is now applied directly to the header,
     * controls, and footer to keep them from touching the screen edges.
     */
    header: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
      width: "100%",
      paddingHorizontal: 20,
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    statText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    instructions: {
      marginTop: 15,
    },
    instructionText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    controls: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap",
      justifyContent: "center",
      paddingHorizontal: 20,
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
      color: theme.textPrimary,
      fontWeight: "600",
      fontSize: 14,
    },
    activeButtonText: {
      color: theme.buttonText,
    },
    boardContainer: {
      flex: 1,
      width: "100%",
    },
    /**
     * ✅ FIX: Padding is added inside the scroll view. This creates a
     * visual margin so the board doesn't touch the screen edges,
     * preventing any visual clipping.
     */
    scrollViewContent: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    board: {
      borderWidth: 2,
      borderColor: theme.borderLight,
      backgroundColor: theme.borderLight,
    },
    row: {
      flexDirection: "row",
    },
    cell: {
      borderWidth: 0.5,
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
    footer: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    winText: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.success,
    },
    loseText: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.warning,
    },
  });

export default MinesweeperGame;
