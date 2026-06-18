import { useState, useEffect } from 'react'
import NotesList from './components/NotesList'
import NoteForm from './components/NoteForm'
import SearchBar from './components/SearchBar'
import './styles/App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const API_URL = 'http://localhost:3000/api'

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/notes`)
      if (!response.ok) throw new Error('Failed to fetch notes')
      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setError(err.message)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (title, content) => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      if (!response.ok) throw new Error('Failed to create note')
      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateNote = async (id, title, content) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      if (!response.ok) throw new Error('Failed to update note')
      const updatedNote = await response.json()
      setNotes(notes.map(n => n.id === id ? updatedNote : n))
      setEditingNote(null)
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete note')
      setNotes(notes.filter(n => n.id !== id))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Notes Manager</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingNote(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : '+ New Note'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={editingNote
            ? (title, content) => handleUpdateNote(editingNote.id, title, content)
            : handleAddNote
          }
          onCancel={() => {
            setShowForm(false)
            setEditingNote(null)
          }}
        />
      )}

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : sortedNotes.length === 0 ? (
        <div className="empty-state">
          {notes.length === 0 ? '📪 No notes yet. Create one to get started!' : '🔍 No notes match your search'}
        </div>
      ) : (
        <NotesList
          notes={sortedNotes}
          onEdit={(note) => {
            setEditingNote(note)
            setShowForm(true)
          }}
          onDelete={handleDeleteNote}
        />
      )}
    </div>
  )
}

export default App
