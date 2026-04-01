import { useState, useEffect } from 'react';
import { Box, Layers, Zap, Cpu, Activity, Shield, Binary, FlaskConical } from 'lucide-react';

export default function ThreeLabPage() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [activeAtom, setActiveAtom] = useState<number | null>(null);

  // Auto-rotate molecule
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({ x: prev.x + 0.2, y: prev.y + 0.4 }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const atoms = [
    { id: 1, type: 'carbon', x: 0, y: 0, z: 0, label: 'C1' },
    { id: 2, type: 'oxygen', x: 80, y: 30, z: -20, label: 'O2' },
    { id: 3, type: 'hydrogen', x: -60, y: -40, z: 40, label: 'H3' },
    { id: 4, type: 'nitrogen', x: 40, y: -90, z: 10, label: 'N4' },
    { id: 5, type: 'carbon', x: -90, y: 50, z: -30, label: 'C5' },
    { id: 6, type: 'sulfur', x: 120, y: -20, z: 50, label: 'S6' },
    { id: 7, type: 'hydrogen', x: -20, y: 80, z: 60, label: 'H7' },
  ];

  const bonds = [
    [1, 2], [1, 3], [1, 4], [3, 5], [2, 6], [5, 7]
  ];

  return (
    <div className="space-y-8 fade-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">Advanced Visual Intelligence</p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">3D Molecular <span className="gradient-text glitch">Analysis Lab</span></h1>
          <p className="text-slate-400 mt-1 text-sm max-w-xl">Interactive spatial visualization of predicted protein-ligand interactions and molecular dockings powered by the GNN Inference Engine.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs px-4"><Box className="w-4 h-4" /> Reset View</button>
          <button className="btn-primary text-xs px-4"><Zap className="w-4 h-4" /> Run Docking</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5 border-l-4 border-primary-500 shiny-sweep">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Model Parameters</h3>
            <div className="space-y-3">
              {[
                { label: 'RMSD Threshold', val: '1.42Å', color: 'text-emerald-400' },
                { label: 'Binding Affinity', val: '-8.4 kcal/mol', color: 'text-primary-400' },
                { label: 'LogP Partition', val: '2.14', color: 'text-amber-400' },
                { label: 'Target Specificity', val: '94.2%', color: 'text-violet-400' },
              ].map(p => (
                <div key={p.label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{p.label}</span>
                  <span className={`font-mono font-bold ${p.color}`}>{p.val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-4 border-violet-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Spatial Sensors</h3>
            <div className="h-24 flex items-end gap-1 px-1">
              {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40].map((h, i) => (
                <div key={i} className="flex-1 bg-violet-500/20 rounded-t-sm relative group overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-violet-400 animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center font-mono">LIVE INFERENCE SIGNAL</p>
          </div>
        </div>

        {/* Main 3D Canvas Viewport */}
        <div className="lg:col-span-3 relative h-[600px] glass-card overflow-hidden group perspective-container">
          <div className="absolute inset-0 animated-grid-bg opacity-30" />
          
          {/* Viewport UI */}
          <div className="absolute top-6 left-6 z-10 space-y-2">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold text-white uppercase font-mono">Engine: BioNexus-GNN-v4</span>
            </div>
            <div className="bg-slate-900/40 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg">
              <p className="text-[9px] text-slate-500 font-bold uppercase">Target Site</p>
              <p className="text-xs text-primary-400 font-mono">SER-145 / GLY-122</p>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-10 flex gap-2">
            <button className="w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 transition-all"><Layers className="w-4 h-4" /></button>
            <button className="w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 transition-all"><Binary className="w-4 h-4" /></button>
          </div>

          <div className="absolute flex items-center justify-center w-full h-full perspective-card" 
               style={{ 
                 transform: `rotateX(${rotation.x % 360}deg) rotateY(${rotation.y % 360}deg)`
               }}>
            <svg width="400" height="400" viewBox="-200 -200 400 400" className="drop-shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              {/* Bonds */}
              {bonds.map(([from, to]) => {
                const a1 = atoms.find(a => a.id === from)!;
                const a2 = atoms.find(a => a.id === to)!;
                return (
                  <line 
                    key={`${from}-${to}`}
                    x1={a1.x} y1={a1.y}
                    x2={a2.x} y2={a2.y}
                    stroke="rgba(148, 163, 184, 0.4)"
                    strokeWidth="4"
                    strokeDasharray="4 2"
                  />
                );
              })}
              
              {/* Atoms */}
              {atoms.map(a => (
                <g key={a.id} onMouseEnter={() => setActiveAtom(a.id)} onMouseLeave={() => setActiveAtom(null)} className="cursor-pointer">
                  <circle
                    cx={a.x} cy={a.y}
                    r={activeAtom === a.id ? 18 : 14}
                    fill={a.type === 'carbon' ? '#475569' : a.type === 'oxygen' ? '#f43f5e' : a.type === 'nitrogen' ? '#3b82f6' : a.type === 'sulfur' ? '#f59e0b' : '#f8fafc'}
                    className="transition-all duration-300"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  {activeAtom === a.id && (
                    <text x={a.x} y={a.y - 25} textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none uppercase">{a.label}</text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Surface Render', icon: FlaskConical, val: 'Van der Waals' },
          { label: 'Bond Style', icon: Layers, val: 'Ball & Stick' },
          { label: 'Force Field', icon: Cpu, val: 'CHARMM-36' },
          { label: 'Resolution', icon: Activity, val: '0.8Å Ultra' },
        ].map(ctrl => (
           <button key={ctrl.label} className="glass-card p-4 flex items-center justify-between hover:border-primary-500/50 group transition-all">
             <div className="flex items-center gap-3">
               <ctrl.icon className="w-5 h-5 text-slate-500 group-hover:text-primary-400 transition-colors" />
               <div className="text-left">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">{ctrl.label}</p>
                 <p className="text-xs text-white font-medium">{ctrl.val}</p>
               </div>
             </div>
             <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary-400" />
           </button>
        ))}
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
}
