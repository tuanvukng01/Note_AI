import React, { useState } from 'react';
import { getSessionId } from '../utils/session';

interface NoteCreateProps {
  onNoteCreated: () => void;
}

const NoteCreate: React.FC<NoteCreateProps> = ({ onNoteCreated }) => {
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState('');
  const [message, setMessage] = useState('');

  const showMessage = (text: string, duration: number = 3000) => {
  setMessage(text);
  setTimeout(() => setMessage(''), duration);
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setMessage('Title is required');
      return;
    }
    if (mode === 'upload' && !file) {
      setMessage('Please select a file to upload');
      return;
    }
    if (mode === 'manual' && !manualText) {
      setMessage('Please enter note content');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    // formData.append('folder', folder);
    if (folder.trim().length > 0) {
      formData.append('folder', folder.trim());
    }
    // If using file upload, append file; if manual, convert text to a file-like blob.
    if (mode === 'upload' && file) {
      formData.append('file', file);
    } else if (mode === 'manual') {
      const blob = new Blob([manualText], { type: 'text/plain' });
      const manualFile = new File([blob], 'manual.txt', { type: 'text/plain' });
      formData.append('file', manualFile);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/upload`, {
        method: 'POST',
        headers: { 'X-Session-Id': getSessionId() },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(`Note created successfully (ID: ${data.note_id})`);
        setTitle('');
        setFolder('');
        setFile(null);
        setManualText('');
        onNoteCreated();
      } else {
        showMessage('Failed to create note. Please try again.');
      }
    } catch (error) {
      showMessage('Error creating note');
      if (import.meta.env.MODE === 'development') {
        console.error('Error creating note:', error);
      }
    }
  };

  return (
    <div style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
          New Note
        </h3>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '1rem', cursor: 'pointer' }}>
          <input
            type="radio"
            value="upload"
            checked={mode === 'upload'}
            onChange={() => setMode('upload')}
          />
          Upload File
        </label>
        <label style={{ cursor: 'pointer' }}>
          <input
            type="radio"
            value="manual"
            checked={mode === 'manual'}
            onChange={() => setMode('manual')}
          />
          Type Note
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '95%',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>
            Folder (optional):
          </label>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g., Work, Personal, etc."
            style={{
              width: '95%',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        {mode === 'upload' ? (
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>
              File (PDF or Text):
            </label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              required
            />
          </div>
        ) : (
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>
              Note Content:
            </label>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your note here..."
              style={{
                width: '100%',
                height: '80px',
                display: 'block',
                padding: '6px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
        )}
        <button
          type="submit"
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Note
        </button>
      </form>
      {message && <p style={{ marginTop: '0.5rem', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default NoteCreate;