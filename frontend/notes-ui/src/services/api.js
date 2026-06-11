import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getNotes = (page = 1) => api.get(`/notes?page=${page}`);

export const getNote = (id) => api.get(`/notes/${id}`);

export const createNote = (data) => api.post('/notes', data);

export const updateNote = (id, data) => api.put(`/notes/${id}`, data);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const searchNotes = (query, page = 1) =>
  api.get(`/notes/search?q=${encodeURIComponent(query)}&page=${page}`);
