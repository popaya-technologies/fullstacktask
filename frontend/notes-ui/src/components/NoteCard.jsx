function formatDate(dateStr) {
  const iso = dateStr.replace(' ', 'T') + 'Z';
  return new Date(iso).toLocaleDateString();
}

export default function NoteCard({ note, onClick }) {
  const preview =
    note.content.length > 100
      ? note.content.substring(0, 100) + '...'
      : note.content;

  return (
    <div className='note-card' onClick={() => onClick(note)}>
      <h3 className='note-card-title'>{note.title}</h3>
      <p className='note-card-preview'>{preview || 'No content'}</p>
      <div className='note-card-dates'>
        <span>Created: {formatDate(note.createdAt)}</span>
        <span>Updated: {formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
