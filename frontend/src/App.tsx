import { useState, useEffect } from 'react';
import {
  Dna, Activity, FlaskConical, Database,
  Network, Server, Shield, Globe, Award,
  BarChart2, BookOpen, CheckCircle2, ExternalLink,
  ArrowRight, Cpu, Zap, Menu, X, Loader2, Plus, AlertCircle, Search, Upload, ChevronRight, GitBranch, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { CountUp } from './components/CountUp';
import DashboardPage from './pages/Dashboard';
import GenomicsPage from './pages/Genomics';
import DrugDiscoveryPage from './pages/DrugDiscovery';
import ThreeLabPage from './pages/ThreeLab';
import GlobalIntelligencePage from './pages/GlobalIntelligence';

// ─── Data ────────────────────────────────────────────────────────────────────
const modelAccuracy = [
  { subject: 'Variant Calling', value: 97 },
  { subject: 'Drug Target', value: 94 },
  { subject: 'Pathway Pred', value: 89 },
  { subject: 'Toxicity', value: 92 },
  { subject: 'Synergy', value: 86 },
];

const throughputData = [
  { time: '00h', genomic: 3200, drug: 2100, pathway: 1800 },
  { time: '04h', genomic: 2800, drug: 1800, pathway: 2200 },
  { time: '08h', genomic: 6200, drug: 4100, pathway: 3800 },
  { time: '12h', genomic: 9500, drug: 6800, pathway: 5500 },
  { time: '16h', genomic: 8200, drug: 5900, pathway: 4900 },
  { time: '20h', genomic: 7100, drug: 4400, pathway: 3600 },
  { time: '24h', genomic: 5400, drug: 3800, pathway: 3000 },
];

const publications = [
  { title: 'Graph Neural Networks for Cross-Species Drug Repurposing at Scale', journal: 'Nature Methods', year: '2025', citations: 142 },
  { title: 'Automated Genomic Variant Prioritization Using Transformer Architectures', journal: 'Genome Research', year: '2025', citations: 89 },
  { title: 'HPC-Accelerated Protein-Drug Interaction Prediction via BioNexus', journal: 'Cell Systems', year: '2024', citations: 201 },
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-2xl">
        <p className="text-slate-400 font-mono mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Navigation Config ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview', icon: Activity, label: 'Platform Overview', group: 'Main' },
  { id: 'dashboard', icon: BarChart2, label: 'Operations Dashboard', group: 'Main' },
  { id: 'genomics', icon: Dna, label: 'Genomics Pipeline', group: 'Research' },
  { id: 'discovery', icon: FlaskConical, label: 'Drug Discovery', group: 'Research' },
  { id: 'threelab', icon: Cpu, label: '3D Molecular Lab', group: 'Research' },
  { id: 'pathways', icon: Network, label: 'Pathway Analytics', group: 'Research' },
  { id: 'sentinel', icon: Globe, label: 'Global Sentinel', group: 'Infrastructure' },
  { id: 'data', icon: Database, label: 'Data Integration', group: 'Infrastructure' },
  { id: 'hpc', icon: Server, label: 'HPC Cluster', group: 'Infrastructure' },
  { id: 'research', icon: BookOpen, label: 'Publications', group: 'Research' },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose }: { active: string; onNav: (id: string) => void; open: boolean; onClose: () => void }) {
  const groups = ['Main', 'Research', 'Infrastructure'];

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500/15 border border-primary-500/30 rounded-lg flex items-center justify-center">
              <Dna className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">BioNexus <span className="text-primary-400">AI</span></p>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Natl. Research Initiative</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-500"><X className="w-4 h-4" /></button>
        </div>

        {/* Backend status indicator */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 font-semibold">API ONLINE</span>
            <span className="text-slate-600 ml-auto">:8000</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {groups.map(group => {
            const items = NAV_ITEMS.filter(n => n.group === group);
            return (
              <div key={group}>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2 mb-1.5">{group}</p>
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onNav(item.id); onClose(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                      active === item.id
                        ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-l-2 border-transparent font-medium'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Platform Phase */}
        <div className="px-4 py-5 border-t border-slate-800 bg-slate-900/30">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
            <span>Enterprise Core</span>
            <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">v1.4.2 Production</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-slate-400"><Menu className="w-5 h-5" /></button>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> SQLite · bionexus.db</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5"><Server className="w-3 h-3" /> FastAPI v1.0 @ :8000</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> GNN Model v4.2.1</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-400 transition-colors border border-slate-700 px-3 py-1.5 rounded-lg hover:border-primary-500/50">
          <ExternalLink className="w-3.5 h-3.5" /> API Docs
        </a>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Platform Sync Active</span>
        </div>
      </div>
    </header>
  );
}

// ─── Platform Overview (Landing) ─────────────────────────────────────────────
function OverviewPage({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-10 md:p-14 shiny-sweep">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
          <Dna className="w-80 h-80 text-primary-400 floating" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-5">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute animate-ping h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">National Bioinformatics Initiative — Live</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
            ACCELERATING <br />
            <span className="text-primary-500">DRUG DISCOVERY</span> <br />
            AT NATIONAL SCALE
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            BioNexus AI integrates petabyte-scale genomic databases, Graph Neural Networks, and distributed HPC compute to find tomorrow's cures — years faster.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'dashboard', icon: BarChart2, label: 'View Dashboard', primary: true },
              { id: 'genomics', icon: Dna, label: 'Genomics Pipeline', primary: false },
              { id: 'discovery', icon: FlaskConical, label: 'Drug Discovery', primary: false },
            ].map(b => (
              <button key={b.id} onClick={() => onNav(b.id)} className={b.primary ? 'btn-primary' : 'btn-ghost'}>
                <b.icon className="w-4 h-4" /> {b.label} {b.primary && <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { icon: Shield, text: 'ICMR Approved', color: 'text-emerald-400' },
              { icon: Award, text: 'DBT Funded', color: 'text-amber-400' },
              { icon: Globe, text: '12 Global Partners', color: 'text-primary-400' },
            ].map((b, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm font-medium ${b.color}`}>
                <b.icon className="w-4 h-4" /> {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Platform Scale</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { value: 45, suffix: 'B+', label: 'Genomic Records', icon: Database, color: 'text-primary-400' },
            { value: 3204, suffix: '', label: 'Drug Candidates', icon: FlaskConical, color: 'text-violet-400' },
            { value: 1024, suffix: '', label: 'HPC Nodes', icon: Cpu, color: 'text-emerald-400' },
            { value: 98, suffix: '%', label: 'GNN Accuracy', icon: Activity, color: 'text-amber-400' },
            { value: 12, suffix: '', label: 'Intl Partners', icon: Globe, color: 'text-sky-400' },
            { value: 42, suffix: 'ms', label: 'Avg Latency', icon: Zap, color: 'text-rose-400' },
          ].map((s, i) => (
            <div key={i} className="stat-card text-center">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <div className={`text-2xl font-black font-mono ${s.color} mb-0.5`}>
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter italic">Research <span className="gradient-text">Core Modules</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'dashboard', icon: BarChart2, name: 'Operations Hub', desc: 'Live HPC telemetry, pipeline job monitoring, and global network visibility.', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20', badge: 'Live' },
            { id: 'genomics', icon: Dna, name: 'Genomics Pipeline', desc: 'Petabyte-scale ingestion and variant priorization via transformer models.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', badge: 'Active' },
            { id: 'discovery', icon: FlaskConical, name: 'Drug Intelligence', desc: 'GNN-powered repurposing engines and molecular affinity prediction.', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', badge: 'Active' },
            { id: 'threelab', icon: Cpu, name: '3D Spatial Lab', desc: 'Interactive 3D molecular dockings and binding pocket visualizations.', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', badge: 'New' },
            { id: 'data', icon: Database, name: 'Bio-Integration', desc: 'Normalizing global sources: NCBI, DrugBank, ENSEMBL, and UniProt.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', badge: 'Syncing' },
            { id: 'research', icon: BookOpen, name: 'Publication Hub', desc: 'Peer-reviewed achievements and institutional collaboration network.', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', badge: null },
          ].map((m, i) => (
            <button key={i} onClick={() => onNav(m.id)} className={`glass-card p-6 text-left border ${m.bg} perspective-card overflow-hidden group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${m.bg} research-pulse`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  {m.badge && <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${m.bg} ${m.color} border border-current/20 uppercase tracking-widest`}>{m.badge}</span>}
                </div>
                <h3 className="font-black text-white text-lg mb-2 uppercase tracking-tight group-hover:text-primary-400 transition-colors italic">{m.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.desc}</p>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${m.color}`}>
                  Access System <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white text-sm mb-1">GNN Model Performance</h3>
          <p className="text-xs text-slate-500 mb-4">Cross-validated accuracy by prediction task</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={modelAccuracy}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white text-sm mb-1">Live HPC Throughput (24h)</h3>
          <p className="text-xs text-slate-500 mb-4">Processing rates per hour across pipelines</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="og1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                  <linearGradient id="og2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="drug" name="Drug" stroke="#8b5cf6" fill="url(#og2)" strokeWidth={2} />
                <Area type="monotone" dataKey="genomic" name="Genomic" stroke="#06b6d4" fill="url(#og1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pathway Stub ─────────────────────────────────────────────────────────────
function PathwaysPage() {
  const pathways = [
    { name: 'MAPK Signaling Pathway', kegg: 'hsa04010', genes: 255, drugs: 48, diseases: ['Cancer', 'Diabetes'] },
    { name: 'PI3K-Akt Signaling', kegg: 'hsa04151', genes: 341, drugs: 62, diseases: ['Cancer', 'Alzheimer\'s'] },
    { name: 'Cytokine-Cytokine Receptor Interaction', kegg: 'hsa04060', genes: 294, drugs: 31, diseases: ['Autoimmune', 'COVID-19'] },
    { name: 'Wnt Signaling Pathway', kegg: 'hsa04310', genes: 141, drugs: 19, diseases: ['Cancer'] },
  ];
  return (
    <div className="space-y-8">
      <div>
        <p className="section-label mb-1">Pathway Analytics</p>
        <h1 className="text-3xl font-bold text-white">Disease-Pathway-Drug Network</h1>
        <p className="text-slate-400 mt-1 text-sm">Browse KEGG and Reactome pathway data integrated into the BioNexus knowledge graph.</p>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">Pathway Library</h2>
          <p className="text-xs text-slate-500">Sourced from KEGG database · {pathways.length} pathways loaded</p>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-800 bg-slate-950/50">
            {['Pathway Name', 'KEGG ID', 'Genes', 'Drug Targets', 'Associated Diseases'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {pathways.map((p, i) => (
              <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                <td className="px-5 py-4 text-sm font-semibold text-primary-400">{p.name}</td>
                <td className="px-5 py-4 text-xs font-mono text-slate-400">{p.kegg}</td>
                <td className="px-5 py-4 text-sm text-slate-300 font-mono">{p.genes}</td>
                <td className="px-5 py-4 text-sm text-emerald-400 font-mono">{p.drugs}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {p.diseases.map(d => <span key={d} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-slate-300">{d}</span>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Data Integration Stub ────────────────────────────────────────────────────
function DataPage({ onNav }: { onNav: (id: string) => void }) {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./api/client').then(({ api }) => {
      api.getSyncStatus()
        .then(data => setSources(data))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">Data Integration Layer</p>
          <h1 className="text-3xl font-bold text-white">Global Data Source Registry</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage all connected bioinformatics data sources. Trigger new ingestion jobs via the Genomics Pipeline.</p>
        </div>
        <button onClick={() => onNav('genomics')} className="btn-primary text-sm whitespace-nowrap">
          <Database className="w-4 h-4" /> New Ingestion Job
        </button>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800"><h2 className="font-semibold text-white">Connected Data Sources</h2></div>
        {loading ? (
             <div className="flex items-center justify-center py-20 text-slate-400">
               <Loader2 className="w-6 h-6 animate-spin mr-3" /> Fetching live source registry...
             </div>
        ) : (
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-800 bg-slate-950/50">
            {['Source', 'Last Sync', 'Progress', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                <td className="px-5 py-4 font-semibold text-white text-sm">{s.name}</td>
                <td className="px-5 py-4 text-slate-400 text-xs">{s.last_sync}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.status === 'active' ? 'text-emerald-400' : s.status === 'syncing' ? 'text-amber-400' : 'text-slate-500'}`}>
                    {s.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {s.status === 'syncing' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                    {s.status === 'scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                    <span className="capitalize">{s.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

// ─── HPC Page ─────────────────────────────────────────────────────────────────
function HPCPage() {
  const nodes = [
    { name: 'DEL-HPC-01', region: 'Asia-South', load: 78, status: 'online', lat: 28, lng: 77 },
    { name: 'MUM-GPU-04', region: 'Asia-South', load: 92, status: 'high_load', lat: 19, lng: 72 },
    { name: 'LON-HPC-02', region: 'Europe-West', load: 45, status: 'online', lat: 51, lng: 0 },
    { name: 'NYC-HPC-07', region: 'US-East', load: 66, status: 'online', lat: 40, lng: -74 },
    { name: 'SIN-GPU-08', region: 'Asia-SE', load: 12, status: 'idle', lat: 1, lng: 103 },
    { name: 'SFO-HPC-14', region: 'US-West', load: 89, status: 'online', lat: 37, lng: -122 },
  ];

  return (
    <div className="space-y-8 fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-1">Compute Infrastructure</p>
          <h1 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Global <span className="gradient-text">HPC Network</span></h1>
          <p className="text-slate-400 mt-1 text-sm">Distributed high-performance computing clusters providing petaflop-scale inference for BioNexus agents.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
           <div className="flex flex-col items-center">
             <p className="text-[10px] font-bold text-slate-500 uppercase">Total Capacity</p>
             <p className="text-sm font-black text-white font-mono">54.2 PFLOPS</p>
           </div>
           <div className="w-px h-8 bg-slate-800" />
           <div className="flex flex-col items-center">
             <p className="text-[10px] font-bold text-slate-500 uppercase">Global Latency</p>
             <p className="text-sm font-black text-emerald-400 font-mono">14ms</p>
           </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="glass-card h-[400px] relative overflow-hidden group perspective-container">
        <div className="absolute inset-0 animated-grid-bg opacity-20" />
        <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-60">
          <path d="M150,150 Q400,50 850,150 T150,350" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="1" />
          <path d="M200,100 Q500,250 800,100" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
          {nodes.map((n, i) => (
            <g key={i}>
              {/* Normalize map coordinates roughly */}
              <circle cx={500 + n.lng * 2.5} cy={250 - n.lat * 4} r="3" fill="#22d3ee" className="animate-pulse" />
              <circle cx={500 + n.lng * 2.5} cy={250 - n.lat * 4} r="12" fill="none" stroke="#22d3ee" strokeWidth="1" className="opacity-20 animate-ping" />
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="text-center">
             <Globe className="w-24 h-24 text-slate-800/50 mb-4 mx-auto" />
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global Compute Fabric Active</p>
           </div>
        </div>
      </div>

      {/* Cluster Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node, i) => (
          <div key={node.name} className="glass-card p-5 perspective-card hover:border-primary-500/50 transition-all border-l-2 border-l-primary-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono font-bold text-white text-sm">{node.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{node.region}</p>
              </div>
              <Server className={`w-5 h-5 ${node.status === 'high_load' ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-slate-400 uppercase font-bold">Node Occupancy</span>
                  <span className={`font-mono font-bold ${node.load > 85 ? 'text-rose-400' : 'text-emerald-400'}`}>{node.load}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${node.load > 85 ? 'bg-rose-500' : 'bg-primary-500'}`} style={{ width: `${node.load}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Temp: 42°C</span>
                <span>Uptime: 142d</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Research Stub ─────────────────────────────────────────────────────────────
function ResearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="section-label mb-1">Publications & Recognition</p>
        <h1 className="text-3xl font-bold text-white">Research Output</h1>
        <p className="text-slate-400 mt-1 text-sm">Peer-reviewed publications, institutional partnerships, and national recognition for the BioNexus initiative.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Recent Publications</h2>
          {publications.map((pub, i) => (
            <div key={i} className="glass-card p-5 hover:border-primary-500/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors leading-snug">{pub.title}</h4>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary-400 flex-shrink-0 transition-colors" />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <BookOpen className="w-3 h-3" />
                <span className="font-medium text-primary-500/80">{pub.journal}</span>
                <span>·</span><span>{pub.year}</span>
                <span>·</span><span>{pub.citations} citations</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="glass-card p-6 border-amber-500/20">
            <Award className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-base mb-2">National Science Award 2025</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Awarded by the Department of Biotechnology, Govt. of India, for outstanding contribution to AI-driven drug discovery infrastructure at national scale.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white text-sm mb-4">Institutional Partners</h3>
            <div className="grid grid-cols-2 gap-2">
              {['IIT Delhi — Genomics Lab', 'CCMB Hyderabad', 'TIFR Mumbai', 'NIMHANS Bengaluru', 'NCBS Bengaluru', 'CSIR-IGIB Delhi'].map(inst => (
                <div key={inst} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-400 font-medium">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'overview': return <OverviewPage onNav={setPage} />;
      case 'dashboard': return <DashboardPage />;
      case 'genomics': return <GenomicsPage />;
      case 'discovery': return <DrugDiscoveryPage />;
      case 'threelab': return <ThreeLabPage />;
      case 'pathways': return <PathwaysPage />;
      case 'sentinel': return <GlobalIntelligencePage />;
      case 'data': return <DataPage onNav={setPage} />;
      case 'hpc': return <HPCPage />;
      case 'research': return <ResearchPage />;
      default: return <OverviewPage onNav={setPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f172a' }}>
      <Sidebar active={page} onNav={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
