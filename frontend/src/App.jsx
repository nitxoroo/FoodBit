import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const serverUrl = "http://localhost:3000";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;