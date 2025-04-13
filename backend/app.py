from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import notes, query
from backend.routes import llm
import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

app = FastAPI(title="NoteAI — Smart Note Companion")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(query.router, prefix="/query", tags=["query"])
app.include_router(llm.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)