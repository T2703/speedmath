import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Math from './components/Math';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/math/:operatorType" element={<Math />} />
        <Route path="/leaderboards/:operatorType" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
