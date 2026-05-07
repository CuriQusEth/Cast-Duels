import { useApp } from '../store/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal, Hexagon } from 'lucide-react';
import { useAccount, useSendTransaction } from 'wagmi';

export default function LeaderboardScreen() {
  const { setCurrentScreen, rating } = useApp();
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();

  const handleSayGm = () => {
    sendTransaction({
      to: '0x0000000000000000000000000000000000000000',
      data: '0x474d', // "GM"
      value: 0n,
    }, {
      onSuccess(hash) {
        alert(`GM said! TX Hash: ${hash}`);
      },
      onError(error) {
        console.error(error);
        alert('Transaction failed or was rejected.');
      }
    });
  };

  const mockLeaderboard = [
    { rank: 1, name: 'Archmage Kael', score: 2450, isPlayer: false },
    { rank: 2, name: 'Voidwalker Xen', score: 2310, isPlayer: false },
    { rank: 3, name: 'Stormbringer Lux', score: 2180, isPlayer: false },
    { rank: 4, name: 'Unknown Wizard', score: 1950, isPlayer: true },
    { rank: 5, name: 'Flame Adept', score: 1800, isPlayer: false },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-zinc-950 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 z-10 relative">
        <button 
          onClick={() => setCurrentScreen('title')}
          className="p-3 bg-white/5 rounded-full hover:bg-white/10 active:scale-90 transition-all text-slate-300"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={24} />
          <h1 className="text-xl font-bold tracking-widest text-indigo-100 uppercase">Grand Academy</h1>
        </div>
        <div className="w-12 h-12" /> {/* Right spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto z-10 pb-20 relative">
        <div className="max-w-md mx-auto w-full space-y-4">
          
          {/* Player Current Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center gap-2 backdrop-blur-sm"
          >
            <Hexagon size={48} className="text-indigo-400 opacity-50 absolute" />
            <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-rose-300 z-10">
              {rating}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-indigo-300/80 font-bold z-10">Your Rating</span>
          </motion.div>

          {/* List */}
          <div className="mt-8 space-y-2">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4 ml-2">Top Duelists</h3>
            
            {mockLeaderboard.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${entry.isPlayer ? 'bg-white/10 border-indigo-500/50' : 'bg-black/20 border-white/5'} backdrop-blur-sm`}
              >
                <div className="w-8 flex justify-center text-slate-400 font-mono font-bold">
                  {entry.rank === 1 ? <Medal className="text-yellow-400" size={20} /> : 
                   entry.rank === 2 ? <Medal className="text-slate-300" size={20} /> :
                   entry.rank === 3 ? <Medal className="text-amber-600" size={20} /> :
                   `#${entry.rank}`}
                </div>
                <div className="flex-1 font-medium text-slate-200">
                  {entry.name}
                  {entry.isPlayer && <span className="ml-2 text-[10px] uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full">You</span>}
                </div>
                <div className="font-mono text-indigo-300">
                  {entry.score}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* On-chain interaction panel */}
      {isConnected && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20"
        >
          <div className="max-w-md mx-auto w-full flex flex-col items-center">
            <button 
              onClick={handleSayGm}
              disabled={isPending}
              className={`w-full text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all outline outline-2 outline-blue-500 hover:bg-blue-500/20 ${isPending ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
            >
              <span>{isPending ? 'Sending...' : 'Say GM On-Chain (Base)'}</span>
            </button>
            <p className="text-xs text-blue-300/50 mt-3 text-center">Posts a real transaction to Base Mainnet.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
