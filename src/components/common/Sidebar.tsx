'use client';

import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  PlayCircle,
  UploadCloud,
  Trophy,
  Sparkles,
  Bot,
  Flame,
  Globe,
  Settings,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppTab } from '@/types';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, user, toggleMint } = useStore();

  const navItems = [
    {
      id: 'dashboard' as AppTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Home',
    },
    {
      id: 'simulations' as AppTab,
      label: 'Simulations',
      icon: Calculator,
      badge: 'Interactive',
    },
    {
      id: 'lessons' as AppTab,
      label: 'Video Lessons',
      icon: PlayCircle,
      badge: '4 Modules',
    },
    {
      id: 'instructor' as AppTab,
      label: 'Instructor Portal',
      icon: UploadCloud,
      badge: 'AI Powered',
    },
    {
      id: 'profile' as AppTab,
      label: 'Growth Path',
      icon: Trophy,
      badge: `Lvl ${user.level}`,
    },
  ];

  const xpProgressPercent = Math.min(
    100,
    Math.round((user.points / user.nextLevelPoints) * 100)
  );

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.08] bg-[#0c0c0e] shrink-0 h-[calc(100vh-61px)] sticky top-[61px] p-4 justify-between">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#1f1d19] text-amber-400 border border-amber-500/30 shadow-inner'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-white/5 text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Guide Mascot Card */}
        <div className="relative rounded-3xl p-4 bg-gradient-to-b from-[#221e17] to-[#151412] border border-amber-500/25 overflow-hidden">
          <div className="absolute top-2 right-2 opacity-15 text-5xl">🪙</div>
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-lg font-black text-black shadow-gold-glow">
              <span className="animate-bounce-subtle">:)</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                MINT AI Coach
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h4>
              <p className="text-[10px] text-zinc-400">24/7 Financial Guide</p>
            </div>
          </div>
          <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
            Stuck on a quiz or curious about investment strategies?
          </p>
          <button
            onClick={() => toggleMint(true)}
            className="w-full py-2 px-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat With MINT</span>
          </button>
        </div>
      </div>

      {/* Bottom User XP & Level Card */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Level {user.level} Goal</span>
          </div>
          <span className="font-extrabold text-amber-300 tabular-nums">
            {user.points} / {user.nextLevelPoints} XP
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#1b1a19] overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setCurrentTab('landing')}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>Marketing Page</span>
          </button>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Live Prototype
          </span>
        </div>
      </div>
    </aside>
  );
};
