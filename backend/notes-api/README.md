# Notes Management System - Backend API

A simple Express.js API for managing notes with full CRUD operations.

## Features

✅ Create notes  
✅ Get all notes  
✅ Get single note by ID  
✅ Update note  
✅ Delete note  
✅ Input validation  
✅ CORS enabled  
✅ Error handling  

## Tech Stack

- **Express.js 5** - Web framework
- **CORS** - Cross-origin requests support
- **Node.js** - Runtime

## Installation

```bash
npm install
```

## Development

Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Get all notes
```
GET /api/notes
Response: Array of note objects
```

### Create a note
```
POST /api/notes
Body: { "title": "string", "content": "string" }
Response: Created note object
```

### Get single note
```
GET /api/notes/:id
Response: Note object
```

### Update a note
```
PUT /api/notes/:id
Body: { "title": "string", "content": "string" }
Response: Updated note object
```

### Delete a note
```
DELETE /api/notes/:id
Response: Deleted note object
```

## Note Schema

```json
{
  "id": 1,
  "title": "Note Title",
  "content": "Note content...",
  "createdAt": "2026-06-17T10:00:00Z",
  "updatedAt": "2026-06-17T10:00:00Z"
}
```

## Validation

- Title must not be empty
- Content must not be empty
- Returns 400 for validation errors
- Returns 404 for not found errors
- Returns 201 for created resources
- Returns 200 for successful operations

## Error Responses

```json
{
  "error": "Error message"
}
```

## Data Storage

Currently uses in-memory storage. For production, integrate with:
- MongoDB
- PostgreSQL
- MySQL
- SQLite
- etc.

## CORS

All origins are allowed by default. Modify as needed:

```javascript
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}))
```

## Future Improvements

- Add database integration
- Add authentication
- Add rate limiting
- Add request logging
- Add input sanitization
- Add tests
