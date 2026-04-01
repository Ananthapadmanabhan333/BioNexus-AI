from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class DrugBase(BaseModel):
    name: str
    brand_names: Optional[List[str]] = []
    cas_number: Optional[str] = None
    molecular_weight: Optional[float] = None
    chemical_formula: Optional[str] = None
    smiles: Optional[str] = None
    drugbank_id: Optional[str] = None
    pubchem_id: Optional[str] = None
    description: Optional[str] = None
    indication: Optional[str] = None

class DrugCreate(DrugBase):
    pass

class DrugOut(DrugBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)

class DrugPredictionBase(BaseModel):
    drug_id: UUID
    disease_target: str
    confidence_score: float
    model_version: str
    prediction_type: str
    metadata_json: Optional[Dict[str, Any]] = None

class DrugPredictionCreate(DrugPredictionBase):
    pass

class DrugPredictionOut(DrugPredictionBase):
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# For drug repurposing input
class RepurposeRequest(BaseModel):
    disease: str
    top_k: int = 5

class RepurposeResult(BaseModel):
    drug_name: str
    confidence: float
    mechanism: str
