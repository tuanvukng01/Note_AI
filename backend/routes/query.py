from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.utils.vector_store import vector_store
from backend.utils.llm_query import ask_question

router = APIRouter()


class QueryRequest(BaseModel):
    note_id: str
    question: str


@router.post("/")
def query_note(query_request: QueryRequest):
    # Retrieve relevant text chunks from the global vector store
    results = vector_store.search(query_request.question, k=3)

    # Filter the results to include only chunks from the specified note
    filtered_results = [res for res in results if res["note_id"] == query_request.note_id]
    if not filtered_results:
        raise HTTPException(status_code=404, detail="No relevant content found for the provided note ID.")

    context = "\n".join([item["text"] for item in filtered_results])
    answer = ask_question(context, query_request.question)
    return {"answer": answer}