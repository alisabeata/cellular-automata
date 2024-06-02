import React, { useState, useEffect, useCallback } from 'react'

// Rules:

// Each triplet represents the states of the left neighbor,
// the center cell, and the right neighbor, and the value
// after the arrow represents the new state of the center cell.

// Neighborhood Configuration and New State:
// 111 -> 0
// 110 -> 0
// 101 -> 0
// 100 -> 1
// 011 -> 1
// 010 -> 1
// 001 -> 1
// 000 -> 0

// 1. Initial Condition: The automaton typically starts with a single black cell
//    in the center of the first row, with all other cells being white.
// 2. Evolution: As the automaton evolves, it creates a triangular, intricate pattern.
// 3. Chaos: Despite the simplicity of the rule, the pattern quickly becomes chaotic
//    and complex, demonstrating how simple rules can lead to complex behavior.

// Constants for the grid dimensions and colors
const numRows = 45
const numCols = 85
const cellSize = 13
const colors = {
  grid: '#212124', // Color for the grid lines
  cell: '#f4f4f4', // Color for live cells (white)
  background: '#161617', // Color for dead cells (dark gray)
}

const Rule30 = () => {
  const [automaton, setAutomaton] = useState<number[][]>([])
  const [isRandom, setIsRandom] = useState<boolean>(false)

  // Function to generate the automaton grid based on Rule 30
  const generateAutomaton = useCallback(() => {
    const automaton = Array(numRows)
      .fill(null)
      .map(() => Array(numCols).fill(0))

    if (isRandom) {
      // Randomize the first row if isRandom is true
      for (let j = 0; j < numCols; j++) {
        automaton[0][j] = Math.random() > 0.5 ? 1 : 0
      }
    } else {
      // Otherwise, initialize with a single cell in the center
      automaton[0][Math.floor(numCols / 2)] = 1
    }

    // Generate subsequent rows based on Rule 30:

    // Loop through each row starting from the second row
    for (let i = 1; i < numRows; i++) {
      // Loop through each cell in the current row
      for (let j = 0; j < numCols; j++) {
        // Get the state of the left neighbor, if out of bounds use 0
        const left = j === 0 ? 0 : automaton[i - 1][j - 1]

        // Get the state of the center cell from the previous row
        const center = automaton[i - 1][j]

        // Get the state of the right neighbor, if out of bounds use 0
        const right = j === numCols - 1 ? 0 : automaton[i - 1][j + 1]

        // Apply Rule 30 to determine the state of the current cell
        automaton[i][j] =
          (left === 1 && center === 1 && right === 1) || // 111 -> 0
          (left === 1 && center === 1 && right === 0) || // 110 -> 0
          (left === 1 && center === 0 && right === 1) || // 101 -> 0
          (left === 0 && center === 0 && right === 0) // 000 -> 0
            ? 0 // If any of the above conditions are true, set cell to 0
            : 1 // Otherwise, set cell to 1
      }
    }

    return automaton
  }, [isRandom])

  // Function to clear the automaton grid
  const clearAutomaton = () => {
    return Array(numRows)
      .fill(null)
      .map(() => Array(numCols).fill(0))
  }

  // useEffect to generate the automaton initially and whenever isRandom changes
  useEffect(() => {
    setAutomaton(generateAutomaton())
  }, [generateAutomaton, isRandom])

  // Handler to regenerate the automaton
  const handleRegenerate = () => {
    setAutomaton(generateAutomaton())
  }

  // Handler to clear the automaton
  const handleClear = () => {
    setAutomaton(clearAutomaton())
  }

  // Handler to toggle between random and centered initial state
  const toggleRandom = () => {
    setIsRandom(!isRandom)
  }

  return (
    <div
      className="App"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {automaton.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                border: `1px solid ${colors.grid}`,
                backgroundColor: cell ? colors.cell : colors.background,
                margin: '-1px 0 0 -1px',
              }}
            />
          ))}
        </div>
      ))}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleRegenerate} style={{ marginRight: '10px' }}>
          Regenerate
        </button>
        <button onClick={handleClear} style={{ marginRight: '10px' }}>
          Clear
        </button>
        <button onClick={toggleRandom}>
          {isRandom ? 'Use Centered Initial State' : 'Use Random Initial State'}
        </button>
      </div>
    </div>
  )
}

export default Rule30
