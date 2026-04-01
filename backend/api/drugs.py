from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.main import RepurposeRequest, RepurposeResult, DrugOut, DrugCreate
from database import get_db
from models.domain import Drug
from analysis_engines.drug_discovery import DrugRepurposingEngine

router = APIRouter()
engine = DrugRepurposingEngine()

@router.post("/repurpose", response_model=List[RepurposeResult])
async def predict_repurposing(req: RepurposeRequest, db: Session = Depends(get_db)):
    # This endpoint now interfaces with the mock GNN model
    # Simulate searching through known compounds in the DB (or abstractly)
    
    # Example logic using the placeholder predict engine
    mock_score = engine.predict("CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5", "MPSS...")
    
    predictions = [
        RepurposeResult(drug_name="Metformin", confidence=0.89 * mock_score, mechanism="AMPK Activation"),
        RepurposeResult(drug_name="Ivermectin", confidence=0.45 * mock_score, mechanism="Viral Protease Inhibition")
    ]
    
    # Filter by top_k
    result = []
    for i, p in enumerate(predictions):
        if i < req.top_k:
            result.append(p)
    return result

@router.get("/drugs", response_model=List[DrugOut])
def get_drugs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    drugs = db.query(Drug).offset(skip).limit(limit).all()
    return drugs

@router.post("/drugs", response_model=DrugOut)
def create_drug(drug: DrugCreate, db: Session = Depends(get_db)):
    db_drug = Drug(**drug.model_dump())
    db.add(db_drug)
    db.commit()
    db.refresh(db_drug)
    return db_drug
