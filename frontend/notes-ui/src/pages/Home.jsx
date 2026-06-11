import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import './Home.css';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchNotes = async (query = "") => {
        try {
            setLoading(true);
            const res = await API.get(`/notes?q=${query}`);
            // Sort by pinned status (true first)
            const sorted = res.data.sort((a, b) => b.pinned - a.pinned);
            setNotes(sorted);
        } catch (err) {
            setError("Unable to load notes.");
        } finally {
            setLoading(false);
        }
    };

    // Triggered when clicking delete
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevents the card's onClick from triggering
        if (window.confirm("Are you sure you want to delete this note?")) {
            await API.delete(`/notes/${id}`);
            fetchNotes(); // Re-fetch to update the UI
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    return (
        <div className="home-container">
            <header>
                <h1>My Notes</h1>
                <input type="text" placeholder="Search..." onChange={(e) => fetchNotes(e.target.value)} />
                <button onClick={() => navigate('/create')}>+ New Note</button>
            </header>

            {loading ? <div className="status">Loading...</div> : 
             error ? <div className="status error">{error}</div> : 
             notes.length === 0 ? <div className="status">No notes found.</div> :
             <div className="notes-grid">
                {notes.map((note) => (
                    <div 
                        key={note.id} 
                        className={`note-card ${note.pinned ? 'pinned' : ''}`} 
                        onClick={() => navigate(`/edit/${note.id}`)}
                    >
                        <h3>{note.pinned ? '📌 ' : ''}{note.title}</h3>
                        <p>{note.preview}</p>
                        <small>Updated: {new Date(note.updatedAt).toLocaleDateString()}</small>
                        
                        <button 
                            className="delete-btn"
                            onClick={(e) => handleDelete(e, note.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>}
        </div>
    );
};
export default Home;