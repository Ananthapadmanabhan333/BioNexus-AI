import { useState } from 'react';
import { Globe, AlertTriangle, Shield, TrendingDown, Layers, Zap, Info, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const variantData = [
  { time: 'Week 1', delta: 45, omicron: 10, alpha: 5 },
  { time: 'Week 2', delta: 42, omicron: 15, alpha: 2 },
  { time: 'Week 3', delta: 30, omicron: 45, alpha: 1 },
  { time: 'Week 4', delta: 12, omicron: 88, alpha: 0 },
];

export default function GlobalIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'pandemic' | 'cost'>('pandemic');

  return (
    <div className="space-y-8 fade-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">National Sovereignty & Health Intelligence</p>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Global <span className="gradient-text">Sentinel Engine</span></h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time mutation tracking, drug accessibility audits, and public healthcare cost optimization.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
           <button onClick={() => setActiveTab('pandemic')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pandemic' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Pandemic Intel</button>
           <button onClick={() => setActiveTab('cost')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'cost' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Cost Optimization</button>
        </div>
      </div>

      {activeTab === 'pandemic' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Visual: Mutation Map Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 min-h-[400px] relative overflow-hidden group">
               <div className="absolute inset-0 animated-grid-bg opacity-10" />
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2 underline decoration-primary-500/50 underline-offset-4">Global Variant Infiltration Map</h3>
                    <div className="flex gap-2 text-[10px] items-center">
                       <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Low Risk</span>
                       <span className="flex items-center gap-1 text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Moderate</span>
                       <span className="flex items-center gap-1 text-rose-500"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> High Mutation Density</span>
                    </div>
                  </div>
                  
                  {/* Pseudo Map */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full max-w-lg aspect-video border border-slate-800 rounded-2xl bg-slate-950/50 flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                       <Globe className="w-20 h-20 text-slate-800 animate-pulse" />
                       <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-ping" />
                       <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-ping" />
                       <div className="absolute top-1/2 right-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       
                       <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-lg">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Incident</p>
                          <p className="text-xs text-rose-400 font-bold">XBB.1.5 — Rapid Expansion</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="glass-card p-6">
               <h3 className="font-bold text-white mb-4">Variant Substitution Trends</h3>
               <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={variantData}>
                    <defs>
                      <linearGradient id="col-om" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                      <linearGradient id="col-de" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="omicron" name="Omicron Subgroup" stroke="#8b5cf6" fill="url(#col-om)" strokeWidth={2} />
                    <Area type="monotone" dataKey="delta" name="Delta Subgroup" stroke="#ef4444" fill="url(#col-de)" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Right: Risk Alerts */}
          <div className="space-y-6">
             <div className="glass-card p-5 border-l-4 border-rose-500 bg-rose-500/5">
                <div className="flex items-center gap-3 mb-3">
                   <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
                   <h3 className="font-bold text-white text-sm">Critical Alert</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  New mutation cluster detected in Spike Protein at <span className="text-rose-400 font-mono">E484K</span>. BioNexus predicts 22% higher binding affinity for human ACE2 receptors.
                </p>
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                   <span className="text-[10px] text-slate-500 font-bold uppercase">Immune Evasion</span>
                   <span className="text-xs font-black text-rose-400">HIGH (0.84)</span>
                </div>
             </div>

             <div className="glass-card p-5 space-y-4">
                <h3 className="section-label">Suggested Countermeasures</h3>
                {[
                  { name: 'Paxlovid Efficiency', val: '92%', status: 'Effective' },
                  { name: 'mRNA Booster Match', val: '64%', status: 'Reduced' },
                  { name: 'Monoclonal Abs', val: '12%', status: 'Resistant' },
                ].map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.name}</span>
                    <span className={`font-bold ${item.status === 'Effective' ? 'text-emerald-400' : item.status === 'Reduced' ? 'text-amber-400' : 'text-rose-400'}`}>{item.val}</span>
                  </div>
                ))}
             </div>

             <div className="glass-card p-5 bg-primary-500/5 border border-primary-500/20">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                   <Shield className="w-4 h-4 text-primary-400" />
                   National Bio-Data Sync
                </h3>
                <div className="mt-4 space-y-3">
                   <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500 uppercase font-black tracking-widest">Hospital Network Coverage</span>
                      <span className="text-primary-400 font-bold">84%</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 w-[84%]" />
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed italic">Last automated data crawl completed 14m ago across 624 clinical nodes.</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Cost Optimization Tab */
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
             <h3 className="font-bold text-white mb-2">Cost Reduction Audit (Generics)</h3>
             <p className="text-xs text-slate-500 mb-6">Identifying proprietary-to-generic conversion opportunities for the national pharmacy formulary.</p>
             
             <div className="space-y-4">
                {[
                  { drug: 'SITAGLIPTIN', prop: '$14.20/pill', gen: '$1.40/pill', saving: '90%', imp: 'High-Impact' },
                  { drug: 'REMDESIVIR', prop: '$520/dose', gen: '$45/dose', saving: '91%', imp: 'Mission-Critical' },
                  { drug: 'DABIGATRAN', prop: '$8.40/pill', gen: '$2.10/pill', saving: '75%', imp: 'Standard' },
                ].map(d => (
                  <div key={d.drug} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded bg-emerald-400/10"><TrendingDown className="w-5 h-5 text-emerald-400" /></div>
                      <div>
                        <p className="font-bold text-white text-sm tracking-tight">{d.drug}</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">{d.imp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-white">{d.saving} SAVING</p>
                       <p className="text-[10px] text-slate-500 italic mt-0.5">Proprietary: {d.prop}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 border border-primary-500/30 bg-primary-500/5 flex items-center justify-between shiny-sweep">
               <div>
                  <h3 className="font-black text-2xl text-white italic tracking-tighter uppercase">$1.24 <span className="text-primary-400">BILLION</span></h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Projected Annual National Savings</p>
               </div>
               <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
            </div>

            <div className="glass-card p-6">
               <h3 className="section-label mb-4">Optimized Distribution Nodes</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs">
                     <div className="w-2 h-2 rounded-full bg-emerald-400" />
                     <span className="flex-1 text-slate-300">Tier-2 Cities Healthcare Hub</span>
                     <span className="text-emerald-400 font-bold">+24% Access</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                     <div className="w-2 h-2 rounded-full bg-primary-400" />
                     <span className="flex-1 text-slate-300">Rural Diagnostic Edge Points</span>
                     <span className="text-primary-400 font-bold">+12% Access</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs opacity-40">
                     <div className="w-2 h-2 rounded-full bg-slate-500" />
                     <span className="flex-1 text-slate-300">Private Metro Networks</span>
                     <span className="text-slate-500 font-bold">Stable</span>
                  </div>
               </div>
               <button className="w-full btn-ghost text-[10px] font-black uppercase tracking-widest mt-6 py-2">Download National Audit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
