import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, noteTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* KAIADMIN DIMMED BACKDROP */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* KAIADMIN PANEL CARD LAYOUT */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-sm w-full overflow-hidden transform relative z-10 animate__animated animate__fadeInUp animate__faster">
        
        {/* PANEL HEADER */}
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-500 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Action</span>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1 rounded"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT MESSAGE BODY */}
        <div className="p-6">
          <div className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to permanently delete the note:
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-800 text-center truncate">
              {noteTitle || "Untitled Workspace Note"}
            </div>
            <p className="mt-3 text-xs text-gray-400 italic">This change will immediately sync and update your relational MySQL tables.</p>
          </div>
        </div>

        {/* KAIADMIN UTILITY ACTION FOOTER */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            className="px-4 py-2 border border-gray-200 bg-white text-gray-500 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm hover:shadow flex items-center gap-1.5 transition-colors focus:outline-none"
            onClick={onConfirm}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}