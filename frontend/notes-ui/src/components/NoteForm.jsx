import { useEffect, useState } from 'react';

export default function NoteForm({ note, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
    setError('');
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    onSubmit({ title: title.trim(), content: content.trim() });
    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <div className='note-form-overlay'>
      <form className='note-form' onSubmit={handleSubmit}>
        <h2>{note ? 'Edit Note' : 'Create Note'}</h2>

        {error && <div className='form-error'>{error}</div>}

        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter note title'
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='content'>Content</label>
          <textarea
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Enter note content'
            className='form-textarea'
            rows={8}
          />
        </div>

        <div className='form-actions'>
          <button type='submit' className='btn btn-primary'>
            {note ? 'Update' : 'Create'}
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
