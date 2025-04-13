import React, { useRef, useEffect } from 'react';
import { Note } from '../App';

interface FolderListProps {
  notes: Note[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  notes,
  selectedFolder,
  onSelectFolder,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [notes]);

  const folders = ['All', ...Array.from(
    new Set(
      notes
        .map((note) => note.folder)
        .filter((folder): folder is string => typeof folder === 'string' && folder.trim().length > 0)
    )
  )];
  // folders.unshift('All');

  return (
    <div
      ref={scrollRef}
      style={{
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 50px)', // adjust based on header
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontWeight: 600, fontSize: '1rem' }}>
        Folders
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {folders.map((folder) => (
          <li key={folder} style={{ marginBottom: '0.5rem' }}>
            <button
              className={`folder-item-btn ${folder === selectedFolder ? 'selected' : ''}`}
              onClick={() => onSelectFolder(folder)}
            >
              {folder}
          </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderList;