import React, { useState } from 'react'
import GameOfLife from './components/GameOfLife'
import Rule30 from './components/Rule30'
import './App.css'

const App = () => {
  const [showGameOfLife, setShowGameOfLife] = useState(true)

  const toggleComponent = () => {
    setShowGameOfLife((prevState) => !prevState)
  }

  return (
    <>
      <button onClick={toggleComponent}>
        {showGameOfLife ? 'Show Rule30' : 'Show GameOfLife'}
      </button>
      {showGameOfLife ? <GameOfLife /> : <Rule30 />}
    </>
  )
}

export default App
