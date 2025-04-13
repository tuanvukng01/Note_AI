// src/components/LLMChat.tsx
import React, { useState } from 'react';
import { getSessionId } from '../utils/session';
import '../styles/App.css'
import {Note} from "../App.tsx";
import ReactMarkdown from 'react-markdown';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface LLMChatProps {
  selectedNote: Note | null;
}

const LLMChat: React.FC<LLMChatProps> = ({selectedNote}) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!selectedNote) {
      console.error('No note selected');
      return;
    }
    if (!prompt.trim()) return;
    const userMessage: Message = { sender: 'user', text: prompt };
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/llm/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': getSessionId(),
          },
          body: JSON.stringify({
            context: selectedNote.text,
            question: prompt
          }),
        });
      const data = await response.json();
     if (response.ok) {
          const botMessage: Message = { sender: 'bot', text: data.response };
          setConversation(prev => [...prev, botMessage]);
        } else {
          const botMessage: Message = {
            sender: 'bot',
            text: 'Sorry, something went wrong while processing your request.',
          };
          setConversation(prev => [...prev, botMessage]);
        }
    } catch (err) {
        if (import.meta.env.MODE === 'development') {
          console.error('Error sending request:', err);
        }
      setConversation(prev => [
        ...prev,
        { sender: 'bot', text: 'Error sending request.' },

      ]);
    }
    setPrompt('');
    setLoading(false);
  };

  return (
      <div
        className="llm-chat-container"
        // style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   height: '100%',
        //   width: '100%',
        // }}
      >
        {/* Scrollable conversation area */}
        <div
          className="conversation"
          // style={{
          //   flex: 1,
          //   overflowY: 'auto',
          //   padding: '1rem',
          //   backgroundColor: '#fafafa',
          //   display: 'flex',
          //   flexDirection: 'column',
          //   justifyContent: 'flex-start',
          // }}
        >
          {conversation.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '1rem',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}
            >
              <div className="chat-bubble"
                // style={{
                //   display: 'inline-block',
                //   padding: '8px 12px',
                //   borderRadius: '8px',
                //   backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#E2E2E2',
                //   maxWidth: '80%',
                //   wordBreak: 'break-word',
                // }}
              >
                <ReactMarkdown skipHtml>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed input area */}
        <div
          className="input-area"
          // style={{
          //   padding: '1rem',
          //   borderTop: '1px solid #ccc',
          //   display: 'flex',
          //   alignItems: 'center',
          //   backgroundColor: '#fff',
          // }}
        >
          <input
              type="text"
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              disabled={loading}
            />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              marginLeft: '8px',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    );
};

export default LLMChat;