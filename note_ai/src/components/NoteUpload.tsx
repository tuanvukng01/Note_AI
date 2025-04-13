import React, { useState, ChangeEvent, FormEvent } from 'react';
import { getSessionId } from '../utils/session';

const NoteUpload: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('Please provide both a title and a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/upload`, {

        method: 'POST',
        headers: { 'X-Session-Id': getSessionId() },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Note uploaded successfully (ID: ${data.note_id})`);
        setTitle('');
        setFile(null);
        onUpload();
      } else {
        // console.error('Upload error:', data);
        setMessage('Failed to upload note. Please try again.');
      }
    } catch (error) {
       if (import.meta.env.MODE === 'development') {
          console.error('Error uploading note:', error);
    }
       setMessage('Error uploading note');
    }
  };

  return (
    <div>
      <h2>Upload a Note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>File (PDF or Text): </label>
          <input type="file" accept=".pdf,.txt" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NoteUpload;