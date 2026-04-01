-- BioNexus AI - Database Schema (PostgreSQL)

-- User Management
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('pharmaceutical', 'startup', 'academic', 'government', 'global_health')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'researcher', 'analyst')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Genomic Data
CREATE TABLE genomic_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT, -- NCBI, GISAID, etc.
    organism TEXT,
    raw_data_url TEXT,
    processed_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES genomic_datasets(id),
    chromosome TEXT,
    position INTEGER,
    reference TEXT,
    alternate TEXT,
    gene_target TEXT,
    clinical_significance TEXT,
    metadata JSONB
);

-- Drug Discovery
CREATE TABLE drugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    brand_names TEXT[],
    cas_number TEXT,
    molecular_weight FLOAT,
    chemical_formula TEXT,
    smiles TEXT,
    drugbank_id TEXT,
    pubchem_id TEXT,
    description TEXT,
    indication TEXT
);

CREATE TABLE drug_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drug_id UUID REFERENCES drugs(id),
    disease_target TEXT,
    confidence_score FLOAT,
    model_version TEXT,
    prediction_type TEXT CHECK (prediction_type IN ('repurposing', 'synergy', 'interaction')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disease Research
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    mondo_id TEXT,
    icd10_code TEXT,
    description TEXT
);

CREATE TABLE disease_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id),
    pathway_name TEXT,
    kegg_id TEXT,
    pathway_data JSONB
);
