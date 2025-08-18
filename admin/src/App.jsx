import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'; 
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import tokenManager from './utils/tokenManager';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Setup axios interceptor for automatic token refresh
      tokenManager.setupAxiosInterceptor();
    }
  }, [token]);

  const handleSetToken = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    tokenManager.clearTokens();
    setToken('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={handleSetToken}/>
      ) : (
        <>
          <Navbar handleLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} setToken={handleSetToken} />} />
                <Route path="/list" element={<List token={token} setToken={handleSetToken} />} />
                <Route path="/orders" element={<Orders token={token} setToken={handleSetToken} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
