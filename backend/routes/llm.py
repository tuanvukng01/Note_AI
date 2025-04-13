# This is test for a local LLM model using the Hugging Face Transformers library.
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from utils.llama_model import get_llama_pipeline
# import re
#
#
# router = APIRouter()
#
# class LLMQueryRequest(BaseModel):
#     prompt: str
#
# @router.post("/llm/query")
# def query_llm(query: LLMQueryRequest):
#     try:
#
#         pipe = get_llama_pipeline()
#         output = pipe(query.prompt, max_length=512, num_return_sequences=1, truncation=True)
#         generated_text = output[0]['generated_text']
#         # Remove prompt from the generated text
#         if query.prompt in generated_text:
#             response_only = generated_text.split(query.prompt, 1)[-1].strip()
#         else:
#             response_only = generated_text.strip()
#         # response_only = generated_text[len(query.prompt):].strip()
#         # response_only = re.sub(r'\*', '•', response_only)
#         return {"response": response_only}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.utils.gemini_model import get_gemini_response

router = APIRouter()

# LLMQueryRequest model with both context and question.
class LLMQueryRequest(BaseModel):
    context: str
    question: str

@router.post("/llm/query")
def query_llm(query: LLMQueryRequest):
    try:
        prompt = (
            f"Context:\n{query.context}\n\n"
            f"Question:\n{query.question}\n\n"
            "Answer:"
        )
        response = get_gemini_response(prompt)
        return {"response": response.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))