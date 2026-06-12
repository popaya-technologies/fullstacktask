import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotesWorkspace from './views/NotesWorkspace';

export default function App() {
  return (
    <Routes>
      {/* ⚡ MAP ALL VALID PATHS TO THE CENTRAL VIEW COMPONENT */}
      <Route path="/" element={<NotesWorkspace />} />
      <Route path="/archived" element={<NotesWorkspace />} />
      <Route path="/starred" element={<NotesWorkspace />} />

      {/* Wildcard Fallback redirection mechanism rule */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}