// src/components/NoteContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../App';
import { getSessionId } from '../utils/session';

interface NoteContentProps {
  note: Note;
  onNoteUpdated: () => void;
  // showLLMChat: boolean;
  // setShowLLMChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteContent: React.FC<NoteContentProps> = ({ note, onNoteUpdated}) => {
  const [content, setContent] = useState(note.text);
  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState('');
  // const[showLLMChat, setShowLLMChat] = useState(false);

  const showMessage = (text: string, duration: number = 3000) => {
  setMessage(text);
  setTimeout(() => setMessage(''), duration);
};

  useEffect(() => {
    setContent(note.text);
  }, [note]);

  const handleSave = async () => {
    // Assumes backend PUT endpoint exists at /notes/{note_id}
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${note.note_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': getSessionId(),
        },
        body: JSON.stringify({ text: content }),
      });
      const data = await response.json();
      if (response.ok) {
          showMessage('Note updated successfully');
          setEditable(false);
          onNoteUpdated();
        } else {
          if (import.meta.env.MODE === 'development') {
              console.error('Update error:', data);
          }
          showMessage('Failed to update note. Please try again.');
        }
    } catch (error) {
      showMessage('Error updating note');
        if (import.meta.env.MODE === 'development') {
            console.error('Error updating note:', error);
        }
    }
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(note.text);
  }, [note]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [note]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Mini toolbar / title */}
      <div
        style={{
          borderBottom: '1px solid #ddd',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0 }}>{note.title}</h2>
        <div>
          {!editable ? (
            <button
              onClick={() => setEditable(true)}
              style={{
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '8px',
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditable(false);
                  setContent(note.text);
                }}
                style={{
                  backgroundColor: '#ccc',
                  color: '#000',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

            </>
          )}
        {/*    <button*/}
        {/*  onClick={() => setShowLLMChat((prev) => !prev)}*/}
        {/*  style={{*/}
        {/*    backgroundColor: '#6c757d',*/}
        {/*    color: '#fff',*/}
        {/*    border: 'none',*/}
        {/*    padding: '6px 12px',*/}
        {/*    borderRadius: '4px',*/}
        {/*    cursor: 'pointer',*/}
        {/*    marginLeft: '8px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {showLLMChat ? 'Notes' : 'Chat'}*/}
        {/*</button>*/}
        </div>
      </div>

      {message && (
        <p style={{ padding: '0.5rem', color: 'green', margin: 0 }}>{message}</p>
      )}

      {/* Note content area */}
      <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 50px)', // adjust based on header size
        }}>
        {editable ? (
          <textarea
            style={{
              width: '100%',
              height: 'calc(100vh - 160px)',
              fontSize: '1rem',
              lineHeight: '1.4',
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <pre
            style={{
              margin: 0,
              fontSize: '1rem',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};

export default NoteContent;