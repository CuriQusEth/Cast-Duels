import React, { useState } from 'react';
import { useDenimStatus } from '../lib/denim';
import { Zap, ShieldCheck, Info, X } from 'lucide-react';

export function DenimBanner({ className = '' }: { className?: string }) {
  const { network, blockTimeMs, blockNumber, isDenimActive } = useDenimStatus();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className={`flex items-center gap-2 text-xs backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)] ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        
        <span className="font-semibold tracking-wide flex items-center gap-1 text-slate-100">
          <Zap size={13} className="text-amber-400 fill-amber-400" />
          {network}
        </span>
        
        <span className="text-blue-400/80 border-l border-blue-500/30 pl-2 font-mono">
          {blockTimeMs}ms
        </span>

        {blockNumber && (
          <span className="text-blue-300 font-mono hidden sm:inline">
            #{blockNumber.toString()}
          </span>
        )}

        <button 
          onClick={() => setShowInfo(true)}
          className="hover:text-white transition-colors ml-1 p-0.5 rounded hover:bg-blue-500/20"
          title="Denim Mainnet Info"
        >
          <Info size={13} />
        </button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-blue-400 font-bold mb-3">
              <Zap size={20} className="text-amber-400" />
              <h3 className="text-lg text-white font-['Cinzel']">Base Mainnet Denim Activated</h3>
            </div>

            <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
              Base successfully activated the <strong className="text-white">Denim upgrade</strong> on Base Mainnet.
              Flashblocks have been fully replaced with native <strong className="text-cyan-400">200ms canonical blocks</strong>.
            </p>

            <div className="space-y-2.5 text-xs text-zinc-300 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                <span className="text-zinc-500">Network:</span>
                <span className="text-blue-400 font-bold">Base Mainnet (8453)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                <span className="text-zinc-500">Canonical Block Time:</span>
                <span className="text-emerald-400 font-bold">200ms Native</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                <span className="text-zinc-500">Flashblocks Status:</span>
                <span className="text-amber-400 font-bold">Retired (Migrated to 200ms Blocks)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Current Canonical Block:</span>
                <span className="text-indigo-300 font-bold">#{blockNumber ? blockNumber.toString() : 'Syncing...'}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-2 rounded-lg">
              <ShieldCheck size={16} />
              <span>All spell duel submissions and GM transactions confirm in ~200ms on Base Mainnet.</span>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Continue Dueling
            </button>
          </div>
        </div>
      )}
    </>
  );
}
