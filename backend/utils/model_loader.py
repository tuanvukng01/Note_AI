import os

from sentence_transformers import SentenceTransformer
from backend.config import MODEL_NAME

def load_model():
    model = SentenceTransformer(MODEL_NAME, token=os.getenv("HUGGINGFACE_HUB_TOKEN"))
    return model

