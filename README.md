# 🧠 NoteAI — Your Intelligent Note Companion

NoteAI is a full-stack web application designed to help you effortlessly manage, organize, and query your notes using generative AI. Upload text or PDF notes, organize them into folders, and leverage powerful semantic search and AI-driven insights, all through an intuitive interface.

---

## 🔗 Live Demo

- 🌐 [Live Site](https://note-ai-frontend.vercel.app)

---

## 🚀 Key Features

- 📁 **Note Management:** Upload and neatly organize your notes (supports `.txt` and `.pdf`).
- 🔎 **Semantic Search:** Quickly find relevant information with chunk-based semantic search powered by vector embeddings.
- 🤖 **AI-Powered Queries:** Engage directly with your notes using Google Gemini 2 (Flash) or OpenAI GPT-3.5.
- 💬 **Interactive Chat:** Query notes through a natural chat-style interface.
- 🌗 **Dark Mode:** Toggle for comfortable reading in any lighting.
- 📄 **Example Notes:** Built-in notes for immediate testing and exploration.

---

## 🛠️ Tech Stack

### Frontend
- React, TypeScript
- CSS Modules
- Native `fetch` API
- Local state management

### Backend
- FastAPI (Python)
- MongoDB (note metadata storage)
- FAISS (semantic vector store)
- Google Gemini 2 (Flash) / OpenAI GPT-3.5

---

## ☁️ Deployment

- 🖥 **Frontend** deployed on [Vercel](https://vercel.com)
- 🔧 **Backend** deployed via **Google Cloud Run (GCP)**

---

## 🧪 How NoteAI Works

1. **Upload Notes:** Add your notes as PDFs or plain text files.
2. **Processing:** Notes are chunked and embedded into a semantic vector store.
3. **Semantic Retrieval:** Relevant chunks are retrieved when you query.
4. **Generative Response:** A prompt is dynamically constructed from chunks and answered by the AI.

---

## ⚙️ Setup Instructions

### Backend (FastAPI)

1. **Environment Setup:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate 
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   - OpenAI/Gemini API keys
   - MongoDB connection URI

4. **Start Server:**
   ```bash
   uvicorn app:app --reload
   ```

Server available at `http://127.0.0.1:8000`

---

### Frontend (React)

1. **Install Dependencies:**
   ```bash
   cd note_ai/
   npm install
   ```

2. **Configure `.env`:**
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

3. **Run Frontend:**
   ```bash
   npm run dev
   ```

App running at `http://localhost:5173`

---

## 📂 Project Structure

```
backend/
├── app.py
├── routes/
│   ├── notes.py
│   └── query.py
├── utils/
│   ├── vector_store.py
│   ├── llm_query.py
│   └── pdf_parser.py
└── db/
    └── mongodb.py

note_ai/
├── src/
│   ├── components/
│   │   ├── NoteList.tsx
│   │   ├── LLMChat.tsx
│   │   └── ...
│   ├── utils/
│   ├── styles/
│   └── App.tsx
```

---

## 🧠 Example Queries

Start by asking:
- "What cities will the traveler visit before Milan?"
- "Where is the traveler staying in Rome?"
- "Main activities planned in Paris?"

---

## 📌 Additional Information

- Designed primarily for local use but easy to extend for deployment.
- Easily switch between Google Gemini and OpenAI.

---

## 📜 License

© 2025 NoteAI. All rights reserved.

This software and its associated source code, assets, and documentation are proprietary and confidential. 

You may not:

- Copy, modify, distribute, or create derivative works based on this project
- Use this project for commercial or educational purposes
- Host or publish any part of this project publicly
- Integrate or embed this code into other applications

Use of this software is granted solely for personal, non-commercial evaluation purposes.  
For licensing inquiries or collaboration, please contact the author directly.
---

## ✨ Acknowledgments

- HuggingFace, Google AI, OpenAI for advanced AI tools
- [FAISS](https://github.com/facebookresearch/faiss), [SentenceTransformers](https://www.sbert.net/) for semantic search technology

