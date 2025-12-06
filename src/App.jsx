import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import ConsultantPage from './pages/ConsultantPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-notion-bg">
          <Navbar />
          <Routes>
            <Route path='/' element={<Navigate to="/consultant" replace />} />
            <Route path='/login' element={<LoginPage />} />
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/consultant'
              element={
                <ProtectedRoute>
                  <ConsultantPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/consultant" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

