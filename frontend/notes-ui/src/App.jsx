import { useCallback, useEffect, useState } from 'react';
import './App.css';
import ConfirmDialog from './components/ConfirmDialog';
import NoteDetail from './components/NoteDetail';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  searchNotes,
  updateNote,
} from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // View state: 'list' | 'detail' | 'create' | 'edit'
  const [view, setView] = useState('list');
  const [activeNote, setActiveNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const fetchNotes = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getNotes(pageNum);
      setNotes(res.data.notes);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    async (query, pageNum = 1) => {
      setSearchQuery(query);
      if (!query.trim()) {
        fetchNotes(pageNum);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await searchNotes(query, pageNum);
        setNotes(res.data.notes);
        setTotalPages(res.data.pagination.totalPages);
        setPage(res.data.pagination.page);
      } catch {
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes],
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteClick = async (note) => {
    setLoading(true);
    try {
      const res = await getNote(note.id);
      setActiveNote(res.data);
      setView('detail');
    } catch {
      setError('Failed to load note details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setActiveNote(null);
    setView('create');
  };

  const handleEdit = (note) => {
    setActiveNote(note);
    setView('edit');
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      if (view === 'edit' && activeNote) {
        const res = await updateNote(activeNote.id, data);
        setActiveNote(res.data);
        setView('detail');
      } else {
        await createNote(data);
        setView('list');
      }
      setSearchQuery('');
      fetchNotes(1);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save note.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (note) => {
    setNoteToDelete(note);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    setLoading(true);
    setError('');
    try {
      await deleteNote(noteToDelete.id);
      setNoteToDelete(null);
      setView('list');
      setSearchQuery('');
      fetchNotes(1);
    } catch {
      setError('Failed to delete note.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('list');
    setActiveNote(null);
  };

  const handlePageChange = (newPage) => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery, newPage);
    } else {
      fetchNotes(newPage);
    }
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1 onClick={handleBack} className='app-title'>
          Notes App
        </h1>
        {view === 'list' && (
          <button className='btn btn-primary' onClick={handleCreate}>
            + New Note
          </button>
        )}
      </header>

      {error && (
        <div className='error-banner'>
          <span>{error}</span>
          <button onClick={() => setError('')}>&times;</button>
        </div>
      )}

      {loading && view === 'list' && <div className='loading'>Loading...</div>}

      {view === 'list' && (
        <>
          <SearchBar value={searchQuery} onChange={handleSearch} />
          <NotesList notes={notes} onNoteClick={handleNoteClick} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {view === 'detail' && activeNote && (
        <NoteDetail
          note={activeNote}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onBack={handleBack}
        />
      )}

      {(view === 'create' || view === 'edit') && (
        <NoteForm
          note={view === 'edit' ? activeNote : null}
          onSubmit={handleFormSubmit}
          onCancel={handleBack}
        />
      )}

      {noteToDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${noteToDelete.title}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </div>
  );
}

export default App;
