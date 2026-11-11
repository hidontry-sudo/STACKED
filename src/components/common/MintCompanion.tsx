'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Coins, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/formatters';

export const MintCompanion: React.FC = () => {
  const { isMintOpen, toggleMint, mintMessages, sendMintMessage, user, currency, isMintThinking } = useStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const simulatedWealth = user.spendingCurrent + user.savingsCurrent + user.investCurrent;
  const wealthFormatted = formatCurrency(simulatedWealth, currency);

  const quickPrompts = [
    `How should I allocate my ${wealthFormatted} at Level ${user.level}?`,
    'What debt payoff strategy works best: avalanche or snowball?',
    'In a small business, how do I balance inventory vs marketing?',
    'How do I budget for taxes and dry months as a freelancer?',
    'What should I do if an emergency crisis wipes out my income?',
  ];

  useEffect(() => {
    if (isMintOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mintMessages, isMintOpen, isMintThinking]);

  if (!isMintOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isMintThinking) return;
    const text = inputText.trim();
    setInputText('');
    sendMintMessage(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-[#121214] border-l border-amber-500/20 flex flex-col shadow-2xl animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#161619]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center text-xl font-black text-black shadow-gold-glow">
                <span>:)</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121214]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-base">MINT</h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  AI Money Guide
                </span>
              </div>
              <p className="text-xs text-zinc-400">Personalized Financial Advisor</p>
            </div>
          </div>
          <button
            onClick={() => toggleMint(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live User Context Bar */}
        <div className="px-4 py-2 bg-[#19191e] border-b border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <User className="w-3 h-3" />
              Lvl {user.level} ({user.levelTitle})
            </span>
            <span className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 font-bold text-white">
              <Coins className="w-3 h-3 text-amber-400" />
              Wealth: {wealthFormatted}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Context Active
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mintMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'mint' && (
                <div className="w-7 h-7 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-black text-black shrink-0 mt-1 shadow-sm">
                  M
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-tr-none'
                    : 'bg-[#1e1e24] text-zinc-200 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-black/60 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking / Streaming Indicator */}
          {isMintThinking && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-7 h-7 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-black text-black shrink-0 mt-1 shadow-sm">
                M
              </div>
              <div className="bg-[#1e1e24] text-zinc-400 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>MINT is tailoring advice to your level & wealth...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/[0.05] bg-[#141417]">
          <p className="text-[11px] font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Open-ended questions to explore:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMintMessage(prompt)}
                disabled={isMintThinking}
                className="shrink-0 px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-amber-400/20 text-zinc-300 hover:text-amber-300 border border-white/5 hover:border-amber-400/30 transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.08] bg-[#161619] flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isMintThinking}
            placeholder="Ask MINT anything about wealth, goals, or budgeting..."
            className="flex-1 bg-[#202026] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isMintThinking || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 active:scale-95 transition-all flex items-center justify-center shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMintThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
