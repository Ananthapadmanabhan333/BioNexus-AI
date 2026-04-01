from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from api import drugs, genomics

app = FastAPI(
    title="BioNexus AI API",
    description="Advanced AI-powered bioinformatics infrastructure for drug discovery and genomic analysis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {
        "message": "Welcome to BioNexus AI Global Platform",
        "status": "Operational",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    from models.domain import Drug, GenomicDataset, Variant
    try:
        drug_count = db.query(Drug).count()
        dataset_count = db.query(GenomicDataset).count()
        variant_count = db.query(Variant).count()
        return {
            "status": "healthy",
            "database": "connected",
            "counts": {
                "drugs": drug_count,
                "datasets": dataset_count,
                "variants": variant_count
            }
        }
    except Exception as e:
        return {"status": "degraded", "error": str(e)}


@app.get("/stats")
async def get_platform_stats(db: Session = Depends(get_db)):
    from models.domain import Drug, GenomicDataset, Variant
    return {
        "drugs": db.query(Drug).count(),
        "datasets": db.query(GenomicDataset).count(),
        "variants": db.query(Variant).count(),
        "hpc_nodes": 1024,
        "throughput_seq_per_sec": 8780,
        "uptime_percent": 99.8,
        "avg_latency_ms": 42,
    }

from pipelines.data_ingestion import run_data_ingestion_pipeline
from models.domain import GenomicDataset
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List as PyList, Optional as PyOpt
import datetime

class DatasetOut(BaseModel):
    id: str
    title: str
    source: PyOpt[str]
    organism: PyOpt[str]
    created_at: PyOpt[datetime.datetime]
    class Config:
        from_attributes = True

@app.post("/data/ingest")
async def ingest_dataset(source: str, dataset_url: str):
    try:
        job_id = run_data_ingestion_pipeline(source=source, url=dataset_url)
        return {"message": f"Ingestion started for {source}", "job_id": job_id, "status": "processing"}
    except Exception as e:
        return {"message": "Ingestion Failed", "error": str(e)}

@app.get("/data/datasets")
async def list_datasets(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    datasets = db.query(GenomicDataset).offset(skip).limit(limit).all()
    return [
        {
            "id": str(d.id),
            "title": d.title,
            "source": d.source,
            "organism": d.organism,
            "raw_data_url": d.raw_data_url,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in datasets
    ]

@app.get("/sync/status")
async def get_sync_status():
    return [
        {"name": "NCBI GenBank", "status": "active", "last_sync": "2h ago", "progress": 100},
        {"name": "DrugBank v5.1", "status": "active", "last_sync": "6h ago", "progress": 100},
        {"name": "ENSEMBL GRCh38", "status": "syncing", "last_sync": "In progress", "progress": 68},
        {"name": "GISAID", "status": "scheduled", "last_sync": "Scheduled", "progress": 0},
    ]

app.include_router(genomics.router, prefix="/analysis/genomic", tags=["Genomic Analysis"])
app.include_router(drugs.router, prefix="/analysis/drug", tags=["Drug Discovery"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
