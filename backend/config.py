import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")
MODEL_NAME = os.getenv("MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
FAISS_INDEX_FILE = os.getenv("FAISS_INDEX_FILE", "data/faiss.index")