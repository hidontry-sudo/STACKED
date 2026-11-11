'use client';

import React from 'react';
import { Flame, Sparkles, Trophy, Bot, LogOut, ChevronDown, UserCheck, GraduationCap, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Header: React.FC = () => {
  const { user, currentTab, setCurrentTab, logout, toggleMint, demoLogin, currency, setCurrency } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0c0c0e]/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-black shadow-gold-glow group-hover:scale-105 transition-transform">
            <span className="text-xl tracking-tighter">S</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white font-sans">
                ST<span className="text-amber-400">A</span>CKED
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 tracking-tight hidden sm:inline">
              Gamified Financial Wealth Engine
            </span>
          </div>
        </div>

        {/* Top Stats Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1a19] border border-amber-500/20 shadow-inner">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-amber-300">{user.streak}</span>
            <span className="text-xs text-zinc-400 hidden sm:inline">days</span>
          </div>

          {/* Dynamic XP Counter */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/20 border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-extrabold text-amber-300 tabular-nums">
              {user.points.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-amber-400/80">XP</span>
          </div>

          {/* Level Badge */}
          <div 
            onClick={() => setCurrentTab('profile')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1c18] border border-amber-500/20 cursor-pointer hover:border-amber-400/40 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-200">
              Lvl {user.level} · {user.levelTitle}
            </span>
          </div>

          {/* Currency Localization Switcher (USD / IDR) */}
          <div className="flex items-center bg-[#151518] p-0.5 rounded-full border border-amber-500/25 shadow-inner">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="USD Currency ($)"
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('IDR')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide transition-all ${
                currency === 'IDR'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Indonesian Rupiah (Rp)"
            >
              Rp IDR
            </button>
          </div>

          {/* MINT Mascot AI Quick Launcher */}
          <button
            onClick={() => toggleMint()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
            title="Chat with MINT, your AI money coach"
          >
            <span className="w-4 h-4 rounded-md bg-black/20 flex items-center justify-center text-[10px]">
              🪙
            </span>
            <span>MINT</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400/40 overflow-hidden bg-zinc-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-zinc-100">{user.name}</p>
                <p className="text-[10px] text-zinc-400 capitalize">{user.role === 'admin' ? 'Instructor / Admin' : 'Student'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 py-2 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-zinc-400">{user.email}</p>
                <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {user.role === 'admin' ? 'Educator Mode' : 'Learner Mode'}
                </span>
              </div>

              <button
                onClick={() => setCurrentTab('profile')}
                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                View Profile & Growth Path
              </button>

              <button
                onClick={() => demoLogin(user.role === 'student' ? 'admin' : 'student')}
                className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-amber-400/10 flex items-center gap-2 transition-colors"
              >
                {user.role === 'student' ? (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to Instructor Mode</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to Student Mode</span>
                  </>
                )}
              </button>

              <div className="border-t border-white/5 my-1"></div>

              <button
                onClick={() => logout()}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
