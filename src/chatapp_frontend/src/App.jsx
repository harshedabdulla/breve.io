import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Connect from './components/Connect'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
