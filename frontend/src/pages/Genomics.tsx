import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { Dataset, Variant } from '../api/client';
import { Dna, Database, Plus, Loader2, AlertCircle, Search, Upload, ChevronRight, GitBranch } from 'lucide-react';

export default function GenomicsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDS, setLoadingDS] = useState(true);
  const [dsError, setDsError] = useState('');
  const [selectedDS, setSelectedDS] = useState<Dataset | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variantError, setVariantError] = useState('');
  const [variantSearch, setVariantSearch] = useState('');

  // Ingestion form
  const [source, setSource] = useState('');
  const [datasetUrl, setDatasetUrl] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<{ message: string; job_id: string; status: string } | null>(null);
  const [ingestError, setIngestError] = useState('');

  const loadDatasets = async () => {
    setLoadingDS(true); setDsError('');
    try { setDatasets(await api.getDatasets()); }
    catch (e: any) { setDsError(e.message); }
    finally { setLoadingDS(false); }
  };

  useEffect(() => { loadDatasets(); }, []);

  const handleSelectDataset = async (ds: Dataset) => {
    setSelectedDS(ds);
    setVariants([]);
    setVariantError('');
    setLoadingVariants(true);
    try {
      const v = await api.getVariants(ds.id);
      setVariants(v);
    } catch (e: any) {
      setVariantError(e.message);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleIngest = async () => {
    if (!source.trim() || !datasetUrl.trim()) return;
    setIngesting(true); setIngestResult(null); setIngestError('');
    try {
      const r = await api.ingestDataset(source, datasetUrl);
      setIngestResult(r);
      await loadDatasets();
    } catch (e: any) {
      setIngestError(e.message);
    } finally {
      setIngesting(false);
    }
  };

  const filteredVariants = variants.filter(v =>
    v.chromosome?.toLowerCase().includes(variantSearch.toLowerCase()) ||
    v.reference?.toLowerCase().includes(variantSearch.toLowerCase()) ||
    v.alternate?.toLowerCase().includes(variantSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="section-label mb-1">Genomics Pipeline</p>
        <h1 className="text-3xl font-bold text-white">Genomic Datasets & Variant Analysis</h1>
        <p className="text-slate-400 mt-1 text-sm">Ingest datasets from NCBI/GISAID, browse genomic datasets, and inspect called variants.</p>
      </div>

      {/* Ingestion Panel */}
      <div className="glass-card p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Upload className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-white">Data Ingestion Pipeline</h2>
            <p className="text-xs text-slate-500">Submit a source and URL to trigger the automated ingestion pipeline (NCBI, DrugBank, PubChem, GISAID)</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Data Source</label>
            <select value={source} onChange={e => setSource(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500/60">
              <option value="">Select Source…</option>
              {['NCBI', 'GISAID', 'DrugBank', 'PubChem', 'ENSEMBL', 'UniProt'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-slate-400 font-semibold mb-1 block">Dataset URL / Accession</label>
            <input value={datasetUrl} onChange={e => setDatasetUrl(e.target.value)} placeholder="https://ftp.ncbi.nlm.nih.gov/…" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/60" />
          </div>
          <div className="flex items-end">
            <button onClick={handleIngest} disabled={ingesting || !source || !datasetUrl.trim()} className="btn-primary w-full text-sm justify-center disabled:opacity-50">
              {ingesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Start Ingestion
            </button>
          </div>
        </div>
        {ingestError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4" /> {ingestError}
          </div>
        )}
        {ingestResult && (
          <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm">
            <p className="text-emerald-400 font-semibold">✓ {ingestResult.message}</p>
            <p className="text-slate-400 text-xs mt-1 font-mono">Job ID: {ingestResult.job_id} · Status: {ingestResult.status}</p>
          </div>
        )}
      </div>

      {/* Two columns: datasets + variants */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Dataset List */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-sm">Genomic Datasets</h2>
              <p className="text-xs text-slate-500">{datasets.length} records in database</p>
            </div>
            <button onClick={loadDatasets} className="text-xs text-primary-400 hover:text-primary-300 font-medium">Refresh</button>
          </div>
          {loadingDS ? (
            <div className="flex items-center justify-center py-10 gap-2 text-slate-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
          ) : dsError ? (
            <div className="m-4 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{dsError}</div>
          ) : datasets.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-slate-500 text-sm">
              <Database className="w-8 h-8 opacity-30" />
              <p>No datasets yet. Ingest data above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800 max-h-[480px] overflow-y-auto">
              {datasets.map(ds => (
                <button key={ds.id} onClick={() => handleSelectDataset(ds)} className={`w-full text-left px-5 py-3.5 hover:bg-slate-800/50 transition-colors flex items-center justify-between group ${selectedDS?.id === ds.id ? 'bg-primary-500/10 border-l-2 border-primary-500' : 'border-l-2 border-transparent'}`}>
                  <div>
                    <p className={`text-sm font-medium ${selectedDS?.id === ds.id ? 'text-primary-400' : 'text-slate-200'}`}>{ds.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ds.source} · {ds.organism}</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{ds.id.slice(0, 18)}…</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Variant Table */}
        <div className="lg:col-span-3 glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-sm">
                {selectedDS ? `Variants — ${selectedDS.title}` : 'Select a dataset to view variants'}
              </h2>
              {selectedDS && <p className="text-xs text-slate-500">{variants.length} variants found</p>}
            </div>
            {selectedDS && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input value={variantSearch} onChange={e => setVariantSearch(e.target.value)} placeholder="Filter variants…" className="bg-slate-900 border border-slate-700 rounded pl-7 pr-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-primary-500/60 w-36" />
              </div>
            )}
          </div>
          {!selectedDS ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-600">
              <GitBranch className="w-10 h-10 opacity-30" />
              <p className="text-sm">Click a dataset on the left to explore its variants</p>
            </div>
          ) : loadingVariants ? (
            <div className="flex items-center justify-center py-10 gap-2 text-slate-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Fetching variants…</div>
          ) : variantError ? (
            <div className="m-4 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{variantError}</div>
          ) : filteredVariants.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-slate-500 text-sm">
              <Dna className="w-8 h-8 opacity-30" />
              <p>No variants found for this dataset.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-950">
                  <tr className="border-b border-slate-800">
                    {['Chr', 'Position', 'Reference', 'Alternate', 'UUID'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVariants.map((v, i) => (
                    <tr key={v.id} className={`border-b border-slate-800/40 hover:bg-slate-800/30 ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                      <td className="px-4 py-2.5 font-mono text-emerald-400 font-bold">{v.chromosome}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">{v.position.toLocaleString()}</td>
                      <td className="px-4 py-2.5 font-mono text-amber-400">{v.reference}</td>
                      <td className="px-4 py-2.5 font-mono text-rose-400">{v.alternate}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{v.id.slice(0, 16)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
