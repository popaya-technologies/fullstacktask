import React from 'react';
import { Pin, Trash2, Clock, Tag, Star, Archive, ArchiveRestore } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onToggleStar, onToggleArchive }) {
  const dateString = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  // Parse comma-separated tag data strings into a clean array
  const tagsArray = note.tags 
    ? note.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  return (
    <div className="w-full animate__animated animate__fadeIn">
      <div 
        onClick={() => onEdit(note)}
        className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md border-l-4 ${
          note.pinned ? 'border-l-amber-400' : 'border-l-transparent'
        } hover:border-l-kaiPrimary relative cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between min-h-[190px]`}
      >
        <div>
          {/* TOP RIGHT CORE ACTION TOGGLES */}
          <div className="absolute top-4 right-4 flex items-center space-x-1">
            {/* STAR TOGGLE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(note.id, note.starred);
              }}
              className="p-1 rounded-lg hover:bg-gray-50 group focus:outline-none transition-colors"
              title={note.starred ? "Unstar Note" : "Star Note"}
            >
              <Star 
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  note.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-amber-400'
                }`} 
              />
            </button>

            {/* PIN TOGGLE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onTogglePin(note.id, note.pinned);
              }}
              className="p-1 rounded-lg hover:bg-gray-50 group focus:outline-none transition-colors"
              title={note.pinned ? "Unpin Note" : "Pin Note"}
            >
              <Pin 
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  note.pinned ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-amber-400'
                }`} 
              />
            </button>
          </div>

          <h4 className="font-bold text-gray-900 pr-16 text-base truncate">{note.title}</h4>
          
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {note.content || <span className="italic text-gray-300">No content description.</span>}
          </p>
        </div>

        {/* BOTTOM METADATA SECTION */}
        <div className="mt-4">
          {/* TAG BADGE CHIPS CONTAINER */}
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tagsArray.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-blue-50 text-kaiPrimary text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* TIMELINE & SYSTEM ACTION FOOTER */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
              <Clock className="w-3 h-3 mr-1.5 text-gray-400" /> {dateString}
            </span>
            
            <div className="flex items-center space-x-1">
              {/* ARCHIVE / UNARCHIVE ACTION BUTTON */}
              <button 
                className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchive(note.id, note.archived);
                }}
                title={note.archived ? "Restore to Workspace" : "Archive Note"}
              >
                {note.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              </button>

              {/* PERMANENT DELETE ACTION BUTTON */}
              <button 
                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDelete(note.id);
                }}
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}