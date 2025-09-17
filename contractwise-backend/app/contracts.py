from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.db import supabase
from app.auth import get_current_user
import uuid

router = APIRouter()

class ContractCreate(BaseModel):
    filename: str
    expiry_date: Optional[str] = None
    status: Optional[str] = "Active"
    risk_score: Optional[str] = "Low"

class ContractOut(BaseModel):
    doc_id: str
    filename: str
    uploaded_on: str
    expiry_date: Optional[str]
    status: Optional[str]
    risk_score: Optional[str]

def mock_parse(filename: str):
    """
    Fake parsing step: returns deterministic chunks
    with embeddings already as lists of floats.
    """
    return {
        "document_id": str(uuid.uuid4()),
        "chunks": [
            {
                "chunk_id": str(uuid.uuid4()),
                "text": "Termination clause: Either party may terminate with 90 days’ notice.",
                "embedding": [0.12, -0.45, 0.91, 0.33],  # stored as float[]
                "metadata": {"page": 2, "contract_name": filename}
            },
            {
                "chunk_id": str(uuid.uuid4()),
                "text": "Liability cap: Limited to 12 months’ fees.",
                "embedding": [0.01, 0.22, -0.87, 0.44],
                "metadata": {"page": 5, "contract_name": filename}
            }
        ]
    }

# ----- Routes -----
@router.post("/upload")
def upload_contract(contract: ContractCreate, user_id: str = Depends(get_current_user)):
    # Insert document
    doc_res = supabase.table("documents").insert({
        "user_id": user_id,
        "filename": contract.filename,
        "expiry_date": contract.expiry_date,
        "status": contract.status,
        "risk_score": contract.risk_score,
    }).execute()

    if not doc_res.data:
        raise HTTPException(status_code=500, detail="Error inserting contract")

    doc = doc_res.data[0]
    doc_id = doc["doc_id"]

    # Parse into chunks
    parsed = mock_parse(contract.filename)

    # Insert chunks with embeddings as JSON array of floats
    for c in parsed["chunks"]:
        supabase.table("chunks").insert({
            "chunk_id": c["chunk_id"],
            "doc_id": doc_id,
            "user_id": user_id,
            "text_chunk": c["text"],
            "embedding": c["embedding"],   # ✅ stays as list of floats
            "metadata": c["metadata"]
        }).execute()

    return {"message": "Contract uploaded & parsed", "document": doc, "chunks": parsed["chunks"]}

@router.get("/", response_model=List[ContractOut])
def list_contracts(user_id: str = Depends(get_current_user)):
    res = supabase.table("documents").select("*").eq("user_id", user_id).execute()
    return res.data

@router.get("/{doc_id}", response_model=ContractOut)
def get_contract(doc_id: str, user_id: str = Depends(get_current_user)):
    res = supabase.table("documents").select("*").eq("doc_id", doc_id).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return res.data[0]
