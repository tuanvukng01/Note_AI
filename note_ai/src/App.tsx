import React, { useEffect, useState } from 'react';
import NoteCreate from './components/NoteCreate';
import FolderList from './components/FolderList';
import NoteList from './components/NoteList';
import NoteContent from './components/NoteContent';
import LLMChat from './components/LLMChat';
import { getSessionId } from './utils/session';
import './styles/App.css';
import logo from './assets/logo.png';

export interface Note {
  note_id: string;
  title: string;
  file_path: string;
  text: string;
  created_at: string;
  expires_at: string;
  folder?: string;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showFolderList, setShowFolderList] = useState(true);
  const [showLLMChat, setShowLLMChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  console.log(`URL: ${import.meta.env.VITE_API_BASE_URL}`)
  const defaultNote = {
  note_id: 'default-note',
  title: '🌍 Example: Spring 2025 Eurotrip Itinerary',
  file_path: '',
  text: `Welcome to NoteAI! Here's a travel note you can use to test the AI assistant.

Try asking questions like:
- What cities will be visited before Milan?
- When is the Colosseum night tour planned?
- What’s the dress code for the Vatican?
- How long will the trip last?
- Where is the traveler staying in Rome?
- Which flight returns to Helsinki?
- What are the main activities in Paris?

---

Trip Name: Spring 2025 Eurotrip  
Duration: 10 days  
Travel Dates: April 16 – April 25, 2025  
Travel Style: Fast-paced city exploration, cultural sightseeing, food-focused

---

Departure & Return  
- Departing from Helsinki (Finnair, evening of April 15)  
- Returning from Rome to Helsinki (Norwegian, morning of April 26)  

---

Itinerary Overview:

1. Paris, France – April 16–17  
   - Arrive early morning via overnight flight  
   - Visit: Eiffel Tower, Musée d'Orsay, Montmartre  
   - Dinner reservation at Le Relais de l’Entrecôte  

2. Lyon, France – April 17–18  
   - Take evening train from Paris  
   - Try bouchon-style dining, explore Vieux Lyon  

3. Milan, Italy – April 18–19  
   - Morning train from Lyon  
   - Visit: Duomo di Milano, Navigli district  
   - Optional: Day trip to Lake Como if weather is good  

4. Rome, Italy – April 19–25  
   - Stay in Trastevere district  
   - Highlights: Vatican City, Colosseum night tour, Roman Forum  
   - Last 2 days reserved for slow-paced local exploring and gelato tasting

---

Packing Reminders  
- Passport, Eurail Pass, charger, converter plug  
- Vatican dress code: no shorts or sleeveless tops  
- Spring weather: 15–20°C, light rain expected

---

This sample illustrates how NoteAI can extract useful answers from structured notes like travel plans.`,
  created_at: new Date().toISOString(),
  expires_at: '',
};


  const fetchNotes = async () => {
      // console.log(`Fetching notes from: ${import.meta.env.VITE_API_BASE_URL}/notes/`);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/`, {
        headers: { 'X-Session-Id': getSessionId() },
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(data.notes);
        setNotes([defaultNote, ...data.notes]);
      }
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('Error fetching notes:', error);
        }
    }

  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes =
    selectedFolder === 'All'
      ? notes
      : notes.filter((note) => note.folder === selectedFolder);

  useEffect(() => {
    if (filteredNotes.length > 0) {
      setSelectedNote(filteredNotes[0]);
    } else {
      setSelectedNote(null);
    }
  }, [selectedFolder, notes]);

  const handleNoteCreated = () => {
    fetchNotes();
  };

  return (
   <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {/* Top Toolbar */}
      <header className="top-toolbar">
          <div className="logo-wrapper" style={{ cursor: 'pointer' }} onClick={() => setShowLLMChat(false)}>
            <img src={logo} alt="NoteAI logo" className="logo" />
        </div>
          <div className="toolbar-right">
              <button
                className="toolbar-btn"
                onClick={() => setShowLLMChat((prev) => !prev)}
                title="Toggle Chat"
              >
                {showLLMChat ? 'Notes' : 'Chat'}
              </button>
              <button
                className="toolbar-btn"
                onClick={() => setDarkMode((prev) => !prev)}
                title="Toggle Dark Mode"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
        </header>

      {/* Layout for both modes */}
      <div className="main-content" style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>

        {/* Folder & Note List */}
        {!showLLMChat && (
          <aside className={`folder-sidebar ${showFolderList ? 'open' : 'closed'}`}>
            <button
              className="folder-toggle-btn"
              onClick={() => setShowFolderList((prev) => !prev)}
              title={showFolderList ? 'Hide folders' : 'Show folders'}
            >
              {showFolderList ? '‹' : '›'}
            </button>
            {showFolderList && (
              <FolderList
                notes={notes}
                selectedFolder={selectedFolder}
                onSelectFolder={setSelectedFolder}
              />
            )}
          </aside>
        )}

        {/* Note sidebar*/}
        <div className="note-sidebar">
          <div className="note-sidebar-header">
            <button
              className="note-create-btn"
              onClick={() => setShowNotePopup((prev) => !prev)}
              title="Create new note"
            >
              +
            </button>
          </div>

          {showNotePopup && (
            <div className="note-create-popup">
              <NoteCreate
                onNoteCreated={() => {
                  handleNoteCreated();
                  setShowNotePopup(false);
                }}
              />
            </div>
          )}

          <NoteList notes={filteredNotes} onSelectNote={setSelectedNote} />
        </div>

        {/* Note Content Area */}
        <div
          className="note-content"
          style={{
            flex: showLLMChat ? 0.6 : 1,
            borderRight: showLLMChat ? '1px solid #ccc' : 'none',
            overflowY: 'auto',
          }}
        >
          {selectedNote ? (
           <NoteContent
              note={selectedNote}
              onNoteUpdated={fetchNotes}
              // showLLMChat={showLLMChat}
              // setShowLLMChat={setShowLLMChat}
            />
          ) : (
            <div className="empty-state" style={{ padding: '1rem' }}>
              Select a note to view its content.
            </div>
          )}
        </div>

        {/* LLMChat */}
        <div
          className="chat-card-wrapper"
          style={{
            flex: 0.4,
            display: showLLMChat ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="chat-card"
            style={{
              width: '100%',
              height: '100%',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <LLMChat selectedNote={selectedNote} />
          </div>
        </div>
      </div>
     <footer className="footer">
    <p>
      © {new Date().getFullYear()} NoteAI. All rights reserved.
    </p>
  </footer>
    </div>
  );
};

export default App;