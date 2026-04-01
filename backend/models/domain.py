from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
import uuid
import datetime
from database import Base

# Polyfill for UUID if using SQLite
from sqlalchemy.types import TypeDecorator, CHAR


class GUID(TypeDecorator):
    """Platform-independent GUID type."""

    impl = CHAR

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                # hexstring
                return "%.32x" % value.int

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value


class Organization(Base):
    __tablename__ = "organizations"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship(
        "User", back_populates="organization", cascade="all, delete-orphan"
    )


class User(Base):
    __tablename__ = "users"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    role = Column(String)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")


class GenomicDataset(Base):
    __tablename__ = "genomic_datasets"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    source = Column(String)
    organism = Column(String)
    raw_data_url = Column(String)
    processed_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    variants = relationship(
        "Variant", back_populates="dataset", cascade="all, delete-orphan"
    )


class Variant(Base):
    __tablename__ = "variants"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(GUID(), ForeignKey("genomic_datasets.id"))
    chromosome = Column(String)
    position = Column(Integer)
    reference = Column(String)
    alternate = Column(String)
    gene_target = Column(String)
    clinical_significance = Column(String)
    metadata_json = Column(JSON)  # Renamed to not conflict with SQLAlchemy metadata

    dataset = relationship("GenomicDataset", back_populates="variants")


class Drug(Base):
    __tablename__ = "drugs"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    # Note: ARRAY(String) is Postgres-specific. For SQLite compatibility, you might need a JSON column instead in production mixed environments.
    # Using JSON for brand_names here to ensure SQLite compatibility by default.
    brand_names = Column(JSON)
    cas_number = Column(String)
    molecular_weight = Column(Float)
    chemical_formula = Column(String)
    smiles = Column(String)
    drugbank_id = Column(String)
    pubchem_id = Column(String)
    description = Column(String)
    indication = Column(String)

    predictions = relationship(
        "DrugPrediction", back_populates="drug", cascade="all, delete-orphan"
    )


class DrugPrediction(Base):
    __tablename__ = "drug_predictions"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    drug_id = Column(GUID(), ForeignKey("drugs.id"))
    disease_target = Column(String)
    confidence_score = Column(Float)
    model_version = Column(String)
    prediction_type = Column(String)
    metadata_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    drug = relationship("Drug", back_populates="predictions")


class Disease(Base):
    __tablename__ = "diseases"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    mondo_id = Column(String)
    icd10_code = Column(String)
    description = Column(String)

    pathways = relationship(
        "DiseasePathway", back_populates="disease", cascade="all, delete-orphan"
    )


class DiseasePathway(Base):
    __tablename__ = "disease_pathways"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    disease_id = Column(GUID(), ForeignKey("diseases.id"))
    pathway_name = Column(String)
    kegg_id = Column(String)
    pathway_data = Column(JSON)

    disease = relationship("Disease", back_populates="pathways")
