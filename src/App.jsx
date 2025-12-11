import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import ConsultantPage from './pages/ConsultantPage';
import LoginPage from './pages/LoginPage';
import RecentChats from './pages/RecentChats';
import ChatViewerPage from './pages/ChatViewerPage'; // <--- IMPORT THIS

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-notion-bg">
          <Navbar />
          <Routes>
            {/* Login Route */}
            <Route path='/login' element={<LoginPage />} />
            
            {/* Redirect root to login */}
            <Route path='/' element={<Navigate to="/login" replace />} />

            {/* Admin Route */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* New Consultation Route */}
            <Route
              path='/consultant'
              element={
                <ProtectedRoute>
                  <ConsultantPage />
                </ProtectedRoute>
              }
            />

            {/* Recent Chats List Route */}
            <Route
              path='/recents/:category'
              element={
                <ProtectedRoute>
                  <RecentChats />
                </ProtectedRoute>
              }
            />

            {/* 🔥 NEW: Chat Viewer Route */}
            <Route
              path='/chat/:chatId'
              element={
                <ProtectedRoute>
                  <ChatViewerPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;