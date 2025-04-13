import React, { useState } from 'react';
import { getSessionId } from '../utils/session';
import { Note } from '../App.tsx';

interface NoteQueryProps {
  note: Note;
}

const NoteQuery: React.FC<NoteQueryProps> = ({ note }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/query/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': getSessionId(),
        },
        body: JSON.stringify({ note_id: note.note_id, question }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setError('Sorry, the server couldn’t answer your question.');
      }
    } catch (err) {
      setError('Error querying note');
      if (import.meta.env.MODE === 'development') {
          console.error('Error querying note:', err);
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a Question about "{note.title}"</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default NoteQuery;