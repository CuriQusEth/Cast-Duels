import React from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';
import { Sun } from 'lucide-react';

export function GMButton() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  if (!isConnected) return null;

  const sendGMTransaction = () => {
    writeContract({
      address: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      abi: parseAbi(['function sayGM()']), // Assuming there is a sayGM function. If unknown, we could just send a transaction without data if we just want to send ETH, but usually it calls a contract.
      functionName: 'sayGM',
      // If we don't know the exact ABI, wait, standard might not matter, if we just use a generic 'sayGM'
    });
  };

  return (
    <button 
      onClick={sendGMTransaction}
      disabled={isPending}
      className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
    >
      <Sun size={14} className={isPending ? "animate-spin" : ""} />
      {isPending ? "SENDING..." : "SAY GM"}
    </button>
  );
}
