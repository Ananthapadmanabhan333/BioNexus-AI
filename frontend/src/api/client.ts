// Central API client — all backend connections live here
const BASE_URL = 'http://localhost:8000';

export interface Drug {
  id: string;
  name: string;
  brand_names?: string[];
  molecular_weight?: number;
  chemical_formula?: string;
  smiles?: string;
  drugbank_id?: string;
  pubchem_id?: string;
  description?: string;
  indication?: string;
}

export interface DrugCreate {
  name: string;
  brand_names?: string[];
  molecular_weight?: number;
  chemical_formula?: string;
  smiles?: string;
  drugbank_id?: string;
  pubchem_id?: string;
  description?: string;
  indication?: string;
}

export interface RepurposeResult {
  drug_name: string;
  confidence: number;
  mechanism: string;
}

export interface Variant {
  id: string;
  chromosome: string;
  position: number;
  reference: string;
  alternate: string;
}

export interface Dataset {
  id: string;
  title: string;
  source?: string;
  organism?: string;
  raw_data_url?: string;
  created_at?: string;
}

export interface PlatformStats {
  drugs: number;
  datasets: number;
  variants: number;
  hpc_nodes: number;
  throughput_seq_per_sec: number;
  uptime_percent: number;
  avg_latency_ms: number;
}

export interface HealthStatus {
  status: string;
  database?: string;
  counts?: { drugs: number; datasets: number; variants: number };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => apiFetch<HealthStatus>('/health'),
  stats: () => apiFetch<PlatformStats>('/stats'),

  // Drugs
  getDrugs: (skip = 0, limit = 100) => apiFetch<Drug[]>(`/analysis/drug/drugs?skip=${skip}&limit=${limit}`),
  createDrug: (drug: DrugCreate) => apiFetch<Drug>('/analysis/drug/drugs', { method: 'POST', body: JSON.stringify(drug) }),

  // Drug Repurposing (GNN)
  repurpose: (disease: string, top_k = 5) =>
    apiFetch<RepurposeResult[]>('/analysis/drug/repurpose', {
      method: 'POST',
      body: JSON.stringify({ disease, top_k }),
    }),

  // Genomic Datasets
  getDatasets: () => apiFetch<Dataset[]>('/data/datasets'),
  ingestDataset: (source: string, dataset_url: string) =>
    apiFetch<{ message: string; job_id: string; status: string }>(
      `/data/ingest?source=${encodeURIComponent(source)}&dataset_url=${encodeURIComponent(dataset_url)}`,
      { method: 'POST' }
    ),

  // Genomic Variants
  getVariants: (dataset_id: string) => apiFetch<Variant[]>(`/analysis/genomic/variants/${dataset_id}`),

  // Sync Status
  getSyncStatus: () => apiFetch<any[]>('/sync/status'),
};
