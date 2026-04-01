from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from pydantic import BaseModel, ConfigDict
from models.domain import Variant, GenomicDataset
from uuid import UUID

router = APIRouter()

class VariantOut(BaseModel):
    id: UUID
    chromosome: str
    position: int
    reference: str
    alternate: str

    model_config = ConfigDict(from_attributes=True)

class VariantCreate(BaseModel):
    chromosome: str
    position: int
    reference: str
    alternate: str

# Mock for now but querying from real db
@router.get("/variants/{dataset_id}", response_model=List[VariantOut])
async def get_variants(dataset_id: str, db: Session = Depends(get_db)):
    try:
        from uuid import UUID
        ds_id = UUID(dataset_id)
        variants = db.query(Variant).filter(Variant.dataset_id == ds_id).all()
        return variants
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid dataset UUID formulation")

@router.post("/variants", response_model=VariantOut)
async def create_variant(dataset_id: str, variant: VariantCreate, db: Session = Depends(get_db)):
    try:
        from uuid import UUID
        ds_id = UUID(dataset_id)
        
        # We need to ensure the dataset exists first to avoid silent FK failures
        ds = db.query(GenomicDataset).filter(GenomicDataset.id == ds_id).first()
        if ds is None:
            raise HTTPException(status_code=404, detail="Genomic Dataset not found")
        
        new_variant = Variant(
            dataset_id=ds_id,
            chromosome=variant.chromosome,
            position=variant.position,
            reference=variant.reference,
            alternate=variant.alternate
        )
        db.add(new_variant)
        db.commit()
        db.refresh(new_variant)
        return new_variant
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID formulation")
