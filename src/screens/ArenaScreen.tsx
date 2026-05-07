import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store/AppContext';
import { GameEngine, ElementType } from '../game/GameEngine';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Flame, Snowflake, Sparkles } from 'lucide-react';
import { delegateToAgent } from '../lib/erc8004/utils';
import { getAttributionData, encodeAttributionExtraData } from '../lib/erc8021/utils';
import { useSendTransaction } from 'wagmi';

export default function ArenaScreen() {
  const { setCurrentScreen, setRating, rating, playerAddress } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  
  const [elementsQueue, setElementsQueue] = useState<ElementType[]>([]);
  const [gameOver, setGameOver] = useState<{ won: boolean } | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Joystick state
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Make canvas full size
    const resizeCanvas = () => {
      if (engineRef.current && canvasRef.current) {
        const rect = canvasRef.current.parentElement!.getBoundingClientRect();
        engineRef.current.resize(rect.width, rect.height);
      }
    };

    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    engine.onGameOver = (won) => {
      setGameOver({ won });
      if (won) {
        setRating(rating + 25);
      } else {
        setRating(Math.max(0, rating - 15));
      }
    };

    engine.start();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      engine.stop();
    };
  }, []);

  // Joystick Handlers
  const handleJoystickMove = (e: React.PointerEvent | PointerEvent) => {
    if (!isDragging || !joystickRef.current || !engineRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let pointerX = (e as React.PointerEvent).clientX ?? (e as PointerEvent).clientX;
    let pointerY = (e as React.PointerEvent).clientY ?? (e as PointerEvent).clientY;
    
    // Handle touch
    if ((e as any).touches && (e as any).touches.length > 0) {
      pointerX = (e as any).touches[0].clientX;
      pointerY = (e as any).touches[0].clientY;
    }

    // Relative to joystick component
    // If we bind pointermove to window, we need relative to joystick center at fixed position
    // For simplicity, joystick track is relative to touch start? Let's do absolute position relative to the container.
    const rectParent = joystickRef.current.parentElement!.getBoundingClientRect();
    let dx = pointerX - (rectParent.left + rectParent.width / 2);
    let dy = pointerY - (rectParent.top + rectParent.height / 2);
    
    const distance = Math.sqrt(dx*dx + dy*dy);
    const maxRadius = rectParent.width / 2 - 20;
    
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    setJoystickPos({ x: dx, y: dy });
    
    engineRef.current.playerInput = {
      x: dx / maxRadius,
      y: dy / maxRadius
    };
  };

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    if(engineRef.current) {
        engineRef.current.playerInput = { x: 0, y: 0 };
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handleJoystickMove);
      window.addEventListener('pointerup', handleJoystickEnd);
    }
    return () => {
      window.removeEventListener('pointermove', handleJoystickMove);
      window.removeEventListener('pointerup', handleJoystickEnd);
    };
  }, [isDragging]);


  // Spell System
  const addElement = (element: ElementType) => {
    if (elementsQueue.length < 4) {
      setElementsQueue([...elementsQueue, element]);
    }
  };

  const castSpell = () => {
    if (elementsQueue.length > 0 && engineRef.current) {
      engineRef.current.castSpell('player', elementsQueue);
      setElementsQueue([]);
    }
  };

  const handleRecordDuel = async () => {
    setIsRecording(true);
    try {
      const attribution = getAttributionData('DUEL_WIN');
      await delegateToAgent({
        agentAddress: '0xmockagentaddress',
        permissions: ['RECORD_WIN']
      });

      const extraData = encodeAttributionExtraData(attribution);
      
      sendTransaction({
        to: '0x0000000000000000000000000000000000000000',
        data: extraData,
        value: 0n,
      }, {
        onSuccess(hash) {
          alert(`Duel recorded on Base Mainnet! TX: ${hash}`);
          setCurrentScreen('leaderboard');
        },
        onError(error) {
          console.error(error);
          alert('Failed to record duel.');
        },
        onSettled() {
          setIsRecording(false);
        }
      });
      
    } catch (e) {
      console.error(e);
      alert('Failed to construct transaction.');
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-black touch-none">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => setCurrentScreen('title')}
          className="p-3 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 active:scale-90 transition-all text-slate-300"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* HUD Layer */}
      {!gameOver && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-between p-6 md:p-12">
          
          {/* Movement Joystick (Left) */}
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 border-2 border-white/10 rounded-full relative pointer-events-auto shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
               onPointerDown={(e) => {
                 setIsDragging(true);
                 // Initialize pos immediately
                 const rectParent = e.currentTarget.getBoundingClientRect();
                 let dx = e.clientX - (rectParent.left + rectParent.width / 2);
                 let dy = e.clientY - (rectParent.top + rectParent.height / 2);
                 setJoystickPos({x: dx, y: dy});
               }}>
            <div 
              ref={joystickRef}
              className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full absolute top-1/2 left-1/2 -mt-8 -ml-8 md:-mt-10 md:-ml-10 shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-md active:bg-white/30 transition-colors"
              style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
            />
          </div>

          {/* Spellcasting (Right) */}
          <div className="pointer-events-auto flex flex-col items-end gap-6">
            
            {/* Elements Queue Display */}
            <div className="flex justify-end gap-2 h-12 mb-2 bg-black/30 p-2 rounded-full backdrop-blur-sm border border-white/5">
              <AnimatePresence>
                {elementsQueue.map((el, i) => (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    key={i}
                    className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center glow-effect shadow-lg"
                    style={{ 
                      backgroundColor: 
                        el === 'FIRE' ? '#f97316' : 
                        el === 'FROST' ? '#38bdf8' : 
                        el === 'ARCANE' ? '#a855f7' : '#fef08a' 
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Elements Selection */}
            <div className="grid grid-cols-2 gap-4">
              <SpellButton color="hover:bg-orange-500/20 text-orange-400 border-orange-500/30" icon={<Flame size={28}/>} onClick={() => addElement('FIRE')} />
              <SpellButton color="hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30" icon={<Snowflake size={28}/>} onClick={() => addElement('FROST')} />
              <SpellButton color="hover:bg-purple-500/20 text-purple-400 border-purple-500/30" icon={<Sparkles size={28}/>} onClick={() => addElement('ARCANE')} />
              <SpellButton color="hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30" icon={<Zap size={28}/>} onClick={() => addElement('LIGHTNING')} />
            </div>

            {/* Cast Button */}
            <button 
              onClick={castSpell}
              disabled={elementsQueue.length === 0}
              className={`mt-4 w-32 h-32 rounded-full border-4 flex items-center justify-center text-xl font-bold tracking-widest transition-all ${
                elementsQueue.length > 0 
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-200 active:scale-90 active:bg-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
                  : 'border-white/10 bg-black/20 text-white/20'
              }`}
            >
              CAST
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 ${gameOver.won ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-600' : 'text-slate-500'}`}
            >
              {gameOver.won ? 'Victory' : 'Defeat'}
            </motion.h2>
            
            <p className="text-xl text-indigo-200 mb-12">
              New Rating: <span className="font-bold text-white">{rating}</span>
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={() => {
                  setGameOver(null);
                  if (engineRef.current) {
                    engineRef.current.player.hp = engineRef.current.player.maxHp;
                    engineRef.current.enemy.hp = engineRef.current.enemy.maxHp;
                    engineRef.current.projectiles = [];
                    engineRef.current.particles = [];
                    engineRef.current.start();
                  }
                }}
                className="w-full py-4 text-lg font-bold bg-white text-black rounded-xl active:scale-95 transition-transform"
              >
                DUEL AGAIN
              </button>
              
              {gameOver.won && (
                <button 
                  onClick={handleRecordDuel}
                  disabled={isRecording || isTxPending || !playerAddress}
                  className={`w-full py-4 text-lg font-bold rounded-xl outline transition-all ${
                    playerAddress 
                      ? 'outline-2 outline-blue-500 text-blue-400 hover:bg-blue-500/10 active:scale-95' 
                      : 'outline-1 outline-white/20 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {(isRecording || isTxPending) ? 'RECORDING...' : playerAddress ? 'RECORD ON-CHAIN' : 'CONNECT TO RECORD'}
                </button>
              )}
              
              <button 
                onClick={() => setCurrentScreen('title')}
                className="w-full py-4 text-sm font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest mt-4"
              >
                Return to Academy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpellButton({ icon, color, onClick }: { icon: React.ReactNode, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black/40 backdrop-blur-sm border flex items-center justify-center transition-all active:scale-90 ${color}`}
    >
      {icon}
    </button>
  );
}
