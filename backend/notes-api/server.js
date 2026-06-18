const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    title: 'Welcome to Notes',
    content: 'This is your first note. You can edit, delete, or create new notes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let nextId = 2

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' })
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content cannot be empty' })
  }

  const newNote = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  notes.push(newNote)
  res.status(201).json(newNote)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(n => n.id === id)

  if (!note) {
    return res.status(404).json({ error: 'Note not found' })
  }

  res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const { title, content } = req.body

  const note = notes.find(n => n.id === id)

  if (!note) {
    return res.status(404).json({ error: 'Note not found' })
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' })
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content cannot be empty' })
  }

  note.title = title.trim()
  note.content = content.trim()
  note.updatedAt = new Date().toISOString()

  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = notes.findIndex(n => n.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  const deletedNote = notes.splice(index, 1)
  res.json(deletedNote[0])
})

app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`)
})
