import re
import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse

from backend.utils import pdf_parser
from backend.utils.vector_store import vector_store
from db.mongodb import db, get_expiration_time
from pydantic import BaseModel


router = APIRouter()
notes_collection = db["notes"]


def advanced_chunk_text(text: str, max_chunk_words: int = 100) -> list[str]:
    # Split text into sentences
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    current_chunk = []
    current_count = 0
    for sentence in sentences:
        sentence_word_count = len(sentence.split())
        if current_count + sentence_word_count > max_chunk_words and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentence]
            current_count = sentence_word_count
        else:
            current_chunk.append(sentence)
            current_count += sentence_word_count
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks


@router.post("/upload")
async def upload_note(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    folder: str = Form(None),
):
    # Retrieve session ID from header.
    session_id = request.headers.get("X-Session-Id")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header is required")

    note_id = str(uuid.uuid4())
    # file_extension = file.filename.split(".")[-1].lower()
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["pdf", "txt"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    content = await file.read()
    os.makedirs("data", exist_ok=True)
    file_path = os.path.join("data", f"{note_id}.{file_extension}")
    with open(file_path, "wb") as f:
        f.write(content)

    # Process the file: extract text for PDFs or decode for plain text
    if file_extension == "pdf":
        text = pdf_parser.extract_text_from_pdf(file_path)
    else:
        text = content.decode("utf-8")

    # Prepare note document with an expiration time.
    note_doc = {
        "note_id": note_id,
        "session_id": session_id,
        "title": title,
        "folder": folder,
        "file_path": file_path,
        "text": text,
        "created_at": datetime.now(timezone.utc),
        "expires_at": get_expiration_time(),
    }
    notes_collection.insert_one(note_doc)

    # Use advanced text chunking
    chunks = advanced_chunk_text(text)
    # Add chunks to the vector store.
    vector_store.add_documents(note_id, chunks)

    return {"message": "Note uploaded successfully", "note_id": note_id}


@router.get("/")
def list_notes(request: Request):
    session_id = request.headers.get("X-Session-Id")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header is required")
    notes = list(notes_collection.find({"session_id": session_id}, {"_id": 0}))
    return {"notes": notes}


@router.get("/{note_id}")
def get_note(note_id: str, request: Request):
    session_id = request.headers.get("X-Session-Id")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header is required")
    note = notes_collection.find_one({"note_id": note_id, "session_id": session_id}, {"_id": 0})
    if not note:
        return JSONResponse(status_code=404, content={"message": "Note not found"})
    return note

class NoteUpdateRequest(BaseModel):
    text: str
@router.put("/{note_id}")
async def update_note(note_id: str, request: Request, payload: NoteUpdateRequest):
    session_id = request.headers.get("X-Session-Id")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header is required")

    result = notes_collection.update_one(
        {"note_id": note_id, "session_id": session_id},
        {"$set": {"text": payload.text}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found or unauthorized")

    return {"message": "Note updated successfully"}