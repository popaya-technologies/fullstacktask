/**
 * Middleware to validate that the request body contains a non-empty title.
 * Used for POST /api/notes and PUT /api/notes/:id.
 */
function validateNote(req, res, next) {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Trim whitespace before passing to route handler
  req.body.title = title.trim();
  if (req.body.content !== undefined) {
    req.body.content = req.body.content.trim();
  }

  next();
}

module.exports = { validateNote };
