import NoteCard from './NoteCard';

export default function NotesList({ notes, onNoteClick }) {
  if (notes.length === 0) {
    return (
      <div className='empty-state'>
        <p>No notes found. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className='notes-list'>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={onNoteClick} />
      ))}
    </div>
  );
}
