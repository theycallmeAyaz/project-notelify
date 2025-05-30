import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Note } from '../types';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  addNote: (data: Partial<Note>) => Promise<string>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setNotes([]);
      setLoading(false);
      return;
    }

    console.log('Setting up real-time listener for user:', auth.currentUser.uid);
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    try {
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('Received snapshot update');
          const notesData: Note[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            notesData.push({
              id: doc.id,
              title: data.title || '',
              content: data.content || '',
              userId: data.userId,
              createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
            });
          });
          console.log('Updated notes:', notesData);
          setNotes(notesData);
          setLoading(false);
        }, 
        (error) => {
          console.error("Error in real-time listener:", error);
          setLoading(false);
          // Show error to user
          alert('Error loading notes. Please refresh the page.');
        }
      );

      return () => {
        console.log('Cleaning up real-time listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      setLoading(false);
      alert('Error setting up note synchronization. Please refresh the page.');
    }
  }, [auth.currentUser]);

  const addNote = async (data: Partial<Note>): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    try {
      console.log('Current user:', auth.currentUser.uid);
      const noteData = {
        title: data.title || 'Untitled Note',
        content: data.content || '',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      console.log('Creating note with data:', noteData);
      
      const docRef = await addDoc(collection(db, 'notes'), noteData);
      console.log('Note created successfully with ID:', docRef.id);
      
      // Optimistically update the UI
      setNotes(prevNotes => [{
        id: docRef.id,
        title: noteData.title,
        content: noteData.content,
        userId: noteData.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, ...prevNotes]);
      
      return docRef.id;
    } catch (error: any) {
      console.error('Detailed add note error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }
  };

  const updateNote = async (id: string, data: Partial<Note>): Promise<void> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    try {
      console.log('Updating note:', id);
      const noteRef = doc(db, 'notes', id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(noteRef, updateData);
      console.log('Note updated successfully');
      
      // Optimistically update the UI
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...data, updatedAt: new Date().toISOString() }
          : note
      ));
    } catch (error: any) {
      console.error('Detailed update error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    try {
      console.log('Attempting to delete note:', id);
      const noteRef = doc(db, 'notes', id);
      await deleteDoc(noteRef);
      console.log('Note deleted successfully');
      
      // Optimistically update the UI
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error: any) {
      console.error('Detailed delete error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }
  };

  const value = {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};