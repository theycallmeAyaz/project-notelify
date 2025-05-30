import React, { useState } from 'react';
import NotesList from '../notes/NotesList';
import NoteEditor from '../notes/NoteEditor';
import EmptyState from '../ui/EmptyState';
import { useNotes } from '../../context/NotesContext';
import { Search, Plus, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { notes, loading } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreatingNote(false);
  };

  const handleCreateNewNote = () => {
    setSelectedNoteId(null);
    setIsCreatingNote(true);
  };

  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) 
    : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`w-full md:w-72 lg:w-80 bg-surface border-r border-neutral-light flex flex-col ${
        selectedNoteId || isCreatingNote ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-medium text-foreground">My Notes</h2>
          <button
            onClick={handleCreateNewNote}
            className="btn btn-primary p-2"
            aria-label="Create new note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-neutral-light rounded h-14" />
                ))}
              </div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <NotesList 
              notes={filteredNotes} 
              selectedNoteId={selectedNoteId}
              onNoteSelect={handleNoteSelect} 
            />
          ) : (
            <div className="p-6 text-center text-neutral">
              <BookOpen className="mx-auto h-8 w-8 mb-2" />
              <p>No notes found</p>
              {searchQuery && (
                <p className="text-sm mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-grow bg-background ${
        selectedNoteId || isCreatingNote ? 'flex' : 'hidden md:block'
      }`}>
        {selectedNote ? (
          <NoteEditor note={selectedNote} />
        ) : isCreatingNote ? (
          <NoteEditor isNew={true} />
        ) : (
          <EmptyState 
            icon={<BookOpen className="h-12 w-12 text-primary" />}
            title="No note selected"
            description="Select a note from the list or create a new one to get started."
            action={{
              label: "Create new note",
              onClick: handleCreateNewNote
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;