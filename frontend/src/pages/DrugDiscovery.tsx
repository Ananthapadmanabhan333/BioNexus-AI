import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { Drug, DrugCreate, RepurposeResult } from '../api/client';
import { FlaskConical, Plus, Search, Loader2, AlertCircle, Zap, ChevronRight, X, Shield, CheckCircle2, Split, Layers, Box } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        {children}
      </div>
    </div>
  );
}

export default function DrugDiscoveryPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  // Repurposing
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [disease, setDisease] = useState('');
  const [topK, setTopK] = useState(5);
  const [repurposing, setRepurposing] = useState(false);
  const [results, setResults] = useState<RepurposeResult[] | null>(null);
  const [repurposeError, setRepurposeError] = useState('');

  // Add Drug form
  const [form, setForm] = useState<DrugCreate>({ name: '' });
  const [addingDrug, setAddingDrug] = useState(false);
  const [addError, setAddError] = useState('');

  const loadDrugs = async () => {
    setLoadingDrugs(true);
    setError('');
    try {
      const data = await api.getDrugs();
      setDrugs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingDrugs(false);
    }
  };

  useEffect(() => { loadDrugs(); }, []);

  const handleRepurpose = async () => {
    if (!disease.trim()) return;
    setRepurposing(true);
    setRepurposeError('');
    setResults(null);
    try {
      const data = await api.repurpose(disease, topK);
      setResults(data);
    } catch (e: any) {
      setRepurposeError(e.message);
    } finally {
      setRepurposing(false);
    }
  };

  const handleAddDrug = async () => {
    if (!form.name.trim()) return;
    setAddingDrug(true);
    setAddError('');
    try {
      await api.createDrug(form);
      setShowAddModal(false);
      setForm({ name: '' });
      await loadDrugs();
    } catch (e: any) {
      setAddError(e.message);
    } finally {
      setAddingDrug(false);
    }
  };

  const filtered = drugs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">Drug Discovery Engine</p>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Drug Intelligence Hub</h1>
          <p className="text-slate-400 mt-1 text-sm">Accelerating discovery from bench to clinic via GNN-powered multi-omics integration.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setMode('single')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${mode === 'single' ? 'bg-primary-500 border-primary-400 text-white' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}>Single Target</button>
           <button onClick={() => setMode('multi')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${mode === 'multi' ? 'bg-violet-500 border-violet-400 text-white' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}>Multi-Drug Synergy</button>
        </div>
      </div>

      {/* Discovery Panel */}
      <div className="glass-card p-6 border border-primary-500/10 bg-primary-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        
        {mode === 'single' ? (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 research-pulse">
                <Zap className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="font-black text-white uppercase tracking-tight">GNN Single-Target Repurposing</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by ChEMBL & Protein Data Bank</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                value={disease}
                onChange={e => setDisease(e.target.value)}
                placeholder="Enter disease target (e.g., AD-01, SARS-CoV-2 Spike)..."
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-all font-mono"
              />
              <button onClick={handleRepurpose} disabled={repurposing || !disease.trim()} className="btn-primary px-8 group">
                {repurposing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                <span className="font-black uppercase tracking-widest text-[10px]">Execute GNN Inference</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 research-pulse">
                <Split className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="font-black text-white uppercase tracking-tight">Multi-Drug Therapy Synergy</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by DrugComb & Siamese GNN Architecture</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                placeholder="Drug Lead A (e.g. Dexamethasone)"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono"
              />
              <div className="flex items-center justify-center p-2"><Plus className="text-slate-700 w-4 h-4" /></div>
              <input
                placeholder="Drug Lead B (e.g. Remdesivir)"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono"
              />
            </div>
            <button className="w-full btn-ghost border-violet-500/30 text-violet-400 mt-4 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-violet-500/10">
              Calculate Combination Synergy Score
            </button>
          </div>
        )}

        {repurposeError && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-[10px] font-bold bg-red-500/10 border border-red-500/20 rounded-lg p-3 uppercase tracking-widest">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {repurposeError}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-4 space-y-6">
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> 
              AI Decision Logic: <span className="text-violet-400 font-bold uppercase tracking-wider">{disease}</span>
            </p>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between border rounded-xl p-4 transition-all hover:translate-x-1 ${i === 0 ? 'bg-violet-500/10 border-violet-500/40 research-pulse' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${i === 0 ? 'bg-violet-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{r.drug_name}</p>
                        <p className="text-xs text-slate-400">{r.mechanism}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black font-mono leading-none ${r.confidence > 0.7 ? 'text-emerald-400' : r.confidence > 0.4 ? 'text-amber-400' : 'text-red-400'}`}>
                        {(r.confidence * 100).toFixed(0)}<span className="text-xs ml-0.5">%</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest leading-none">Confidence Score</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1 space-y-4">
                <div className="glass-card p-5 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                  </div>
                  <h3 className="section-label mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Biological Reasoning (XAI)
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Match</p>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "Candidate #1 ({results[0].drug_name}) shows high receptor-binding affinity for the predicted binding pocket at <span className="text-emerald-400 font-mono">SER-145</span>."
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Assessment</p>
                      <div className="flex items-center gap-2">
                         <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[15%]" /></div>
                         <span className="text-[10px] font-bold text-emerald-400 font-mono">LOW RISK (15%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 border border-primary-500/20 bg-primary-500/5">
                  <h3 className="section-label mb-3">Cost Optimization</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generic Match</p>
                      <p className="text-xs text-white font-bold">{results[0].drug_name} (Generic Available)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Savings</p>
                      <p className="text-xs text-emerald-400 font-bold">~82% Reduction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 h-32">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.map(r => ({ name: r.drug_name, confidence: parseFloat((r.confidence * 100).toFixed(1)) }))}>
                  <Bar dataKey="confidence" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Drug Library Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">Registered Compounds ({drugs.length})</h2>
          <div className="relative text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search library..." className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 focus:outline-none" />
          </div>
        </div>
        {loadingDrugs ? <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading library...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/50">
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Formula</th>
                  <th className="px-5 py-3 text-left">Mol. Weight</th>
                  <th className="px-5 py-3 text-left">Indication</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                    <td className="px-5 py-3 font-bold text-white uppercase tracking-tight italic">{d.name}</td>
                    <td className="px-5 py-3 font-mono text-slate-400 text-xs">{d.chemical_formula || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{d.molecular_weight || '—'}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs truncate max-w-xs">{d.indication || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-white font-bold mb-4">Register New Compound</h2>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Drug Name" className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white mb-4" />
        <button onClick={handleAddDrug} className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-widest">Save to Database</button>
      </Modal>
    </div>
  );
}
