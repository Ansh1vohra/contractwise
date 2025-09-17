from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import numpy as np
from numpy import dot
from numpy.linalg import norm
from app.db import supabase
from app.auth import get_current_user
import ast
router = APIRouter()

class AskRequest(BaseModel):
    question: str

def mock_embedding(text: str, dim: int = 4):
    np.random.seed(abs(hash(text)) % (2**32))  # deterministic per text
    return np.random.rand(dim).tolist()

def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))

import ast  # safe way to parse string repr of list

def safe_embedding(raw):
    """Convert DB embedding (list or string) into list of floats"""
    if isinstance(raw, list):
        return [float(x) for x in raw]
    if isinstance(raw, str):
        try:
            return [float(x) for x in ast.literal_eval(raw)]
        except Exception:
            return []
    return []

@router.post("/")
def ask(req: AskRequest, current_user: str = Depends(get_current_user)):
    user_id = current_user

    # 1. Create query embedding
    query_vec = mock_embedding(req.question)

    # 2. Fetch all chunks for this user
    response = supabase.table("chunks").select("*").eq("user_id", user_id).execute()
    chunks = response.data

    if not chunks:
        raise HTTPException(status_code=404, detail="No documents found for this user.")

    # 3. Compute similarities (force embeddings into float[])
    # for chunk in chunks:
    #     embedding = [float(x) for x in chunk["embedding"]]
    #     chunk["similarity"] = cosine_similarity(query_vec, embedding)

    for chunk in chunks:
        embedding = safe_embedding(chunk["embedding"])
        if not embedding:
            chunk["similarity"] = -1  # skip invalid embeddings
        else:
            chunk["similarity"] = cosine_similarity(query_vec, embedding)

    # 4. Sort and pick top 3
    top_chunks = sorted(chunks, key=lambda x: x["similarity"], reverse=True)[:3]

    # 5. Mock AI answer
    answer = f"Based on your query, I found {len(top_chunks)} relevant clauses. Most relevant: '{top_chunks[0]['text_chunk'][:100]}...'"

    return {
        "answer": answer,
        "chunks": [
            {
                "text": c["text_chunk"],
                "similarity": round(c["similarity"], 3),
                "metadata": c["metadata"],
            }
            for c in top_chunks
        ],
    }
