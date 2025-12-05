import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/AdminPage';
import ConsultantPage from './pages/ConsultantPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/consultant" replace />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/consultant' element={<ConsultantPage />} />
        <Route path="*" element={<Navigate to="/consultant" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;