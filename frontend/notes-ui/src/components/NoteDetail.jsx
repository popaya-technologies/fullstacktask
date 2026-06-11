function formatDate(dateStr) {
  // SQLite returns "YYYY-MM-DD HH:MM:SS" — convert to ISO 8601 UTC
  const iso = dateStr.replace(' ', 'T') + 'Z';
  return new Date(iso).toLocaleString();
}

export default function NoteDetail({ note, onEdit, onDelete, onBack }) {
  return (
    <div className='note-detail'>
      <button className='btn btn-back' onClick={onBack}>
        &larr; Back to Notes
      </button>

      <div className='note-detail-content'>
        <h2 className='note-detail-title'>{note.title}</h2>

        <div className='note-detail-dates'>
          <span>Created: {formatDate(note.createdAt)}</span>
          <span>Updated: {formatDate(note.updatedAt)}</span>
        </div>

        <div className='note-detail-body'>
          {note.content ? (
            <p>{note.content}</p>
          ) : (
            <p className='note-detail-empty'>No content</p>
          )}
        </div>
      </div>

      <div className='note-detail-actions'>
        <button className='btn btn-primary' onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className='btn btn-danger' onClick={() => onDelete(note)}>
          Delete
        </button>
      </div>
    </div>
  );
}
