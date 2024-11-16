<<<<<<< HEAD
// src/App.js

import React from 'react';
import Homepage from './components/Homepage';

function App() {
    return (
        <div className="App">
            <Homepage />
        </div>
    );
=======
import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> cf4472e85fe412fd2f5a5848fa1ea5fbcda6d803
}

export default App;
