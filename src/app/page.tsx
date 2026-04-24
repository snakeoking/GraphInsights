"use client";

import { useState } from "react";
import { TreeView } from "@/components/TreeView";
import { AlertCircle, FileJson, CheckCircle2, AlertTriangle, Layers, Infinity, Crown, Network, ChevronRight } from "lucide-react";

export default function Home() {
  const [inputData, setInputData] = useState('["A->B", "A->C", "B->D"]');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(inputData);
        if (!Array.isArray(parsedData)) {
          throw new Error("Input must be a JSON array of strings.");
        }
      } catch (err) {
        throw new Error("Invalid JSON format. Please provide a valid JSON array.");
      }

      const res = await fetch("/api/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsedData }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Network className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Graph Insights
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Analyze hierarchical structures, detect cycles, and evaluate graph depth in milliseconds.
          </p>
        </header>

        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm font-medium text-zinc-300">
              <FileJson className="w-4 h-4 mr-2 text-zinc-500" />
              Input Nodes (JSON Array)
            </label>
            <button 
              onClick={() => setInputData('["A->B", "B->C", "C->A", "D->E", "D->F", "hello", "A->A", "A->B"]')}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-full"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-y shadow-inner"
            placeholder='e.g., ["A->B", "A->C", "X->Y", "hello"]'
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-8 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Process Nodes"
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl flex items-start animate-in fade-in slide-in-from-bottom-2 shadow-lg">
            <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Processing Error</h4>
              <p className="text-sm opacity-90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                title="Valid Trees" 
                value={result.summary.total_trees} 
                icon={<Layers className="w-6 h-6 text-emerald-400" />} 
              />
              <MetricCard 
                title="Cyclic Groups" 
                value={result.summary.total_cycles} 
                icon={<Infinity className="w-6 h-6 text-indigo-400" />} 
              />
              <MetricCard 
                title="Largest Tree Root" 
                value={result.summary.largest_tree_root || "N/A"} 
                icon={<Crown className="w-6 h-6 text-amber-400" />} 
              />
            </div>

            {/* Warnings (Invalid & Duplicates) */}
            {(result.invalid_entries.length > 0 || result.duplicate_edges.length > 0) && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                  Ignored Entries
                </h3>
                <div className="space-y-5">
                  {result.invalid_entries.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-3">Invalid Format</p>
                      <div className="flex flex-wrap gap-2">
                        {result.invalid_entries.map((entry: string, i: number) => (
                          <span key={`inv-${i}`} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-mono shadow-sm">
                            {entry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.duplicate_edges.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-3">Duplicate Edges</p>
                      <div className="flex flex-wrap gap-2">
                        {result.duplicate_edges.map((entry: string, i: number) => (
                          <span key={`dup-${i}`} className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono shadow-sm">
                            {entry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hierarchies Tree View */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                Hierarchies
              </h3>
              
              {result.hierarchies.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center">
                  <p className="text-zinc-500">No valid hierarchies generated.</p>
                </div>
              ) : (
                <div className="space-y-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-x-auto shadow-inner">
                  {result.hierarchies.map((h: any, i: number) => (
                    <TreeView 
                      key={i} 
                      tree={h.tree} 
                      label={h.root} 
                      depth={h.depth} 
                      hasCycle={h.has_cycle} 
                      isRoot={true} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* API Response JSON */}
            <details className="group border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
              <summary className="flex items-center px-5 py-4 cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors">
                <ChevronRight className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" />
                Raw API Response
              </summary>
              <div className="p-5 border-t border-zinc-800 bg-zinc-950 overflow-x-auto">
                <pre className="text-xs text-emerald-400/80 font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>

          </div>
        )}
      </div>
    </main>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between items-start hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="flex items-center space-x-3 text-zinc-400 mb-4">
        <div className="p-2 bg-zinc-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-sm font-medium tracking-wide">{title}</span>
      </div>
      <div className="text-4xl font-bold text-white truncate w-full">
        {value}
      </div>
    </div>
  );
}
