const db = require('../config/db');

// @desc    Get notes filtered by view type (active, archived, starred)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { search, view } = req.query; // Capture incoming folder context view

    // Base SQL filter definition query
    let sql = 'SELECT * FROM notes WHERE 1=1';
    let params = [];

    // FILTER ROUTING ENGINE MATRIX
    if (view === 'archived') {
      sql += ' AND archived = 1'; // Show ONLY archived notes
    } else if (view === 'starred') {
      sql += ' AND starred = 1 AND archived = 0'; // Show starred notes that are NOT archived
    } else {
      sql += ' AND archived = 0'; // Default view: Show only active, non-archived notes
    }

    // Process matching text parameters if the search field contains data
    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    // Sort pinning parameters first, followed by descending modified entries
    sql += ' ORDER BY pinned DESC, updatedAt DESC';

    const [rows] = await db.execute(sql, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Fetch filtering crashed:', error);
    return res.status(500).json({ error: 'Database error fetching filtered items.' });
  }
};

// @desc    Create a new note entry
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, pinned, tags, starred, archived } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Validation Error: Title must not be empty' });
    }

    const sql = 'INSERT INTO notes (title, content, pinned, tags, starred, archived) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [
      title.trim(),
      content || '',
      pinned ? 1 : 0,
      tags || null,
      starred ? 1 : 0,
      archived ? 1 : 0
    ]);

    const [newRow] = await db.execute('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    return res.status(201).json(newRow[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database write error' });
  }
};

// @desc    Update an existing note instance including its binary storage flags
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, pinned, tags, starred, archived } = req.body;

    const [exists] = await db.execute('SELECT * FROM notes WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Note target resource not found' });
    }

    // Fallback merge checks to ensure database records don't accidentally lose properties if left unprovided
    const mergedTitle = title !== undefined ? title : exists[0].title;
    const mergedContent = content !== undefined ? content : exists[0].content;
    const mergedPinned = pinned !== undefined ? (pinned ? 1 : 0) : exists[0].pinned;
    const mergedTags = tags !== undefined ? tags : exists[0].tags;
    const mergedStarred = starred !== undefined ? (starred ? 1 : 0) : exists[0].starred;
    const mergedArchived = archived !== undefined ? (archived ? 1 : 0) : exists[0].archived;

    if (mergedTitle.trim() === '') {
      return res.status(400).json({ error: 'Validation Error: Title must not be empty' });
    }

    const sql = 'UPDATE notes SET title = ?, content = ?, pinned = ?, tags = ?, starred = ?, archived = ? WHERE id = ?';
    await db.execute(sql, [mergedTitle, mergedContent, mergedPinned, mergedTags, mergedStarred, mergedArchived, id]);

    const [updatedRow] = await db.execute('SELECT * FROM notes WHERE id = ?', [id]);
    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database update failed.' });
  }
};

// @desc    Permanently drop a note instance
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM notes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true, message: 'Cleanly dropped from storage.' });
  } catch (error) {
    return res.status(500).json({ error: 'Delete execution failed' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };