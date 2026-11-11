'use client';

import React from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Shield,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Lock,
  Settings,
  User,
  Share2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/formatters';

export const ProfileView: React.FC = () => {
  const { user, setCurrentTab, currency } = useStore();

  const growthStages = [
    { level: 1, title: 'Spender', xp: 0, unlocked: true, icon: '🌱' },
    { level: 2, title: 'Tracker', xp: 250, unlocked: true, icon: '📒' },
    { level: 3, title: 'Planner', xp: 600, unlocked: true, icon: '🗺️' },
    { level: 4, title: 'Saver', xp: 1200, unlocked: true, current: true, icon: '💰' },
    { level: 5, title: 'Investor', xp: 2000, unlocked: false, icon: '📈' },
    { level: 6, title: 'Wealth Architect', xp: 3500, unlocked: false, icon: '👑' },
  ];

  const trophies = [
    { id: 't1', title: 'First Stack', desc: 'Saved your first $100', icon: '🪙', unlocked: true },
    { id: 't2', title: 'Streak Flame', desc: 'Maintained 7 days unbroken', icon: '🔥', unlocked: true },
    { id: 't3', title: 'APR Slayer', desc: 'Mastered credit card traps quiz', icon: '⚔️', unlocked: true },
    { id: 't4', title: 'Compound King', desc: 'Ran 20-year wealth simulation', icon: '📊', unlocked: true },
    { id: 't5', title: 'Zero-Debt Cadet', desc: 'Allocated 20% to emergency fund', icon: '🛡️', unlocked: true },
    { id: 't6', title: 'MINT Confidant', desc: 'Asked MINT 5 financial questions', icon: '🤖', unlocked: true },
    { id: 't7', title: 'High Yield Pioneer', desc: 'Achieved 80%+ Financial Health', icon: '💎', unlocked: false },
    { id: 't8', title: 'Century Club', desc: 'Earned 2,000 XP (Level 5)', icon: '🏆', unlocked: false },
  ];

  return (
    <div className="space-y-8 pb-20 animate-fade-in max-w-4xl mx-auto">
      {/* Profile Header Card (Screenshot 4 Match) */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1b1916] to-[#121215] border border-amber-500/25 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar with Mascot Styling */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 p-1 shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-[#1a1815] flex items-center justify-center text-4xl font-black text-amber-300">
                <span>:)</span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#121215] flex items-center justify-center text-[10px] text-black font-black">
              ✓
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
          <p className="text-xs text-zinc-400 mt-1">
            {user.username} · joined {user.joinedDate}
          </p>

          {/* Level Title Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs shadow-gold-glow mt-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>Lvl {user.level} · {user.levelTitle}</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Grid (Screenshot 4 Match) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#161619] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">TOTAL SAVINGS</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(user.spendingCurrent + user.savingsCurrent + user.investCurrent, currency)}</p>
          <p className="text-[10px] text-amber-400 font-bold">+{formatCurrency(user.savedThisMonth, currency)} this week</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#161619] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">XP EARNED</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{user.points}</p>
          <p className="text-[10px] text-amber-400 font-bold">
            {Math.round((user.points / user.nextLevelPoints) * 100)}% to Lvl {user.level + 1}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#161619] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">FIN HEALTH</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{user.financialHealth}%</p>
          <p className="text-[10px] text-emerald-400 font-bold">Stable & low debt</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#161619] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400" /> STREAK
            </span>
          </div>
          <p className="text-2xl font-black text-white">{user.streak} days</p>
          <p className="text-[10px] text-zinc-400">Personal best</p>
        </div>
      </div>

      {/* Growth Path Section (Screenshot 4 Match) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Growth Path</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              You are growing financially over time.
            </p>
          </div>
          <span className="text-[10px] font-black tracking-wider uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            TAP TO PREVIEW
          </span>
        </div>

        {/* Level Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {growthStages.map((stage) => (
            <div
              key={stage.level}
              className={`p-4 rounded-2xl border text-center transition-all ${
                stage.current
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-gold-glow'
                  : stage.unlocked
                  ? 'bg-[#1b1b22] border-white/10 text-zinc-200'
                  : 'bg-[#121215] border-white/5 text-zinc-600 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{stage.icon}</div>
              <span className="text-[10px] font-bold block uppercase tracking-wider">
                LVL {stage.level}
              </span>
              <p className="text-xs font-black mt-0.5">{stage.title}</p>
              <p className="text-[10px] text-zinc-500 mt-1">{stage.xp} XP</p>
              {stage.current && (
                <span className="mt-1.5 inline-block text-[9px] font-black bg-amber-400 text-black px-2 py-0.5 rounded-full">
                  CURRENT
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar Between Lvl 4 & 5 */}
        <div className="p-4 rounded-2xl bg-[#1a1a20] border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-zinc-400">Lvl 4 ({user.levelTitle})</span>
            <span className="text-amber-300">{user.points} / {user.nextLevelPoints} XP</span>
            <span className="text-zinc-400">Lvl 5 (Investor)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${(user.points / user.nextLevelPoints) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trophy Case (Screenshot 4 Match: Trophy case 6/8) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Trophy Case</h3>
          </div>
          <span className="text-xs font-extrabold text-amber-300 bg-[#1c1a17] px-3 py-1 rounded-full border border-amber-500/20">
            {trophies.filter((t) => t.unlocked).length} / {trophies.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {trophies.map((trophy) => (
            <div
              key={trophy.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                trophy.unlocked
                  ? 'bg-[#1b1b22] border-amber-500/20 hover:border-amber-400/40'
                  : 'bg-[#121215] border-white/5 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{trophy.icon}</div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{trophy.title}</h4>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{trophy.desc}</p>
              <div className="mt-2">
                {trophy.unlocked ? (
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Earned
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full flex items-center justify-center gap-1 w-fit mx-auto">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
