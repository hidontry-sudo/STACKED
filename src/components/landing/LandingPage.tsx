'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bot,
  PlayCircle,
  Trophy,
  Flame,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AuthModal } from '../auth/AuthModal';

export const LandingPage: React.FC = () => {
  const { setCurrentTab } = useStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-black shadow-gold-glow">
              <span className="text-xl">S</span>
            </div>
            <span className="font-extrabold text-xl tracking-wider text-white">
              ST<span className="text-amber-400">A</span>CKED
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => openAuth('login')} className="hover:text-amber-400 transition-colors">
              Simulation Sandbox
            </button>
            <button onClick={() => openAuth('login')} className="hover:text-amber-400 transition-colors">
              Curriculum
            </button>
            <button onClick={() => openAuth('login')} className="hover:text-amber-400 transition-colors">
              Educators
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 active:scale-95 transition-all shadow-gold-glow"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Gamified Financial Literacy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Stack Knowledge. <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Stack Wealth.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Master the financial game before you play with real cash. Learn budgeting, defeat high-interest debt, simulate 30-year compound growth, and level up with our AI guide, MINT.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => openAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-gold-glow flex items-center justify-center gap-2 group"
              >
                <span>Start Your Financial Quest</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1e1c19] border border-amber-500/20 hover:border-amber-400/50 text-amber-300 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Instant Sign In & Demo</span>
              </button>
            </div>

            {/* Micro Social Proof */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
              <div className="flex -space-x-2">
                <img className="w-7 h-7 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" alt="avatar" />
                <img className="w-7 h-7 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="avatar" />
                <img className="w-7 h-7 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" alt="avatar" />
              </div>
              <div>
                <span className="font-bold text-white">50,000+</span> young adults stacking wealth
              </div>
              <div className="hidden sm:flex items-center gap-1 text-amber-400">
                <span>★★★★★</span>
                <span className="text-zinc-400 font-medium">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right Mockup Showcase (Inspired by user screenshots) */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center z-10">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[2.5rem] bg-[#141416] border border-amber-500/30 p-5 shadow-2xl shadow-amber-500/10">
              {/* Top phone bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
                <div className="flex items-center gap-1.5 font-black text-white">
                  <span>STACKED</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-[#1c1a17] px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>7</span>
                </div>
              </div>

              {/* Mascot Mini Widget */}
              <div className="my-4 p-4 rounded-3xl bg-[#1c1a17] border border-amber-500/20 text-center flex flex-col items-center">
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-2">
                  GOOD AFTERNOON, ALEX
                </p>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl font-black text-black shadow-gold-glow mb-2">
                  <span>:)</span>
                </div>
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2 hover:bg-amber-400/30 transition-colors"
                >
                  TAP TO CHAT
                </button>
                <p className="text-[11px] text-zinc-400">
                  MINT is your guide. Ask anything about your money.
                </p>
              </div>

              {/* XP Bar */}
              <div className="p-3 rounded-2xl bg-[#1b1a19] border border-white/5 mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> XP
                  </span>
                  <span className="font-extrabold text-amber-300">1,240 / 2,000</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#121214] overflow-hidden">
                  <div className="w-[62%] h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" />
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black shadow-md">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    SAVED
                  </span>
                  <p className="text-xl font-black mt-0.5">$184</p>
                  <p className="text-[10px] font-semibold opacity-75">this month</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#1c1a17] border border-white/5">
                  <div className="flex items-center gap-1 text-orange-400 text-[10px] uppercase font-bold">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>STREAK</span>
                  </div>
                  <p className="text-xl font-black text-white mt-0.5">7 days</p>
                  <p className="text-[10px] text-zinc-400">keep it alive</p>
                </div>
              </div>

              {/* Click to launch preview */}
              <button
                onClick={() => openAuth('login')}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Launch Interactive Prototype</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-8 border-t border-white/[0.06] bg-[#0f0f12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-2">
              ENGINEERED FOR REAL WEALTH
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Everything traditional schools never taught you about money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div 
              onClick={() => openAuth('login')}
              className="p-6 rounded-3xl bg-[#17171c] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Financial Simulation Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Drag dynamic income allocation sliders and watch your 10-year compound interest bar chart & monthly pie chart react in real time.
              </p>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Try Simulator &rarr;
              </span>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => openAuth('login')}
              className="p-6 rounded-3xl bg-[#17171c] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Video Lessons & Chapters
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Crisp video breakdowns of APR, 50/30/20 budgets, and index funds with clickable chapter timestamps to jump straight to core lessons.
              </p>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Curriculum &rarr;
              </span>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => openAuth('login')}
              className="p-6 rounded-3xl bg-[#17171c] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Instant Interactive Quizzes
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Immediate green/red visual validation, XP rewards, streak multipliers, and confetti celebrations upon completion.
              </p>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Take A Quiz &rarr;
              </span>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => openAuth('login')}
              className="p-6 rounded-3xl bg-[#17171c] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Instructor AI Studio
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Drag and drop video lessons. Watch a 3-second animated upload progress bar, then generate AI-synthesized quizzes in one click.
              </p>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Educator Studio &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-16 px-4 sm:px-8 border-t border-white/[0.08] text-center bg-gradient-to-b from-[#0c0c0e] to-[#151412]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Stack Your Wealth?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-8">
            Join thousands mastering financial freedom through gamified lessons, simulations, and AI feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openAuth('login')}
              className="px-8 py-3.5 rounded-2xl bg-amber-400 text-black font-extrabold text-sm hover:bg-amber-300 active:scale-95 transition-all shadow-gold-glow"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 text-white font-bold text-sm transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-8 border-t border-white/[0.06] text-center text-xs text-zinc-500">
        <p>© 2026 STACKED. Built for next-generation financial literacy.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
};
