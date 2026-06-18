import '../styles/NoteCard.css'

function NoteCard({ note, onEdit, onDelete }) {
  const preview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')
  const createdDate = new Date(note.createdAt).toLocaleDateString()
  const updatedDate = new Date(note.updatedAt).toLocaleDateString()

  return (
    <div className="note-card">
      <h3 className="note-title">{note.title}</h3>
      <p className="note-preview">{preview}</p>
      <div className="note-dates">
        <span className="date">📅 Created: {createdDate}</span>
        <span className="date">✏️ Updated: {updatedDate}</span>
      </div>
      <div className="note-actions">
        <button className="btn-edit" onClick={onEdit}>Edit</button>
        <button className="btn-delete" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default NoteCard
