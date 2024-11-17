import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Math from './components/Math';
import Leaderboard from './components/Leaderboard';
import Home from './components/Homepage';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile'
import ProfileEdit from './components/ProfileEdit';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'element={<LandingPage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element ={<ForgotPassword/>}/>
        <Route path="/math/:operatorType" element={<Math />} />
        <Route path="/leaderboards/:operatorType" element={<Leaderboard />} />
        <Route path="/user" element ={<Home/>}/>
        <Route path="/profile" element ={<Profile/>}/>
        <Route path="/editprofile" element ={<ProfileEdit/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;