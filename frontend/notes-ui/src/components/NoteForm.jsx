import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../config/api';
import './NoteForm.css'
const NoteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', pinned: false, tags: '' });

    // Load data if editing
    useEffect(() => {
        if (id) API.get(`/notes/${id}`).then((res) => setFormData(res.data));
    }, [id]);

    // Bonus: Auto-Save
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (id && formData.title) await API.put(`/notes/${id}`, formData);
        }, 2000);
        return () => clearTimeout(timer);
    }, [formData, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        id ? await API.put(`/notes/${id}`, formData) : await API.post('/notes', formData);
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <h2>{id ? 'Edit Note' : 'Create Note'}</h2>
            <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Title" required />
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Content..." />
            <input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="Tags (comma separated)" />
            <label>
                <input type="checkbox" checked={formData.pinned} onChange={(e) => setFormData({...formData, pinned: e.target.checked})} />
                Pin Note
            </label>
            <div className="actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>
        </form>
    );
};
export default NoteForm;