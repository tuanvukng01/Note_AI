import faiss
import numpy as np
from backend.utils.model_loader import load_model


class VectorStore:
    def __init__(self, embedding_dim: int):
        self.embedding_dim = embedding_dim
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.documents = []
        self.model = load_model()

    def add_documents(self, note_id: str, texts: list[str]):
        embeddings = self.model.encode(texts)
        embeddings = np.array(embeddings).astype("float32")
        self.index.add(embeddings)
        for text in texts:
            self.documents.append({"note_id": note_id, "text": text})

    def search(self, query: str, k: int = 3):
        query_embedding = self.model.encode([query])
        query_embedding = np.array(query_embedding).astype("float32")
        if self.index.ntotal == 0:
            return []
        D, I = self.index.search(query_embedding, k)
        results = []
        for idx in I[0]:
            if idx < len(self.documents):
                results.append(self.documents[idx])
        return results

_model = load_model()
embedding_dim = _model.get_sentence_embedding_dimension()
vector_store = VectorStore(embedding_dim)