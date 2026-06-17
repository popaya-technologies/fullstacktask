import { useState, useEffect } from 'react'
import '../styles/NoteForm.css'

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    }
  }, [note])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }

    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    onSave(title, content)
    setTitle('')
    setContent('')
    setError('')
  }

  return (
    <div className="note-form-container">
      <form className="note-form" onSubmit={handleSubmit}>
        <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            maxLength="100"
          />
          <span className="char-count">{title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            placeholder="Enter note content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              setError('')
            }}
            rows="8"
            maxLength="5000"
          />
          <span className="char-count">{content.length}/5000</span>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {note ? 'Update Note' : 'Create Note'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NoteForm
