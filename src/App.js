import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Math from './components/Math';
import Home from './components/Homepage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element ={<Home/>}/>
        <Route path="/math" element={<Math />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;