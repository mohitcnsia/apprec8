import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { generatePuzzle } from "../components/utils/sudokuGenerator";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
const { width } = Dimensions.get("window");
const gridSize = width - 64;
const cellSize = (gridSize - 6) / 9;

const SudokuGame = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

  // State Management
  const [solution, setSolution] = useState(null);
  const [initialPuzzle, setInitialPuzzle] = useState(null);
  const [grid, setGrid] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState(null);

  // Game Initialization
  const initializeNewGame = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const { puzzle, solution: newSolution } = generatePuzzle("easy");
      setSolution(newSolution);
      setInitialPuzzle(puzzle);
      setGrid(puzzle.map((row) => [...row]));
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
      setIsLoading(false);
    }, 100);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Get the parent navigator which controls the tab bar
      const parent = navigation.getParent();

      // Hide the tab bar when the game screen is focused
      parent?.setOptions({
        tabBarStyle: { display: "none" },
      });

      // This is the cleanup function that runs when you leave the screen
      return () =>
        parent?.setOptions({
          // Re-apply the correct THEMED style when showing the tab bar again
          tabBarStyle: {
            display: "flex", // Make it visible again
            backgroundColor: theme.tabBarBackground, // Use the theme's background color
            borderTopColor: theme.border, // Use the theme's border color
          },
        });
    }, [navigation, theme]) // Add theme to the dependency array
  );

  useEffect(() => {
    initializeNewGame();
  }, [initializeNewGame]);

  // Timer and Completion Logic
  useEffect(() => {
    let interval;
    if (isRunning && !isCompleted) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  const checkCompletion = useCallback(() => {
    if (!grid || !solution) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0 || grid[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }
    setIsCompleted(true);
    setIsRunning(false);
    return true;
  }, [grid, solution]);

  useEffect(() => {
    if (solution) {
      checkCompletion();
    }
  }, [grid, solution, checkCompletion]);

  // Game Actions
  const handleCellPress = (row, col) => {
    if (initialPuzzle[row][col] !== 0) return;
    setSelectedCell({ row, col });
    if (!isRunning && !isCompleted) setIsRunning(true);
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;
    if (noteMode) {
      const newNotes = notes.map((r) => r.map((c) => new Set(c)));
      if (newNotes[row][col].has(num)) {
        newNotes[row][col].delete(num);
      } else {
        newNotes[row][col].add(num);
      }
      setNotes(newNotes);
    } else {
      const newGrid = grid.map((r) => [...r]);
      if (newGrid[row][col] === num) {
        newGrid[row][col] = 0;
      } else {
        newGrid[row][col] = num;
        const newNotes = notes.map((r) => r.map((c) => new Set(c)));
        newNotes[row][col].clear();
        setNotes(newNotes);
        if (num !== solution[row][col]) {
          setMistakes((m) => m + 1);
        }
      }
      setGrid(newGrid);
    }
  };

  const getHint = () => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== 0 || grid[row][col] !== 0) return;
    const correctNumber = solution[row][col];
    handleNumberInput(correctNumber);
  };

  const revealSolution = () => {
    if (!solution) return;
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

  const clearCell = () => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;
    const newGrid = [...grid];
    newGrid[row][col] = 0;
    setGrid(newGrid);
    const newNotes = [...notes];
    newNotes[row][col].clear();
    setNotes(newNotes);
  };

  // UI and Styling Logic
  const getCellConflicts = (row, col, num) => {
    if (num === 0 || !solution) return false;
    return num !== solution[row][col];
  };

  const shouldHighlightCell = (row, col) => {
    if (highlightedNumber === null) return false;
    return grid[row][col] === highlightedNumber;
  };

  const getCellStyle = (row, col) => {
    const baseStyle = [styles.cell];
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      baseStyle.push(styles.selectedCell);
    } else if (shouldHighlightCell(row, col)) {
      baseStyle.push(styles.highlightedCell);
    }
    if (grid[row][col] !== 0 && getCellConflicts(row, col, grid[row][col])) {
      baseStyle.push(styles.conflictCell);
    }
    return baseStyle;
  };

  const getCellTextStyle = (row, col) => {
    const baseStyle = [styles.cellText];
    if (initialPuzzle[row][col] !== 0) {
      baseStyle.push(styles.prefilledText);
    } else {
      baseStyle.push(styles.userText);
    }
    if (grid[row][col] !== 0 && getCellConflicts(row, col, grid[row][col])) {
      baseStyle.push(styles.conflictText);
    }
    return baseStyle;
  };

  const renderNotes = (row, col) => {
    const cellNotes = notes[row][col];
    if (!cellNotes || cellNotes.size === 0) return null;
    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text key={num} style={styles.noteText}>
            {cellNotes.has(num) ? num : " "}
          </Text>
        ))}
      </View>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Main Render
  if (isLoading || !grid) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Generating New Puzzle...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      {/* --- CHANGE: Using ScrollView with contentContainerStyle for better layout --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top-aligned content */}
        <View>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Sudoku</Text>
              <Text style={styles.timer}>{formatTime(timer)}</Text>
            </View>
            <View style={styles.headerBottom}>
              <Text style={styles.mistakes}>Mistakes: {mistakes}</Text>
              <Text style={styles.difficulty}>Easy</Text>
            </View>
          </View>
        </View>

        {/* Bottom-aligned content */}
        <View style={styles.gameArea}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={initializeNewGame}
            >
              <MaterialCommunityIcons
                name="plus-box-outline"
                style={styles.controlButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (!selectedCell || isCompleted) && styles.disabledButton,
              ]}
              onPress={getHint}
              disabled={!selectedCell || isCompleted}
            >
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                style={styles.controlButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, noteMode && styles.activeButton]}
              onPress={() => setNoteMode(!noteMode)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                style={styles.controlButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (!selectedCell || isCompleted) && styles.disabledButton,
              ]}
              onPress={clearCell}
              disabled={!selectedCell || isCompleted}
            >
              <MaterialCommunityIcons
                name="eraser"
                style={styles.controlButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.revealButton]}
              onPress={revealSolution}
            >
              <MaterialCommunityIcons
                name="magnify"
                style={styles.controlButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.sudokuBoard}>
              {[0, 1, 2].map((sectionRow) =>
                [0, 1, 2].map((sectionCol) => (
                  <View
                    key={`section-${sectionRow}-${sectionCol}`}
                    style={styles.section}
                  >
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
          <View style={styles.numberInput}>
            <View style={styles.numberGrid}>
              <View style={styles.numberRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      isCompleted && styles.disabledButton,
                    ]}
                    onPress={() => handleNumberInput(num)}
                    disabled={isCompleted}
                  >
                    <Text style={styles.numberButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.numberRow}>
                {[6, 7, 8, 9].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      isCompleted && styles.disabledButton,
                    ]}
                    onPress={() => handleNumberInput(num)}
                    disabled={isCompleted}
                  >
                    <Text style={styles.numberButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCompleted}
        transparent={true}
        animationType="fade"
        onRequestClose={initializeNewGame}
      >
        <Pressable style={styles.modalOverlay} onPress={initializeNewGame}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalText}>
              You completed the puzzle in {formatTime(timer)}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={initializeNewGame}
            >
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (theme, isDark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: { marginTop: 10, color: theme.textSecondary },
    // --- CHANGE: New layout styles ---
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      padding: 16,
    },
    gameArea: {
      // This view now groups all interactive elements at the bottom
    },
    // --- End New layout styles ---
    header: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
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
    title: { fontSize: 24, fontWeight: "bold", color: theme.textPrimary },
    timer: { fontSize: 20, fontFamily: "monospace", color: theme.textPrimary },
    headerBottom: { flexDirection: "row", justifyContent: "space-between" },
    mistakes: { fontSize: 14, color: theme.textSecondary },
    difficulty: { fontSize: 14, color: theme.textSecondary },
    controls: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16, // Margin between controls and grid
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
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    controlButtonIcon: { fontSize: 24, color: theme.textPrimary },
    activeButton: { backgroundColor: theme.primary },
    revealButton: { backgroundColor: theme.success },
    disabledButton: {
      backgroundColor: theme.disabledBackground,
      borderColor: theme.disabledBorder,
      opacity: 0.6,
    },
    gridContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16, // Margin between grid and number pad
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
      gap: 2,
    },
    section: {
      width: (gridSize - 4) / 3,
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
    conflictCell: { backgroundColor: theme.warningBackground },
    cellText: { fontSize: 18, fontWeight: "500" },
    prefilledText: { fontWeight: "bold", color: theme.textPrimary },
    userText: { color: theme.primary },
    conflictText: { color: theme.warning },
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
    numberGrid: { alignItems: "center" },
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
      width: "80%",
      maxWidth: 300,
    },
    modalIcon: { fontSize: 48, marginBottom: 16 },
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

export default SudokuGame;
