import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust path as needed

const { width } = Dimensions.get("window");
const gridSize = width - 64; // Total grid size with padding
const cellSize = (gridSize - 6) / 9; // 6px for the thick borders between 3x3 sections

const SudokuGame = () => {
  const { theme, isDark } = useTheme();

  // Initial puzzle (0 represents empty cells)
  const initialPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const [grid, setGrid] = useState(initialPuzzle.map((row) => [...row]));
  const [notes, setNotes] = useState(
    Array(9)
      .fill()
      .map(() =>
        Array(9)
          .fill()
          .map(() => new Set())
      )
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState(null);

  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      padding: 16,
    },
    header: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    timer: {
      fontSize: 20,
      fontFamily: "monospace",
      color: theme.textPrimary,
    },
    headerBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    mistakes: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    difficulty: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    controls: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    controlButton: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 12,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 48,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    controlButtonText: {
      fontSize: 20,
    },
    activeButton: {
      backgroundColor: theme.primary,
    },
    revealButton: {
      backgroundColor: theme.success,
    },
    disabledButton: {
      backgroundColor: theme.disabledBackground,
      borderColor: theme.disabledBorder,
      opacity: 0.6,
    },
    gridContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      alignItems: "center",
    },
    sudokuBoard: {
      width: gridSize,
      height: gridSize,
      backgroundColor: theme.border,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2, // Space between 3x3 sections
    },
    section: {
      width: (gridSize - 4) / 3, // 4px for gaps between sections
      height: (gridSize - 4) / 3,
      backgroundColor: theme.cardBackground,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    cell: {
      width: cellSize,
      height: cellSize,
      borderWidth: 0.5,
      borderColor: theme.borderLight,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
    },
    selectedCell: {
      backgroundColor: isDark ? theme.primary + "40" : theme.primary + "20",
    },
    highlightedCell: {
      backgroundColor: isDark ? theme.primary + "30" : theme.primary + "15",
    },
    conflictCell: {
      backgroundColor: theme.warning + "30",
    },
    cellText: {
      fontSize: 18,
      fontWeight: "500",
    },
    prefilledText: {
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    userText: {
      color: theme.primary,
    },
    conflictText: {
      color: theme.warning,
    },
    notesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      height: "100%",
      padding: 2,
    },
    noteText: {
      fontSize: 8,
      color: theme.textSecondary,
      width: "33.33%",
      textAlign: "center",
      lineHeight: 10,
    },
    numberInput: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    numberGrid: {
      alignItems: "center",
    },
    numberRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 12,
      gap: 12,
    },
    numberButton: {
      backgroundColor: theme.inputBackground,
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    numberButtonText: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.textPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      margin: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.textPrimary,
    },
    modalText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 24,
      textAlign: "center",
    },
    modalButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    modalButtonText: {
      color: theme.textOnPrimary,
      fontSize: 16,
      fontWeight: "500",
    },
  });

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Check if move is valid
  const isValidMove = (row, col, num) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  // Check if puzzle is completed
  const checkCompletion = useCallback(() => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) return false;
      }
    }
    setIsCompleted(true);
    setIsRunning(false);
    return true;
  }, [grid]);

  useEffect(() => {
    checkCompletion();
  }, [grid, checkCompletion]);

  // Handle cell press
  const handleCellPress = (row, col) => {
    if (initialPuzzle[row][col] !== 0) return; // Can't edit prefilled cells
    setSelectedCell({ row, col });
    if (!isRunning) setIsRunning(true);
  };

  // Start timer on first interaction
  useEffect(() => {
    if (selectedCell && !isRunning && !isCompleted) {
      setIsRunning(true);
    }
  }, [selectedCell, isRunning, isCompleted]);

  // Reveal solution
  const revealSolution = () => {
    setGrid(solution.map((row) => [...row]));
    setNotes(
      Array(9)
        .fill()
        .map(() =>
          Array(9)
            .fill()
            .map(() => new Set())
        )
    );
    setIsCompleted(true);
    setIsRunning(false);
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (initialPuzzle[row][col] !== 0) return; // Can't edit prefilled cells

    if (noteMode) {
      const newNotes = [...notes];
      if (newNotes[row][col].has(num)) {
        newNotes[row][col].delete(num);
      } else {
        newNotes[row][col].add(num);
      }
      setNotes(newNotes);
    } else {
      const newGrid = [...grid];
      if (newGrid[row][col] === num) {
        newGrid[row][col] = 0; // Clear if same number
      } else {
        newGrid[row][col] = num;
        // Clear notes for this cell
        const newNotes = [...notes];
        newNotes[row][col].clear();
        setNotes(newNotes);

        // Check if move is correct
        if (!isValidMove(row, col, num)) {
          setMistakes((prev) => prev + 1);
        }
      }
      setGrid(newGrid);
    }
  };

  // Get hint
  const getHint = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;

    const correctNumber = solution[row][col];
    const newGrid = [...grid];
    newGrid[row][col] = correctNumber;
    setGrid(newGrid);

    // Clear notes for this cell
    const newNotes = [...notes];
    newNotes[row][col].clear();
    setNotes(newNotes);
  };

  // Reset game
  const resetGame = () => {
    setGrid(initialPuzzle.map((row) => [...row]));
    setNotes(
      Array(9)
        .fill()
        .map(() =>
          Array(9)
            .fill()
            .map(() => new Set())
        )
    );
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(false);
    setMistakes(0);
    setIsCompleted(false);
    setHighlightedNumber(null);
  };

  // Clear selected cell
  const clearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;

    const newGrid = [...grid];
    newGrid[row][col] = 0;
    setGrid(newGrid);

    const newNotes = [...notes];
    newNotes[row][col].clear();
    setNotes(newNotes);
  };

  // Get cell conflicts
  const getCellConflicts = (row, col, num) => {
    if (num === 0) return false;
    return !isValidMove(row, col, num);
  };

  // Get same number highlighting
  const shouldHighlightCell = (row, col) => {
    if (highlightedNumber === null) return false;
    return grid[row][col] === highlightedNumber;
  };

  // Get cell style
  const getCellStyle = (row, col) => {
    const baseStyle = [dynamicStyles.cell];

    // Cell states
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      baseStyle.push(dynamicStyles.selectedCell);
    } else if (shouldHighlightCell(row, col)) {
      baseStyle.push(dynamicStyles.highlightedCell);
    }

    // Conflicts
    if (getCellConflicts(row, col, grid[row][col])) {
      baseStyle.push(dynamicStyles.conflictCell);
    }

    return baseStyle;
  };

  // Get text style for cell
  const getCellTextStyle = (row, col) => {
    const baseStyle = [dynamicStyles.cellText];

    if (initialPuzzle[row][col] !== 0) {
      baseStyle.push(dynamicStyles.prefilledText);
    } else {
      baseStyle.push(dynamicStyles.userText);
    }

    if (getCellConflicts(row, col, grid[row][col])) {
      baseStyle.push(dynamicStyles.conflictText);
    }

    return baseStyle;
  };

  // Render notes in cell
  const renderNotes = (row, col) => {
    const cellNotes = notes[row][col];
    if (cellNotes.size === 0) return null;

    return (
      <View style={dynamicStyles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text key={num} style={dynamicStyles.noteText}>
            {cellNotes.has(num) ? num : " "}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.headerTop}>
            <Text style={dynamicStyles.title}>Sudoku</Text>
            <Text style={dynamicStyles.timer}>{formatTime(timer)}</Text>
          </View>

          <View style={dynamicStyles.headerBottom}>
            <Text style={dynamicStyles.mistakes}>Mistakes: {mistakes}</Text>
            <Text style={dynamicStyles.difficulty}>Easy</Text>
          </View>
        </View>

        {/* Game Controls */}
        <View style={dynamicStyles.controls}>
          <TouchableOpacity
            style={dynamicStyles.controlButton}
            onPress={resetGame}
          >
            <Text style={dynamicStyles.controlButtonText}>🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.controlButton,
              (!selectedCell || isCompleted) && dynamicStyles.disabledButton,
            ]}
            onPress={getHint}
            disabled={!selectedCell || isCompleted}
          >
            <Text style={dynamicStyles.controlButtonText}>💡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.controlButton,
              noteMode && dynamicStyles.activeButton,
            ]}
            onPress={() => setNoteMode(!noteMode)}
          >
            <Text style={dynamicStyles.controlButtonText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.controlButton,
              (!selectedCell || isCompleted) && dynamicStyles.disabledButton,
            ]}
            onPress={clearCell}
            disabled={!selectedCell || isCompleted}
          >
            <Text style={dynamicStyles.controlButtonText}>🗑️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.controlButton, dynamicStyles.revealButton]}
            onPress={revealSolution}
          >
            <Text style={dynamicStyles.controlButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Sudoku Grid */}
        <View style={dynamicStyles.gridContainer}>
          <View style={dynamicStyles.sudokuBoard}>
            {/* Render 3x3 sections */}
            {[0, 1, 2].map((sectionRow) =>
              [0, 1, 2].map((sectionCol) => (
                <View
                  key={`section-${sectionRow}-${sectionCol}`}
                  style={dynamicStyles.section}
                >
                  {/* Render cells within each 3x3 section */}
                  {[0, 1, 2].map((cellRow) =>
                    [0, 1, 2].map((cellCol) => {
                      const row = sectionRow * 3 + cellRow;
                      const col = sectionCol * 3 + cellCol;
                      const cell = grid[row][col];

                      return (
                        <TouchableOpacity
                          key={`${row}-${col}`}
                          style={getCellStyle(row, col)}
                          onPress={() => handleCellPress(row, col)}
                          onPressIn={() =>
                            cell > 0 && setHighlightedNumber(cell)
                          }
                          onPressOut={() => setHighlightedNumber(null)}
                        >
                          {cell > 0 ? (
                            <Text style={getCellTextStyle(row, col)}>
                              {cell}
                            </Text>
                          ) : (
                            renderNotes(row, col)
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Number Input */}
        <View style={dynamicStyles.numberInput}>
          <View style={dynamicStyles.numberGrid}>
            {/* First row: 1-5 */}
            <View style={dynamicStyles.numberRow}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    dynamicStyles.numberButton,
                    isCompleted && dynamicStyles.disabledButton,
                  ]}
                  onPress={() => handleNumberInput(num)}
                  disabled={isCompleted}
                >
                  <Text style={dynamicStyles.numberButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Second row: 6-9 */}
            <View style={dynamicStyles.numberRow}>
              {[6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    dynamicStyles.numberButton,
                    isCompleted && dynamicStyles.disabledButton,
                  ]}
                  onPress={() => handleNumberInput(num)}
                  disabled={isCompleted}
                >
                  <Text style={dynamicStyles.numberButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={isCompleted}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalIcon}>✅</Text>
            <Text style={dynamicStyles.modalTitle}>Congratulations!</Text>
            <Text style={dynamicStyles.modalText}>
              You completed the puzzle in {formatTime(timer)}
            </Text>
            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={resetGame}
            >
              <Text style={dynamicStyles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SudokuGame;
