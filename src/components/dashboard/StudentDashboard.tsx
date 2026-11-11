'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Shield,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Clock,
  Play,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { mockWealthHistory } from '@/data/mockData';
import { formatCurrency, formatCurrencyCompact } from '@/lib/formatters';
import { DAILY_TASKS_POOL } from '@/data/dailyTasksPool';
import { getDailyTasksForDate } from '@/lib/dailyTasks';

export const StudentDashboard: React.FC = () => {
  const {
    user,
    lessons,
    dailyTasks,
    completeDailyTask,
    setActiveLessonId,
    setCurrentTab,
    toggleMint,
    addPoints,
    currency,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [chartView, setChartView] = useState<'all' | 'actual' | 'projected'>('all');
  const [selectedTaskQuestion, setSelectedTaskQuestion] = useState<string | null>(null);
  const [selectedTaskAnswer, setSelectedTaskAnswer] = useState<number | null>(null);
  const [taskFeedback, setTaskFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Client-side date-seeded random task selector ensures tasks change every 24h but don't re-roll on tab switches
    const todayTasks = getDailyTasksForDate(DAILY_TASKS_POOL, new Date(), 3);
    const currentTaskIds = dailyTasks.map((t) => t.id).sort().join(',');
    const todayTaskIds = todayTasks.map((t) => t.id).sort().join(',');

    if (currentTaskIds !== todayTaskIds) {
      const synced = todayTasks.map((tt) => {
        const found = dailyTasks.find((d) => d.id === tt.id);
        return found ? { ...tt, completed: found.completed } : tt;
      });
      useStore.setState({ dailyTasks: synced });
    }
  }, []);

  const totalMoney = user.spendingCurrent + user.savingsCurrent + user.investCurrent;
  const spendingPct = Math.round((user.spendingCurrent / totalMoney) * 100);
  const savingsPct = Math.round((user.savingsCurrent / totalMoney) * 100);
  const investPct = Math.round((user.investCurrent / totalMoney) * 100);

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;

  const handleTaskAnswer = (taskId: string, optionIndex: number) => {
    const task = dailyTasks.find((t) => t.id === taskId);
    if (!task) return;

    setSelectedTaskAnswer(optionIndex);
    const isCorrect = optionIndex === task.correctIndex;

    if (isCorrect) {
      setTaskFeedback({
        isCorrect: true,
        message: `Correct! +${task.xpReward} XP added to your profile!`,
      });
      completeDailyTask(taskId);
    } else {
      setTaskFeedback({
        isCorrect: false,
        message: `Not quite! The correct answer is: ${task.options[task.correctIndex]}`,
      });
    }

    setTimeout(() => {
      setSelectedTaskQuestion(null);
      setSelectedTaskAnswer(null);
      setTaskFeedback(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner / Hero Greeting matching Screenshot 1 */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1b1916] via-[#141416] to-[#0f0f11] border border-amber-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Ambient radial glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left Column: Greeting & XP Bar */}
          <div className="flex-1 w-full max-w-xl">
            <p className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase mb-1">
              GOOD AFTERNOON, {user.name.split(' ')[0].toUpperCase()}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to stack today?
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 mb-5">
              You are on a <span className="text-amber-300 font-bold">{user.streak}-day streak</span>! Keep making smart financial moves.
            </p>

            {/* XP Bar */}
            <div className="p-4 rounded-2xl bg-[#0c0c0e]/80 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>XP PROGRESS</span>
                </span>
                <span className="text-amber-300 tabular-nums">
                  {user.points.toLocaleString()} / {user.nextLevelPoints.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-800/80 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 shadow-gold-glow"
                  style={{
                    width: `${Math.min(100, (user.points / user.nextLevelPoints) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-zinc-400">
                <span>Lvl {user.level}: {user.levelTitle}</span>
                <span className="text-amber-400 font-semibold">
                  {Math.round((user.points / user.nextLevelPoints) * 100)}% to Level {user.level + 1}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive MINT Mascot Card (Screenshot 1 Match) */}
          <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-[#1f1d19]/90 border border-amber-500/30 text-center w-full max-w-[280px] shadow-gold-glow shrink-0">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center text-4xl font-black text-black shadow-gold-glow transition-transform hover:scale-105">
                <span>:)</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
              </span>
            </div>

            <button
              onClick={() => toggleMint(true)}
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-black tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all mb-2"
            >
              TAP TO CHAT
            </button>

            <p className="text-xs text-zinc-300 font-medium">
              <span className="font-extrabold text-amber-300">MINT</span> is your guide.
            </p>
            <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
              Ask anything about your money.
            </p>
          </div>
        </div>
      </div>

      {/* Gamification Stat Cards Grid (Screenshot 1 & Screenshot 4 Match) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saved This Month - Golden Gradient Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black shadow-gold-glow flex flex-col justify-between group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-85">
              SAVED
            </span>
            <DollarSign className="w-5 h-5 opacity-70" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black tracking-tight">{formatCurrency(user.savedThisMonth, currency)}</p>
            <p className="text-xs font-bold opacity-80 mt-0.5">this month</p>
          </div>
          <div className="text-[10px] font-bold bg-black/15 px-2.5 py-1 rounded-full w-fit">
            +{formatCurrency(184, currency)} this week
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-5 rounded-3xl bg-[#17171a] border border-white/10 hover:border-orange-500/40 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-orange-500" />
              STREAK
            </span>
            <span className="text-xs font-semibold text-zinc-500">Personal Best</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-white tracking-tight">{user.streak} days</p>
            <p className="text-xs text-zinc-400 mt-0.5">keep it alive</p>
          </div>
          <div className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full w-fit border border-orange-500/20">
            Active streak multiplier 1.25x
          </div>
        </div>

        {/* Total Points / Level */}
        <div className="p-5 rounded-3xl bg-[#17171a] border border-white/10 hover:border-amber-500/40 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              RANK & LEVEL
            </span>
            <span className="text-xs font-semibold text-zinc-500">Lvl {user.level}</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-white tracking-tight">{user.points}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{user.levelTitle}</p>
          </div>
          <div className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full w-fit border border-amber-400/20">
            73% to Level {user.level + 1}
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="p-5 rounded-3xl bg-[#17171a] border border-white/10 hover:border-emerald-500/40 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              FIN HEALTH
            </span>
            <span className="text-xs font-semibold text-emerald-400/80">Excellent</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-white tracking-tight">{user.financialHealth}%</p>
            <p className="text-xs text-zinc-400 mt-0.5">Stable & compounding</p>
          </div>
          <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
            Emergency buffer secured
          </div>
        </div>
      </div>

      {/* "YOUR MONEY RIGHT NOW" Card (Exact match to Screenshot 1) */}
      <div className="p-6 rounded-3xl bg-[#151518] border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">
              YOUR MONEY RIGHT NOW
            </p>
            <p className="text-2xl font-black text-white tracking-tight mt-0.5">
              {formatCurrency(totalMoney, currency)}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('simulations')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-3 rounded-full bg-zinc-800 flex overflow-hidden mb-4 p-0.5 gap-1">
          <div
            style={{ width: `${spendingPct}%` }}
            className="h-full bg-amber-700/80 rounded-l-full transition-all"
            title={`Spending: ${formatCurrency(user.spendingCurrent, currency)}`}
          />
          <div
            style={{ width: `${savingsPct}%` }}
            className="h-full bg-amber-400 transition-all"
            title={`Savings: ${formatCurrency(user.savingsCurrent, currency)}`}
          />
          <div
            style={{ width: `${investPct}%` }}
            className="h-full bg-yellow-200 rounded-r-full transition-all"
            title={`Invest: ${formatCurrency(user.investCurrent, currency)}`}
          />
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#1c1c22] border border-white/5">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase flex items-center justify-center gap-1">
              <span>💳</span> SPENDING
            </span>
            <p className="text-lg font-black text-white mt-1">{formatCurrency(user.spendingCurrent, currency)}</p>
            <p className="text-[10px] text-zinc-500 font-medium">{spendingPct}% allocation</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#1c1c22] border border-white/5">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase flex items-center justify-center gap-1">
              <span>🐖</span> SAVINGS
            </span>
            <p className="text-lg font-black text-amber-300 mt-1">{formatCurrency(user.savingsCurrent, currency)}</p>
            <p className="text-[10px] text-zinc-500 font-medium">{savingsPct}% allocation</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#1c1c22] border border-white/5">
            <span className="text-[10px] font-extrabold text-yellow-200 uppercase flex items-center justify-center gap-1">
              <span>📈</span> INVEST
            </span>
            <p className="text-lg font-black text-yellow-200 mt-1">{formatCurrency(user.investCurrent, currency)}</p>
            <p className="text-[10px] text-zinc-500 font-medium">{investPct}% allocation</p>
          </div>
        </div>
      </div>

      {/* Wealth Tracker Recharts Chart */}
      <div className="p-6 rounded-3xl bg-[#151518] border border-white/[0.08] shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Simulated Wealth Tracker</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Net worth compounding trajectory vs traditional zero-investment savings
            </p>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0c0c0e] border border-white/10 text-xs">
            <button
              onClick={() => setChartView('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartView === 'all'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Curves
            </button>
            <button
              onClick={() => setChartView('actual')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartView === 'actual'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Net Worth
            </button>
            <button
              onClick={() => setChartView('projected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartView === 'projected'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Baseline
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWealthHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="stackedGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5a93c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e5a93c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="baselineGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => formatCurrencyCompact(val, currency)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-[#1e1e24] border border-amber-400/40 rounded-xl shadow-xl text-xs">
                          <p className="font-extrabold text-white mb-1.5">{label}</p>
                          <p className="text-amber-400 font-bold">
                            With STACKED: {formatCurrency(payload[0]?.value as number, currency)}
                          </p>
                          {payload[1] && (
                            <p className="text-zinc-400">
                              Without STACKED: {formatCurrency(payload[1]?.value as number, currency)}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(chartView === 'all' || chartView === 'actual') && (
                  <Area
                    type="monotone"
                    dataKey="projectedWithStacked"
                    name="With STACKED"
                    stroke="#e5a93c"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#stackedGold)"
                  />
                )}
                {(chartView === 'all' || chartView === 'projected') && (
                  <Area
                    type="monotone"
                    dataKey="projectedWithoutStacked"
                    name="Standard Savings"
                    stroke="#71717a"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#baselineGray)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">Loading chart...</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <strong className="text-zinc-200">With STACKED Strategies</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-zinc-500"></span>
              <span>Zero-Investment Baseline</span>
            </span>
          </div>
          <span className="text-amber-300 font-semibold mt-1 sm:mt-0">
            +{formatCurrency(1570, currency)} projected delta by May
          </span>
        </div>
      </div>

      {/* Two Column Section: Course Modules & Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course List & Carousel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Financial Learning Modules</h2>
            </div>
            <button
              onClick={() => setCurrentTab('lessons')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All 4</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  setCurrentTab('lessons');
                }}
                className="p-5 rounded-3xl bg-[#161619] border border-white/[0.08] hover:border-amber-400/50 hover:bg-[#1a1a1f] transition-all cursor-pointer flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {lesson.category}
                    </span>
                    {lesson.completed ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{lesson.pointsReward} XP</span>
                  </div>

                  <button className="flex items-center gap-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-xl group-hover:scale-105 transition-all">
                    <Play className="w-3 h-3 fill-black" />
                    <span>{lesson.completed ? 'Review' : 'Play'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Daily Tasks (Screenshot 2 Match) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <h2 className="text-lg font-black text-white">Daily Tasks</h2>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-[#1c1a17] px-2.5 py-1 rounded-full border border-amber-500/20">
              {completedTasksCount}/{dailyTasks.length} keeps streak
            </span>
          </div>

          <div className="space-y-2.5">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-[#121214] border-emerald-500/30 opacity-75'
                    : 'bg-[#17171b] border-white/10 hover:border-amber-400/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    {task.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
                    <Zap className="w-3 h-3 fill-amber-400" />
                    <span>+{task.xpReward}</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-zinc-100">{task.title}</p>

                {task.completed ? (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </div>
                ) : selectedTaskQuestion === task.id ? (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs text-amber-200">{task.question}</p>
                    {task.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTaskAnswer(task.id, idx)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                          selectedTaskAnswer === idx
                            ? idx === task.correctIndex
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : 'bg-rose-500/20 border-rose-400 text-rose-200'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    {taskFeedback && (
                      <p
                        className={`text-[11px] font-bold mt-1 ${
                          taskFeedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {taskFeedback.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedTaskQuestion(task.id)}
                    className="mt-2 text-[11px] font-extrabold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Answer Quest</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Ask MINT helper banner (Screenshot 2 Match) */}
          <div className="p-4 rounded-2xl bg-[#1c1a17] border border-amber-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-black text-black">
                :)
              </div>
              <div>
                <p className="text-xs font-bold text-white">Stuck on a lesson?</p>
                <p className="text-[10px] text-zinc-400">Ask MINT to explain anything, your way.</p>
              </div>
            </div>
            <button
              onClick={() => toggleMint(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/30 text-xs font-bold text-amber-300 hover:bg-amber-400/30 transition-colors"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
