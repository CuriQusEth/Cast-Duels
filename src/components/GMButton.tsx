import React, { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';

export function GMButton() {
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  if (!isConnected) return null;

  const sendGMTransaction = async () => {
    setStatus('pending');
    try {
      // Contract on Base Mainnet: 0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3
      // Under Denim (200ms canonical blocks), transaction confirmation occurs almost instantly!
      await sendTransactionAsync({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        data: '0x',
        value: 0n,
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3500);
    } catch (err) {
      console.error('GM transaction error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button 
      onClick={sendGMTransaction}
      disabled={status === 'pending'}
      className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      title="Say GM on Base Mainnet (Denim 200ms)"
    >
      <Sun size={14} className={status === 'pending' ? 'animate-spin' : ''} />
      <span>
        {status === 'pending' 
          ? 'SENDING...' 
          : status === 'success' 
          ? 'GM SENT (200ms ⚡)' 
          : status === 'error'
          ? 'RETRY GM'
          : 'SAY GM'}
      </span>
    </button>
  );
}
