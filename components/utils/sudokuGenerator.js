// src/utils/sudokuGenerator.js

// --- Helper Functions ---

/**
 * Shuffles an array in place.
 * @param {Array} array The array to shuffle.
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Checks if a number is valid in a given position on the grid.
 * @param {number[][]} grid The Sudoku grid.
 * @param {number} row The row to check.
 * @param {number} col The column to check.
 * @param {number} num The number to validate.
 * @returns {boolean} True if the number is valid, false otherwise.
 */
const isValid = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Solves a Sudoku grid using a backtracking algorithm.
 * @param {number[][]} grid The grid to solve.
 * @returns {boolean} True if a solution was found, false otherwise.
 */
const solveGrid = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(numbers); // Randomize to get different solutions each time

        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveGrid(grid)) {
              return true;
            }
            grid[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

// --- Main Generator Function ---

/**
 * Generates a new Sudoku puzzle and its solution.
 * @param {string} difficulty The difficulty level ('easy', 'medium', 'hard').
 * @returns {{puzzle: number[][], solution: number[][]}} An object containing the puzzle and solution grids.
 */
export const generatePuzzle = (difficulty = "easy") => {
  console.log(`Generating Sudoku puzzle with difficulty: ${difficulty}`);

  // 1. Create a fully solved grid
  const solution = Array(9)
    .fill()
    .map(() => Array(9).fill(0));
  solveGrid(solution);

  // 2. Create a deep copy for the puzzle to poke holes in
  const puzzle = solution.map((row) => [...row]);

  // 3. Determine the number of cells to remove based on difficulty
  // For 'easy' (kids 8-10), we leave most cells filled in.
  // 81 total cells. Removing 12 means 69 clues are visible.
  const difficultyLevels = {
    easy: 12,
    medium: 35,
    hard: 45,
  };
  const cellsToRemove = difficultyLevels[difficulty] || difficultyLevels.easy;

  // 4. Get all cell positions and shuffle them
  const cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push({ row: i, col: j });
    }
  }
  shuffle(cells);

  // 5. Remove cells to create the puzzle
  // A full implementation would check for unique solutions here,
  // but for performance and simplicity, we'll just poke holes.
  for (let i = 0; i < cellsToRemove; i++) {
    const { row, col } = cells[i];
    puzzle[row][col] = 0;
  }

  console.log(`Generated puzzle with ${81 - cellsToRemove} clues.`);
  return { puzzle, solution };
};
