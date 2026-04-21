"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Note {
  id: string;
  date: string;
  completedAt: string | null;
  lessonId: string;
  parentNotes: string;
}

export default function NotesHistoryPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load notes', err);
        setLoading(false);
      });
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.parentNotes);
  };

  const handleSave = async (id: string) => {
    try {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, note: editContent })
      });
      setEditingId(null);
      fetchNotes(); // Reload to get updated data
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE'
      });
      fetchNotes(); // Reload
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading notes...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-12 p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
         <Link href="/" className="text-blue-500 font-semibold hover:underline flex items-center">
            <span className="mr-2">←</span> Back to Dashboard
         </Link>
         <h1 className="text-2xl font-bold text-gray-800">Parent Notes History</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        {notes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            No parent notes found yet. Complete a session and leave a note to see it here!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <div className="font-bold text-gray-700">
                  Lesson: <span className="text-blue-600">{note.lessonId}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 font-medium">
                    {new Date(note.completedAt || note.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex gap-3 border-l border-gray-300 pl-4">
                    {editingId !== note.id && (
                      <button onClick={() => handleEdit(note)} className="text-blue-500 hover:text-blue-700 text-sm font-semibold transition-colors">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {editingId === note.id ? (
                <div className="flex flex-col gap-3">
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] text-gray-800"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => handleSave(note.id)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{note.parentNotes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
