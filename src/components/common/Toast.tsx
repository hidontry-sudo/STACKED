'use client';

import React from 'react';
import { Sparkles, Trophy, CheckCircle, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useStore();

  if (!toast || !toast.show) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 animate-bounce-subtle pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e1c18] border border-amber-400/40 text-white shadow-2xl shadow-amber-500/20 max-w-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black shrink-0 shadow-gold-glow">
          {toast.type === 'award' ? (
            <Trophy className="w-5 h-5 text-black" />
          ) : (
            <Sparkles className="w-5 h-5 text-black" />
          )}
        </div>
        <div className="flex-1 pr-1">
          <p className="text-xs font-bold text-amber-300">
            {toast.points ? `+${toast.points} XP Earned!` : 'Achievement Unlocked'}
          </p>
          <p className="text-xs text-zinc-200 leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
