import React, { useRef, useEffect } from 'react';
import { Note } from '../App';
import '../styles/App.css';


interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onSelectNote }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [notes]);

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem',
        maxHeight: 'calc(100vh - 100px)',
      }}
    >
      {notes.length === 0 ? (
        <p style={{ padding: '0.5rem' }}>No notes in this folder.</p>
      ) : (
        notes.map((note) => {
          const snippet = note.text ? note.text.slice(0, 50) + '...' : '';
          const createdAt = new Date(note.created_at).toLocaleString();
          return (
            <div
              key={note.note_id}
              className="note-card"
              onClick={() => onSelectNote(note)}
              // onMouseOver={(e) =>
              //   (e.currentTarget.style.backgroundColor = '#ECECEC')
              // }
              // onMouseOut={(e) =>
              //   (e.currentTarget.style.backgroundColor = '#F8F8F8')
              // }
            >
              <h4 style={{ margin: '0 0 0.3rem 0' }}>{note.title}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {snippet}
              </p>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
                {createdAt}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default NoteList;