import React from 'react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { Note } from '../../types';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, selectedNoteId, onNoteSelect }) => {
  return (
    <div className="divide-y divide-neutral-light">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 cursor-pointer transition-colors duration-200 ${
            selectedNoteId === note.id
              ? 'bg-primary-light/10 border-l-4 border-primary'
              : 'hover:bg-neutral-light/10'
          }`}
          onClick={() => onNoteSelect(note.id)}
        >
          <h3 className="font-medium text-foreground truncate">
            {note.title || 'Untitled Note'}
          </h3>
          <p className="text-sm text-neutral truncate mt-1">
            {note.content.replace(/<[^>]*>/g, '') || 'No content'}
          </p>
          <div className="flex items-center mt-2 text-xs text-neutral">
            <span>
              {note.updatedAt
                ? `Edited ${formatDistanceToNow(note.updatedAt)}`
                : `Created ${formatDistanceToNow(note.createdAt)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;