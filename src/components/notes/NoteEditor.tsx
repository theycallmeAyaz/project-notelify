import React, { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import { Note } from '../../types';
import { Save, Trash2, ArrowLeft } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  isNew?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, isNew = false }) => {
  const { addNote, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else if (isNew) {
      setTitle('');
      setContent('');
    }
  }, [note, isNew]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    try {
      console.log('Attempting to save note...');
      if (isNew) {
        console.log('Creating new note with data:', {
          title: title.trim() || 'Untitled Note',
          content: content.trim()
        });
        const noteId = await addNote({
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
        });
        console.log('New note created with ID:', noteId);
      } else if (note) {
        console.log('Updating existing note:', note.id);
        await updateNote(note.id, {
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        });
        console.log('Note updated successfully');
      }
    } catch (error) {
      console.error('Detailed save error:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        console.log('Attempting to delete note:', note.id);
        await deleteNote(note.id);
        console.log('Note deleted successfully');
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="flex items-center justify-between p-4 border-b border-neutral-light bg-surface">
        <button 
          className="btn p-2 md:hidden" 
          aria-label="Back to notes"
          onClick={() => {
            if (note) {
              // If editing existing note, go back to list
              window.history.back();
            } else {
              // If creating new note, cancel creation
              window.history.back();
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaving || (!title.trim() && !content.trim())}
            className="btn btn-primary"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </button>
          {!isNew && note && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col p-4 overflow-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-bold bg-transparent border-none outline-none mb-4 w-full"
        />
        
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;