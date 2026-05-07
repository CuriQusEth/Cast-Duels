import { useApp } from '../store/AppContext';
import { motion } from 'motion/react';
import { Flame, Star, Trophy, Users } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function TitleScreen() {
  const { setCurrentScreen, setPlayerAddress } = useApp();
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();

  const handleStart = () => {
    setCurrentScreen('arena');
  };

  const handleConnect = () => {
    connect({ connector: injected() }, {
      onSuccess(data) {
        setPlayerAddress(data.accounts[0]);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background magical elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-700/20 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-700/20 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <div className="flex items-center justify-center mb-4 relative">
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-32 h-32 border-2 border-indigo-500/30 rounded-full border-dashed"
          />
          <Flame size={64} className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-rose-400 via-indigo-400 to-cyan-400 drop-shadow-sm filter mb-2 tracking-tight">
          CAST SPELL
        </h1>
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-indigo-200 mb-12 text-center uppercase">
          Wizard Duels
        </h2>
      </motion.div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="z-10 flex flex-col gap-4 w-full max-w-sm"
      >
        <button 
          onClick={handleStart}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 p-[2px] transition-transform active:scale-95"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-zinc-950 rounded-[10px] group-hover:bg-opacity-90 transition-all font-bold text-lg">
            <Star size={20} className="text-amber-400" />
            ENTER ARENA
          </div>
        </button>

        <button 
          onClick={() => setCurrentScreen('leaderboard')}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-medium border border-white/10 text-indigo-100 backdrop-blur-md active:scale-95"
        >
          <Trophy size={20} className="text-yellow-400" />
          LEADERBOARD
        </button>

        {!isConnected ? (
          <button 
            onClick={handleConnect}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all font-medium border border-blue-500/30 text-blue-300 backdrop-blur-md active:scale-95 mt-4"
          >
            <Users size={20} />
            CONNECT ACCOUNT
          </button>
        ) : (
          <div className="w-full text-center p-3 mt-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl">
            Connected: {address?.slice(0,6)}...{address?.slice(-4)}
          </div>
        )}
      </motion.div>
    </div>
  );
}
