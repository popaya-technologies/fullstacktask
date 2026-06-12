import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, CheckCircle, RefreshCw, Tag } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, activeNote, fetchNotes, API_URL }) {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pinned, setPinned] = useState(false);
    const [tags, setTags] = useState('');
    const [starred, setStarred] = useState(false);
    const [archived, setArchived] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [autosaveStatus, setAutosaveStatus] = useState('');
    const [showToast, setShowToast] = useState(false);

    const autoSaveTimer = useRef(null);

    // Synchronize internal form parameters when target reference updates
    useEffect(() => {
        if (activeNote) {
            setId(activeNote.id || '');
            setTitle(activeNote.title || '');
            setContent(activeNote.content || '');
            setPinned(activeNote.pinned === 1 || activeNote.pinned === true);
            setTags(activeNote.tags || '');
            setStarred(activeNote.starred === 1 || activeNote.starred === true);
            setArchived(activeNote.archived === 1 || activeNote.archived === true);
        } else {
            setId('');
            setTitle('');
            setContent('');
            setPinned(false);
            setTags('');
            setStarred(false);
            setArchived(false);
        }
        setTitleError(false);
        setAutosaveStatus('');
    }, [activeNote, isOpen]);

    // Asynchronous Debounced Auto-save Mechanism loop
    const triggerAutoSave = (field, value) => {
        if (field === 'content') setContent(value);
        if (field === 'tags') setTags(value);

        if (!title.trim()) return; // Stop auto-save execution if title is blank

        setAutosaveStatus('Typing...');
        clearTimeout(autoSaveTimer.current);

        autoSaveTimer.current = setTimeout(async () => {
            setShowToast(true);
            const payload = {
                title: title.trim(),
                content: field === 'content' ? value : content,
                pinned,
                tags: field === 'tags' ? value : tags,
                starred,
                archived
            };
            try {
                if (id) {
                    await axios.put(`${API_URL}/${id}`, payload);
                } else {
                    const res = await axios.post(API_URL, payload);
                    const returnedId = res.data && (res.data.id || (Array.isArray(res.data) ? res.data[0]?.id : null));
                    if (returnedId) setId(returnedId);
                }
                setAutosaveStatus('Saved');
                fetchNotes();
            } catch (err) {
                console.error("Database cloud syncing failure:", err);
                setAutosaveStatus('Error saving');
            } finally {
                setTimeout(() => setShowToast(false), 600);
            }
        }, 1000); // Triggers exactly 1000ms after the user stops typing
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setTitleError(true);
            return;
        }

        const payload = { title: title.trim(), content, pinned, tags: tags.trim(), starred, archived };
        try {
            if (id) {
                await axios.put(`${API_URL}/${id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            onClose();
            fetchNotes();
        } catch (err) {
            console.error("Failed completing database manual write execution:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden transform relative z-10 animate__animated animate__zoomIn animate__faster">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                        {id ? 'Modify Note View' : 'Create Note'}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 focus:outline-none" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* WORKSPACE FIELDS */}
                <div className="p-6 space-y-4">
                    {/* TITLE INPUT */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Note Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${titleError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-kaiPrimary'
                                }`}
                            placeholder="Enter title..."
                        />
                        {titleError && <div className="text-red-500 text-xs mt-1 font-medium">Title field is required!</div>}
                    </div>

                    {/* TAGS / CATEGORIES INPUT */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Tags / Categories
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => triggerAutoSave('tags', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kaiPrimary transition-colors"
                            placeholder="e.g. work, final, draft (comma separated)"
                        />
                    </div>

                    {/* CONTENT TEXTAREA */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0">Workspace Content</label>
                            <span className={`text-[11px] font-semibold flex items-center ${autosaveStatus === 'Saved' ? 'text-green-500' : 'text-gray-400'}`}>
                                {autosaveStatus === 'Typing...' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                                {autosaveStatus === 'Saved' && <CheckCircle className="w-3 h-3 mr-1 text-green-500" />}
                                {autosaveStatus}
                            </span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => triggerAutoSave('content', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-kaiPrimary resize-none transition-colors"
                            rows="5"
                            placeholder="Start typing thoughts down..."
                        />
                    </div>

                    {/* PIN TOGGLE ACCENT SWITCH */}
                    <div className="flex items-center space-x-3 pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kaiPrimary"></div>
                            <span className="ml-3 text-sm font-semibold text-gray-600">Keep note pinned to top of board</span>
                        </label>
                    </div>
                </div>

                {/* CONTROL FOOTER BUTTONS */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-200 text-gray-500 bg-white rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors focus:outline-none" onClick={onClose}>
                        Close
                    </button>
                    <button className="px-5 py-2 bg-kaiPrimary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-colors focus:outline-none" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>

            {/* FLOATING HUD TOAST AUTO-SAVE INDICATOR */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 border border-gray-800 text-white px-5 py-3 rounded-full text-xs font-medium shadow-2xl flex items-center space-x-3 animate__animated animate__fadeInUp">
                    <div className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent text-kaiPrimary rounded-full"></div>
                    <span>Auto-saving modifications directly to MySQL...</span>
                </div>
            )}
        </div>
    );
}