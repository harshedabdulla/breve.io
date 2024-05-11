import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Connect from './components/Connect'
import Login from './components/Login'
import Home from './components/Home'
import Chat from './components/Chat'
import Chats from './components/Chats'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Chat />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
