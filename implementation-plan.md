# Notes Management System - Implementation Plan

## Overview

Build a full-stack Notes Management System with a REST API backend and a responsive frontend. The system allows users to create, view, edit, delete, and search notes.

---

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Backend  | Node.js + Express           |
| Database | SQLite (via better-sqlite3) |
| Frontend | React + Vite                |
| Styling  | Plain CSS / CSS Modules     |

> SQLite is chosen for simplicity — no external database server required. It supports all CRUD operations and efficient search via `LIKE` queries.

---

## Task 1: Backend Setup (`backend/notes-api/`)

### 1.1 Initialize Project

- Run `npm init -y` inside `backend/notes-api/`
- Install dependencies:
  ```
  npm install express better-sqlite3 cors
  npm install -D nodemon
  ```
- Add scripts to `package.json`:
  ```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
  ```

### 1.2 Project Structure

```
backend/notes-api/
├── db/
│   └── init.js          # Database initialization & schema
├── routes/
│   └── notes.js         # Notes CRUD route handlers
├── middleware/
│   └── validate.js      # Request validation middleware
├── server.js            # Express app entry point
├── package.json
└── notes.db             # SQLite database file (auto-created)
```

### 1.3 Database Schema

Single table `notes`:

| Column    | Type     | Constraints                |
| --------- | -------- | -------------------------- |
| id        | INTEGER  | PRIMARY KEY, AUTOINCREMENT |
| title     | TEXT     | NOT NULL                   |
| content   | TEXT     | DEFAULT ''                 |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP  |
| updatedAt | DATETIME | DEFAULT CURRENT_TIMESTAMP  |

### 1.4 API Endpoints

| Method | Endpoint             | Description          | Request Body         |
| ------ | -------------------- | -------------------- | -------------------- |
| GET    | /api/notes           | List all notes       | —                    |
| GET    | /api/notes/:id       | Get single note      | —                    |
| POST   | /api/notes           | Create a new note    | `{ title, content }` |
| PUT    | /api/notes/:id       | Update existing note | `{ title, content }` |
| DELETE | /api/notes/:id       | Delete a note        | —                    |
| GET    | /api/notes/search?q= | Search notes         | Query param `q`      |

### 1.5 Validation Rules

- `title` is required and must not be empty (on create and update)
- Return `400` with `{ error: "Title is required" }` if missing
- Return `404` with `{ error: "Note not found" }` if ID doesn't exist
- Return `500` with `{ error: "Internal server error" }` on unexpected errors

### 1.6 Implementation Order

1. `db/init.js` — Create SQLite connection, run `CREATE TABLE IF NOT EXISTS`
2. `routes/notes.js` — Implement all CRUD handlers
3. `middleware/validate.js` — Title validation middleware
4. `server.js` — Wire up Express, middleware, routes, CORS, error handling
5. Test all endpoints manually (curl or similar)

---

## Task 2: Frontend Setup (`frontend/notes-ui/`)

### 2.1 Initialize Project

- Scaffold with Vite:
  ```
  npm create vite@latest . -- --template react
  npm install
  ```
- Install additional dependency:
  ```
  npm install axios
  ```

### 2.2 Project Structure

```
frontend/notes-ui/
├── src/
│   ├── components/
│   │   ├── NotesList.jsx      # Displays all notes
│   │   ├── NoteCard.jsx       # Single note preview card
│   │   ├── NoteForm.jsx       # Create/Edit form
│   │   ├── NoteDetail.jsx     # Full note view
│   │   ├── SearchBar.jsx      # Search input
│   │   └── ConfirmDialog.jsx  # Delete confirmation
│   ├── services/
│   │   └── api.js             # Axios instance & API calls
│   ├── App.jsx                # Main app layout & routing
│   ├── App.css                # Global styles
│   └── main.jsx               # Entry point
├── index.html
├── package.json
└── vite.config.js             # Proxy /api to backend
```

### 2.3 Pages / Views

| View           | Description                                   |
| -------------- | --------------------------------------------- |
| Notes List     | Shows all notes as cards, sorted by updatedAt |
| Create Note    | Form with title + content fields              |
| Edit Note      | Same form, pre-filled with existing data      |
| Note Detail    | Full content view with edit/delete actions    |
| Search Results | Filtered list based on search query           |

### 2.4 Key UI Behaviors

- **Loading state**: Show "Loading..." spinner while fetching data
- **Empty state**: Show "No notes found. Create your first note!" message
- **Error state**: Show error banner with retry option on API failure
- **Delete confirmation**: Show a confirmation dialog before deleting
- **Auto-update timestamp**: `updatedAt` handled by backend automatically
- **Responsive**: Works on mobile (single column) and desktop (grid layout)

### 2.5 API Service (`services/api.js`)

```js
// Key functions:
getNotes(); // GET /api/notes
getNote(id); // GET /api/notes/:id
createNote(data); // POST /api/notes
updateNote(id, data); // PUT /api/notes/:id
deleteNote(id); // DELETE /api/notes/:id
searchNotes(query); // GET /api/notes/search?q=query
```

### 2.6 Vite Proxy Config

Proxy `/api` requests to backend during development:

```js
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### 2.7 Implementation Order

1. `services/api.js` — API layer
2. `App.jsx` — Layout with state management (useState for notes, active view)
3. `NotesList.jsx` + `NoteCard.jsx` — Display notes
4. `SearchBar.jsx` — Search functionality
5. `NoteForm.jsx` — Create and edit forms
6. `NoteDetail.jsx` — Full note view
7. `ConfirmDialog.jsx` — Delete confirmation
8. `App.css` — Responsive styling

---

## Task 3: Integration & Testing

### 3.1 Run Both Servers

```bash
# Terminal 1 — Backend (port 3000)
cd backend/notes-api && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend/notes-ui && npm run dev
```

### 3.2 Manual Testing Checklist

- [ ] Create a note with title and content
- [ ] Create a note without title — expect error
- [ ] View all notes in list — sorted by updatedAt
- [ ] Click a note to view full details
- [ ] Edit a note — verify updatedAt changes
- [ ] Delete a note — confirm dialog appears, note removed
- [ ] Search notes by title keyword
- [ ] Search notes by content keyword
- [ ] Empty state shows when no notes exist
- [ ] Error handling when backend is down
- [ ] Responsive layout on small screens

---

## Task 4: Bonus Features (Optional)

| Feature   | Approach                                           |
| --------- | -------------------------------------------------- |
| Tags      | Add `tags` column (comma-separated), filter by tag |
| Pin notes | Add `pinned` boolean column, sort pinned first     |
| Auto-save | Debounce content changes, auto-call PUT endpoint   |

---

## Summary

| Item       | Details                                       |
| ---------- | --------------------------------------------- |
| Backend    | Express + SQLite REST API                     |
| Frontend   | React + Vite SPA                              |
| Database   | SQLite single `notes` table                   |
| Endpoints  | 6 (CRUD + search)                             |
| Components | 6 (List, Card, Form, Detail, Search, Confirm) |
| Est. Time  | ~6-8 hours for core features                  |
