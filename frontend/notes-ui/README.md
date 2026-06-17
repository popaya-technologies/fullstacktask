# Notes Management System - Frontend

A modern, responsive React application for managing notes with create, read, update, delete, and search functionality.

## Features

✅ **Create Notes** - Add new notes with title and content  
✅ **View All Notes** - Display all notes in a responsive grid layout  
✅ **Edit Notes** - Update existing note titles and content  
✅ **Delete Notes** - Remove notes with confirmation  
✅ **Search Notes** - Search by title and content in real-time  
✅ **Sort by Recent** - Notes sorted by most recently updated  
✅ **Validation** - Title and content cannot be empty  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Visual feedback while fetching data  
✅ **Responsive Design** - Mobile, tablet, and desktop friendly  

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS variables
- **Fetch API** - HTTP requests

## Installation

```bash
npm install
```

## Development

Start the development server (runs on `http://localhost:3001`):

```bash
npm run dev
```

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Integration

The frontend expects a backend API at `http://localhost:3000/api` with these endpoints:

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a single note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Note Schema

```json
{
  "id": 1,
  "title": "Note Title",
  "content": "Note content...",
  "createdAt": "2026-06-17T10:00:00Z",
  "updatedAt": "2026-06-17T10:00:00Z"
}
```

## Project Structure

```
src/
├── components/
│   ├── NotesList.jsx
│   ├── NoteCard.jsx
│   ├── NoteForm.jsx
│   └── SearchBar.jsx
├── styles/
│   ├── index.css
│   ├── App.css
│   ├── NotesList.css
│   ├── NoteCard.css
│   ├── NoteForm.css
│   └── SearchBar.css
├── App.jsx
└── main.jsx
```

## Component Overview

- **App.jsx** - Main component managing state and API calls
- **NotesList.jsx** - Renders grid of note cards
- **NoteCard.jsx** - Individual note display with edit/delete buttons
- **NoteForm.jsx** - Form for creating and editing notes
- **SearchBar.jsx** - Search input for filtering notes

## Features Details

### Create Note
- Click "+ New Note" button to open form
- Enter title (max 100 chars) and content (max 5000 chars)
- Submit to create new note

### Search
- Type in search bar to filter by title or content
- Search is case-insensitive and real-time

### Edit Note
- Click "Edit" button on any note
- Form populates with current data
- Update and submit changes

### Delete Note
- Click "Delete" button on any note
- Confirmation dialog appears
- Note is permanently removed after confirmation

## Styling

Uses CSS variables for easy theming. Edit the `:root` section in `src/styles/index.css`:

```css
:root {
  --primary-color: #3b82f6;
  --danger-color: #ef4444;
  --background: #f9fafb;
  /* ... more colors ... */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Error Handling

- Shows user-friendly error messages
- Empty state when no notes exist
- Empty state when search returns no results
- Loading state while fetching data
- Form validation with error display

## Performance

- Uses React.useState and useEffect for state management
- Client-side search filtering
- Efficient re-renders using proper keys in lists
