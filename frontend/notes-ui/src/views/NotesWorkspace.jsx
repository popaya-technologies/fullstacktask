import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { FolderOpen, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import DeleteModal from '../components/DeleteModal';

const API_URL = "http://localhost:5000/api/notes";

export default function NotesWorkspace() {
  const location = useLocation(); // Tracks URL structural variations directly
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // ⚡ DYNAMIC ROUTING FOLDER TOKEN MAPPER
  const getCurrentViewToken = () => {
    if (location.pathname === '/archived') return 'archived';
    if (location.pathname === '/starred') return 'starred';
    return 'active';
  };

  const currentView = getCurrentViewToken();

  const fetchNotes = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // ⚡ TRANSMIT DYNAMIC VIEW STRING DIRECTLY DOWN TO THE MYSQL ENDPOINT
      const response = await axios.get(
        `${API_URL}?search=${encodeURIComponent(searchQuery)}&view=${currentView}`
      );
      setNotes(response.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to sync with notes database service.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data reload immediately whenever the search query or the active folder path shifts
  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchNotes(); }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, location.pathname]); 

  const triggerDeletePrompt = (id) => {
    const targetNote = notes.find(note => note.id === id);
    if (targetNote) {
      setNoteToDelete(targetNote);
      setIsDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await axios.delete(`${API_URL}/${noteToDelete.id}`);
      setIsDeleteOpen(false);
      setNoteToDelete(null);
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleTogglePin = async (id, currentPinnedState) => {
    try {
      await axios.put(`${API_URL}/${id}`, { pinned: !currentPinnedState });
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleToggleStar = async (id, currentStarredState) => {
    try {
      await axios.put(`${API_URL}/${id}`, { starred: !currentStarredState });
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleToggleArchive = async (id, currentArchivedState) => {
    try {
      await axios.put(`${API_URL}/${id}`, { archived: !currentArchivedState });
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const getPageHeaderTitle = () => {
    if (currentView === 'archived') return 'Archived Folders';
    if (currentView === 'starred') return 'Starred Snippets';
    return 'Notes Workspace';
  };

  return (
    <div className="flex min-h-screen bg-kaiBg text-gray-700 antialiased font-sans">
      {/* Sidebar now coordinates links internally using standard browser history paths */}
      <Sidebar />
      
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <Navbar
          setSearchQuery={setSearchQuery}
          onAddClick={() => { setActiveNote(null); setIsModalOpen(true); }}
        />

        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{getPageHeaderTitle()}</h1>
            <p className="text-sm text-gray-500">Manage your notes efficiently</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          {loading && (
            <div className="text-center py-24">
              <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-kaiPrimary rounded-full"></div>
              <p className="mt-3 text-sm text-gray-400 font-medium">Streaming filtered database entries...</p>
            </div>
          )}

          {!loading && notes.length === 0 && !errorMessage && (
            <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h5 className="text-base font-semibold text-gray-400">No Notes Found Here</h5>
              <p className="text-xs text-gray-400 mt-1">Items move folders dynamically as column conditions change.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {!loading && notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => { setActiveNote(n); setIsModalOpen(true); }}
                  onDelete={triggerDeletePrompt}
                  onTogglePin={handleTogglePin}
                  onToggleStar={handleToggleStar}
                  onToggleArchive={handleToggleArchive}
                />
              ))}
            </AnimatePresence>
          </div>
        </main>

        <NoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeNote={activeNote}
          fetchNotes={fetchNotes}
          API_URL={API_URL}
        />

        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => { setIsDeleteOpen(false); setNoteToDelete(null); }}
          onConfirm={handleConfirmDelete}
          noteTitle={noteToDelete?.title}
        />
      </div>
    </div>
  );
}