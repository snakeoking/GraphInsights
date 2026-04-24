import React, { useState } from 'react';
import { ChevronRight, ChevronDown, AlertTriangle, Network } from 'lucide-react';

interface TreeViewProps {
  tree: any;
  label: string;
  depth?: number;
  hasCycle?: boolean;
  isRoot?: boolean;
}

export function TreeView({ tree, label, depth, hasCycle, isRoot = false }: TreeViewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const children = Object.keys(tree).sort();
  const hasChildren = children.length > 0;

  return (
    <div className="ml-4 first:ml-0 mt-1">
      <div 
        className={`flex items-center space-x-2 py-1 px-2 rounded-md transition-colors ${
          isRoot ? 'bg-zinc-800/50 border border-zinc-700/50' : 'hover:bg-zinc-800/30'
        } ${hasCycle ? 'border-red-900/50 bg-red-900/10' : ''}`}
      >
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        {isRoot && hasCycle ? (
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
        ) : isRoot ? (
          <Network size={16} className="text-emerald-400 flex-shrink-0" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
        )}
        
        <span className={`font-mono ${isRoot ? 'font-bold text-zinc-100' : 'text-zinc-300'}`}>
          {label}
        </span>

        {isRoot && !hasCycle && depth !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 ml-2 border border-emerald-500/20">
            Depth: {depth}
          </span>
        )}

        {isRoot && hasCycle && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 ml-2 border border-red-500/20 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Cycle Detected
          </span>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="border-l border-zinc-800 ml-2.5 mt-1 relative">
          {children.map((child) => (
            <TreeView key={child} tree={tree[child]} label={child} />
          ))}
        </div>
      )}
    </div>
  );
}
