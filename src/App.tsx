import React, { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

// Rules:

// 1. Underpopulation: Any live cell with fewer than two live neighbors dies, as if by underpopulation.
// 2. Survival: Any live cell with two or three live neighbors lives on to the next generation.
// 3. Overpopulation: Any live cell with more than three live neighbors dies, as if by overpopulation.
// 4. Reproduction: Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

// Constants
const numRows = 50
const numCols = 95
const cellSize = 13
const colors = {
  grid: '#212124', // Color for the grid lines
  cell: '#f4f4f4', // Color for live cells (white)
  background: '#161617', // Color for dead cells (dark gray)
}

// Possible neighbor positions (up, down, left, right, and diagonals)
const operations: number[][] = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

// Function to generate an empty grid
const generateEmptyGrid = (): number[][] => {
  const rows: number[][] = []
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

const App: React.FC = () => {
  // State to hold the grid data
  const [grid, setGrid] = useState<number[][]>(() => generateEmptyGrid())
  // State to track whether the simulation is running
  const [running, setRunning] = useState<boolean>(false)
  const runningRef = useRef(running)
  runningRef.current = running

  // Function to run the simulation
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    // Update the grid based on the Game of Life rules
    setGrid((g) => {
      return g.map((row, i) =>
        row.map((col, k) => {
          let neighbors = 0

          // Calculate the number of live neighbors
          operations.forEach(([x, y]) => {
            const newI = i + x
            const newK = k + y

            // Check if the neighboring cell is within bounds
            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
              neighbors += g[newI][newK]
            }
          })

          // Apply the Game of Life rules
          if (neighbors < 2 || neighbors > 3) {
            // Rule 1 & 3: Any live cell with fewer than two or more than three live neighbors dies
            return 0
          } else if (g[i][k] === 0 && neighbors === 3) {
            // Rule 4: Any dead cell with exactly three live neighbors becomes a live cell
            return 1
          } else {
            // Rule 2: Any live cell with two or three live neighbors lives on
            return g[i][k]
          }
        }),
      )
    })

    // Schedule the next simulation step
    requestAnimationFrame(runSimulation)
  }, [])

  // Effect to start the simulation when 'running' state changes
  useEffect(() => {
    if (running) {
      runningRef.current = true
      runSimulation()
    } else {
      runningRef.current = false
    }
  }, [running, runSimulation])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                // Toggle cell state on click
                const newGrid = grid.slice()
                newGrid[i][k] = grid[i][k] ? 0 : 1
                setGrid(newGrid)
              }}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[i][k] ? colors.cell : colors.background,
                border: `1px solid ${grid[i][k] ? colors.cell : colors.grid}`,
                margin: '-1px 0 0 -1px',
              }}
            />
          )),
        )}
      </div>
      <div>
        <button onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>
        <button
          onClick={() => {
            // Generate a random grid
            const rows: number[][] = []
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)),
              )
            }
            setGrid(rows)
          }}
        >
          Random
        </button>
      </div>
    </div>
  )
}

export default App
