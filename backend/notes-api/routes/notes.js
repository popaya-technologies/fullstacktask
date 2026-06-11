const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { validateNote } = require('../middleware/validate');

/**
 * GET /api/notes?page=1&limit=10
 * List notes with pagination, sorted by most recently updated.
 */
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  try {
    const notes = db
      .prepare('SELECT * FROM notes ORDER BY updatedAt DESC LIMIT ? OFFSET ?')
      .all(limit, offset);

    const { total } = db.prepare('SELECT COUNT(*) as total FROM notes').get();

    res.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/notes/search?q=query&page=1&limit=10
 * Search notes by title and content with pagination.
 */
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.json({
      notes: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  try {
    const searchTerm = `%${q.trim()}%`;
    const notes = db
      .prepare(
        'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updatedAt DESC LIMIT ? OFFSET ?',
      )
      .all(searchTerm, searchTerm, limit, offset);

    const { total } = db
      .prepare(
        'SELECT COUNT(*) as total FROM notes WHERE title LIKE ? OR content LIKE ?',
      )
      .get(searchTerm, searchTerm);

    res.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error searching notes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/notes/:id
 * Get a single note by ID.
 */
router.get('/:id', (req, res) => {
  try {
    const note = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/notes
 * Create a new note.
 */
router.post('/', validateNote, (req, res) => {
  const { title, content = '' } = req.body;

  try {
    const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    const result = stmt.run(title, content);

    const newNote = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(result.lastInsertRowid);
    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/notes/:id
 * Update an existing note. updatedAt is set automatically.
 */
router.put('/:id', validateNote, (req, res) => {
  const { title, content = '' } = req.body;

  try {
    // Check if note exists
    const existing = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const stmt = db.prepare(
      'UPDATE notes SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    );
    stmt.run(title, content, req.params.id);

    const updated = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/notes/:id
 * Delete a note by ID.
 */
router.delete('/:id', (req, res) => {
  try {
    // Check if note exists
    const existing = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
