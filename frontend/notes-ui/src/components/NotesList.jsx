import NoteCard from './NoteCard'
import '../styles/NotesList.css'

function NotesList({ notes, onEdit, onDelete }) {
  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  )
}

export default NotesList
