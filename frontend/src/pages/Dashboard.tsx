import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { PlatformStats, HealthStatus } from '../api/client';
import { Activity, Database, Server, Zap, CheckCircle2, AlertTriangle, Loader2, TrendingUp, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const throughputData = [
  { time: '00h', genomic: 3200, drug: 2100, pathway: 1800 },
  { time: '04h', genomic: 2800, drug: 1800, pathway: 2200 },
  { time: '08h', genomic: 6200, drug: 4100, pathway: 3800 },
  { time: '12h', genomic: 9500, drug: 6800, pathway: 5500 },
  { time: '16h', genomic: 8200, drug: 5900, pathway: 4900 },
  { time: '20h', genomic: 7100, drug: 4400, pathway: 3600 },
  { time: '24h', genomic: 5400, drug: 3800, pathway: 3000 },
];

const pipelineJobs = [
  { name: 'WGS-091-INDIA', status: 'running', progress: 72, type: 'Whole Genome Seq', node: 'HPC-Node-14', time: '2h 14m' },
  { name: 'DRUG-KD-029', status: 'running', progress: 45, type: 'Drug Repurposing GNN', node: 'GPU-Cluster-04', time: '51m' },
  { name: 'PATH-KEGG-12', status: 'completed', progress: 100, type: 'Pathway Enrichment', node: 'HPC-Node-07', time: '4h 02m' },
  { name: 'VAR-COSMIC-44', status: 'queued', progress: 0, type: 'Variant Annotation', node: 'HPC-Node-02', time: 'Pending' },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { running: 'text-emerald-400', completed: 'text-primary-400', queued: 'text-amber-400', failed: 'text-red-400' };
  const bg: Record<string, string> = { running: 'bg-emerald-400/10 border-emerald-400/20', completed: 'bg-primary-400/10 border-primary-400/20', queued: 'bg-amber-400/10 border-amber-400/20', failed: 'bg-red-400/10 border-red-400/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded border ${map[status] || ''} ${bg[status] || ''}`}>
      {status === 'running' && <span className="relative flex h-1.5 w-1.5"><span className="absolute animate-ping h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>}
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, h] = await Promise.all([api.stats(), api.health()]);
      setStats(s); setHealth(h); setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-1">Operations Dashboard</p>
          <h1 className="text-3xl font-bold text-white">Live System Telemetry</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30s` : 'Connecting to backend…'}
          </p>
        </div>
        <button onClick={fetchAll} disabled={loading} className="btn-ghost text-sm disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Live Backend Health */}
      <div className={`glass-card p-4 flex flex-col md:flex-row md:items-center gap-4 border ${health?.status === 'healthy' ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
        <div className="flex items-center gap-3">
          {health?.status === 'healthy'
            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            : <AlertTriangle className="w-5 h-5 text-amber-400" />
          }
          <div>
            <p className="font-semibold text-white text-sm">Backend: FastAPI @ localhost:8000</p>
            <p className={`text-xs ${health?.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {loading ? 'Checking…' : health?.status === 'healthy' ? '✓ Database Connected · All Systems Operational' : `⚠ Status: ${health?.status || 'Unreachable'}`}
            </p>
          </div>
        </div>
        {health?.counts && (
          <div className="flex gap-6 ml-auto text-sm">
            <div className="text-center"><p className="font-mono text-white font-bold">{health.counts.drugs}</p><p className="text-xs text-slate-500">Drugs</p></div>
            <div className="text-center"><p className="font-mono text-white font-bold">{health.counts.datasets}</p><p className="text-xs text-slate-500">Datasets</p></div>
            <div className="text-center"><p className="font-mono text-white font-bold">{health.counts.variants}</p><p className="text-xs text-slate-500">Variants</p></div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'HPC Nodes', value: stats?.hpc_nodes ?? '—', icon: Server, color: 'text-primary-400', sub: 'All regions active' },
          { label: 'Throughput (seq/s)', value: stats ? stats.throughput_seq_per_sec.toLocaleString() : '—', icon: Activity, color: 'text-emerald-400', sub: 'Peak processing rate' },
          { label: 'Uptime', value: stats ? `${stats.uptime_percent}%` : '—', icon: TrendingUp, color: 'text-violet-400', sub: 'Rolling 30-day average' },
          { label: 'Avg Latency', value: stats ? `${stats.avg_latency_ms}ms` : '—', icon: Zap, color: 'text-amber-400', sub: 'GNN inference round-trip' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <div className={`text-2xl font-mono font-black ${s.color} mb-1`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : s.value}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white">HPC Throughput Telemetry (24h window)</h3>
          <div className="flex gap-3 text-xs">
            {[{ label: 'Genomic', color: '#06b6d4' }, { label: 'Drug', color: '#8b5cf6' }, { label: 'Pathway', color: '#34d399' }].map(l => (
              <span key={l.label} className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: l.color }} /> {l.label}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-4">Processing rates per hour (sequences/sec)</p>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={throughputData}>
              <defs>
                {[['g1', '#06b6d4'], ['g2', '#8b5cf6'], ['g3', '#34d399']].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="pathway" name="Pathway" stroke="#34d399" fill="url(#g3)" strokeWidth={2} />
              <Area type="monotone" dataKey="drug" name="Drug" stroke="#8b5cf6" fill="url(#g2)" strokeWidth={2} />
              <Area type="monotone" dataKey="genomic" name="Genomic" stroke="#06b6d4" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Job Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-white">Active Pipeline Jobs</h3>
            <p className="text-xs text-slate-500">Simulated HPC job board · {pipelineJobs.filter(j => j.status === 'running').length} running</p>
          </div>
          <span className="text-xs text-slate-500">Auto-refresh every 30s</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 bg-slate-950/50">
              {['Job ID', 'Pipeline Type', 'Progress', 'Compute Node', 'Runtime', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {pipelineJobs.map((job, i) => (
                <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-primary-400 font-semibold text-xs">{job.name}</td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs">{job.type}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${job.status === 'completed' ? 'bg-emerald-400' : job.status === 'queued' ? 'bg-slate-600' : 'bg-primary-500'}`} style={{ width: `${job.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono w-8">{job.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{job.node}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{job.time}</td>
                  <td className="px-5 py-3.5"><StatusPill status={job.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
