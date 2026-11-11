'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  DollarSign,
  Wallet,
  PiggyBank,
  Check,
  RotateCcw,
  Sliders,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useStore } from '@/store/useStore';

export const FinancialSimulator: React.FC = () => {
  const {
    simulation,
    updateMonthlyIncome,
    updateIncomeSourceAmount,
    addIncomeSource,
    deleteIncomeSource,
    updateAllocations,
    updateSavingsGoal,
    addSavingsGoal,
    addPoints,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceAmount, setNewSourceAmount] = useState(200);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(1000);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute total monthly income from sources
  const totalMonthlyIncome = useMemo(() => {
    return simulation.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  }, [simulation.incomeSources]);

  // Normalized allocations ensuring sum is 100%
  const { needsRentPercent, wantsSpendingPercent, savingsPercent, investingPercent } = simulation;

  const totalPercent = needsRentPercent + wantsSpendingPercent + savingsPercent + investingPercent;

  // Dollar values
  const needsAmount = Math.round((needsRentPercent / 100) * totalMonthlyIncome);
  const wantsAmount = Math.round((wantsSpendingPercent / 100) * totalMonthlyIncome);
  const savingsAmount = Math.round((savingsPercent / 100) * totalMonthlyIncome);
  const investingAmount = Math.round((investingPercent / 100) * totalMonthlyIncome);

  // Preset Allocation Strategies
  const applyPreset = (preset: '50-30-20' | 'aggressive' | 'starter') => {
    if (preset === '50-30-20') {
      updateAllocations({
        needsRentPercent: 50,
        wantsSpendingPercent: 30,
        savingsPercent: 10,
        investingPercent: 10,
      });
      addPoints(15, 'Applied Balanced 50/30/20 Strategy!');
    } else if (preset === 'aggressive') {
      updateAllocations({
        needsRentPercent: 35,
        wantsSpendingPercent: 15,
        savingsPercent: 15,
        investingPercent: 35,
      });
      addPoints(25, 'Applied Aggressive FIRE Strategy!');
    } else {
      updateAllocations({
        needsRentPercent: 60,
        wantsSpendingPercent: 20,
        savingsPercent: 15,
        investingPercent: 5,
      });
      addPoints(10, 'Applied Student Starter Budget!');
    }
  };

  // Pie Chart Data
  const pieData = [
    { name: 'Needs & Rent', value: needsAmount, color: '#b45309' },
    { name: 'Wants & Lifestyle', value: wantsAmount, color: '#f59e0b' },
    { name: 'Liquid Savings', value: savingsAmount, color: '#fde68a' },
    { name: 'Investments', value: investingAmount, color: '#10b981' },
  ];

  // Dynamic Compound Growth Projection calculation (Years: 1, 3, 5, 10, 15, 20)
  const compoundProjectionData = useMemo(() => {
    const monthlyRate = 0.085 / 12; // 8.5% annual return
    const years = [1, 3, 5, 10, 15, 20];

    return years.map((yr) => {
      const months = yr * 12;
      const principal = investingAmount * months;
      // Future Value of periodic deposits: PMT * ((1 + r)^n - 1) / r
      const futureValue =
        investingAmount > 0
          ? Math.round(investingAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate))
          : 0;
      const compoundInterest = Math.max(0, futureValue - principal);

      return {
        year: `Yr ${yr}`,
        yearsNum: yr,
        principal,
        interest: compoundInterest,
        total: futureValue,
      };
    });
  }, [investingAmount]);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    addIncomeSource(newSourceName.trim(), newSourceAmount);
    setNewSourceName('');
    setShowAddSource(false);
    addPoints(20, 'Added New Income Stream!');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    addSavingsGoal(newGoalName.trim(), newGoalTarget);
    setNewGoalName('');
    setShowAddGoal(false);
    addPoints(20, 'Created New Savings Target!');
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Financial Simulation Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Drag income allocation sliders to test real-time money flow and long-term compound growth.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 hidden sm:inline">Presets:</span>
          <button
            onClick={() => applyPreset('50-30-20')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/30 text-xs font-bold text-zinc-200 hover:text-amber-300 transition-colors"
          >
            50 / 30 / 20 Rule
          </button>
          <button
            onClick={() => applyPreset('aggressive')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition-colors"
          >
            ⚡ Aggressive FIRE
          </button>
          <button
            onClick={() => applyPreset('starter')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 transition-colors"
          >
            Student Starter
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card - Golden */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black shadow-gold-glow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
              INCOME
            </span>
            <Wallet className="w-5 h-5 opacity-70" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black">${totalMonthlyIncome.toLocaleString()}</p>
            <p className="text-xs font-bold opacity-80">monthly total</p>
          </div>
          <div className="text-[10px] font-extrabold bg-black/15 px-2.5 py-1 rounded-full w-fit">
            {simulation.incomeSources.length} Active Streams
          </div>
        </div>

        {/* Savings Card - Light Cream / White pill card */}
        <div className="p-5 rounded-3xl bg-[#f1ece2] text-zinc-900 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600">
              SAVINGS
            </span>
            <PiggyBank className="w-5 h-5 text-zinc-700" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black">${savingsAmount.toLocaleString()}</p>
            <p className="text-xs font-bold text-zinc-600">monthly deposit ({savingsPercent}%)</p>
          </div>
          <div className="text-[10px] font-extrabold bg-black/10 px-2.5 py-1 rounded-full w-fit text-zinc-800">
            Emergency Cushion
          </div>
        </div>

        {/* Invest Card - Dark Sleek */}
        <div className="p-5 rounded-3xl bg-[#17171b] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              INVEST
            </span>
            <span className="text-xs font-bold text-zinc-400">{investingPercent}%</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-white">${investingAmount.toLocaleString()}</p>
            <p className="text-xs text-zinc-400">compounding monthly at 8.5%</p>
          </div>
          <div className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
            ~${compoundProjectionData[3]?.total.toLocaleString()} in 10 yrs
          </div>
        </div>
      </div>

      {/* Mid Section: Sliders & Donut Chart Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Monthly Allocation Sliders</h2>
              <p className="text-xs text-zinc-400">
                Adjust how your monthly income is apportioned across essentials, freedom, and growth.
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalPercent === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}
            >
              Total: {totalPercent}%
            </span>
          </div>

          {/* Slider 1: Needs / Rent */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-700"></span>
                Needs & Rent / Utilities
              </span>
              <span className="font-black text-amber-400 tabular-nums">
                {needsRentPercent}% · ${needsAmount}/mo
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              value={needsRentPercent}
              onChange={(e) =>
                updateAllocations({
                  ...simulation,
                  needsRentPercent: Number(e.target.value),
                })
              }
              className="w-full accent-amber-600 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500">
              Covers housing, groceries, transit, and non-negotiables.
            </p>
          </div>

          {/* Slider 2: Wants & Lifestyle */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                Wants & Discretionary
              </span>
              <span className="font-black text-amber-400 tabular-nums">
                {wantsSpendingPercent}% · ${wantsAmount}/mo
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              value={wantsSpendingPercent}
              onChange={(e) =>
                updateAllocations({
                  ...simulation,
                  wantsSpendingPercent: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500">
              Dining out, concerts, subscriptions, coffee, and entertainment.
            </p>
          </div>

          {/* Slider 3: Savings */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-200"></span>
                Emergency & Liquid Savings
              </span>
              <span className="font-black text-yellow-300 tabular-nums">
                {savingsPercent}% · ${savingsAmount}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={savingsPercent}
              onChange={(e) =>
                updateAllocations({
                  ...simulation,
                  savingsPercent: Number(e.target.value),
                })
              }
              className="w-full accent-yellow-300 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500">
              High-yield savings accounts and emergency cash cushion.
            </p>
          </div>

          {/* Slider 4: Investing */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-emerald-500/20">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                Investing & Compound Assets
              </span>
              <span className="font-black text-emerald-400 tabular-nums">
                {investingPercent}% · ${investingAmount}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={investingPercent}
              onChange={(e) =>
                updateAllocations({
                  ...simulation,
                  investingPercent: Number(e.target.value),
                })
              }
              className="w-full accent-emerald-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-emerald-400/80">
              Broad index funds (S&P 500, Total Market) building generational freedom.
            </p>
          </div>
        </div>

        {/* Money Flow Donut Chart Column (5 cols) matching Screenshot 3 */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-white">Money Flow</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                MONTHLY
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Real-time proportion breakdown of ${totalMonthlyIncome}
            </p>
          </div>

          {/* Donut Chart */}
          <div className="w-full h-56 relative flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2.5 bg-[#1b1b22] border border-white/10 rounded-xl text-xs shadow-lg">
                            <p className="font-bold text-white">{payload[0].name}</p>
                            <p className="text-amber-400 font-extrabold">
                              ${payload[0].value?.toLocaleString()} / month
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-500 text-xs">Loading flow chart...</div>
            )}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Total</span>
              <span className="text-base font-black text-white">${totalMonthlyIncome}</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 mt-2 pt-3 border-t border-white/5">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="font-extrabold text-white tabular-nums">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projected Wealth Bar Chart Section */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">
                Projected Wealth Growth (8.5% Compound Interest)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Watch what happens to your ${investingAmount}/month investment over 20 years. Notice the green interest bar outgrowing your own deposits!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#1c1c24] border border-white/10 text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">20-Year Net Total</span>
            <p className="text-xl font-black text-emerald-400">
              ${compoundProjectionData[5]?.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recharts Stacked Bar Chart */}
        <div className="w-full h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={compoundProjectionData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const principal = (payload[0]?.value as number) || 0;
                      const interest = (payload[1]?.value as number) || 0;
                      const total = principal + interest;
                      return (
                        <div className="p-3.5 bg-[#1b1b22] border border-white/10 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-black text-white border-b border-white/10 pb-1 mb-1">
                            {label} Projection
                          </p>
                          <p className="text-amber-300 font-semibold">
                            Total Out-of-Pocket Deposits: ${principal.toLocaleString()}
                          </p>
                          <p className="text-emerald-400 font-extrabold">
                            Free Compound Growth: +${interest.toLocaleString()}
                          </p>
                          <p className="text-white font-black text-sm pt-1 border-t border-white/10">
                            Total Stacked Wealth: ${total.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '15px' }}
                  formatter={(value) => <span className="text-xs text-zinc-300">{value}</span>}
                />
                <Bar
                  dataKey="principal"
                  name="Principal Deposited"
                  fill="#e5a93c"
                  stackId="wealth"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="interest"
                  name="Compound Interest Earned"
                  fill="#10b981"
                  stackId="wealth"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">Loading bar chart...</div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Income Sources & Savings Goals (Matching Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources (Screenshot 3 Match) */}
        <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              INCOME SOURCES
            </h2>
            <button
              onClick={() => setShowAddSource(!showAddSource)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {showAddSource && (
            <form onSubmit={handleAddSource} className="p-3.5 rounded-2xl bg-[#1c1c24] border border-amber-400/30 space-y-3">
              <h4 className="text-xs font-bold text-white">Add Income Stream</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. Graphic Design"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={newSourceAmount}
                  onChange={(e) => setNewSourceAmount(Number(e.target.value))}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-400 text-black font-bold text-xs rounded-lg hover:bg-amber-300"
                >
                  Save Stream
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {simulation.incomeSources.map((source) => (
              <div
                key={source.id}
                className="p-4 rounded-2xl bg-[#1c1c24] border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white text-sm">{source.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-amber-300 text-sm">${source.amount}</span>
                    <button
                      onClick={() => deleteIncomeSource(source.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={25}
                  value={source.amount}
                  onChange={(e) => updateIncomeSourceAmount(source.id, Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goals (Screenshot 3 Match) */}
        <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              SAVINGS GOALS
            </h2>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {showAddGoal && (
            <form onSubmit={handleAddGoal} className="p-3.5 rounded-2xl bg-[#1c1c24] border border-amber-400/30 space-y-3">
              <h4 className="text-xs font-bold text-white">Create New Goal</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. First Car"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Target ($)"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  className="bg-[#121215] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-400 text-black font-bold text-xs rounded-lg hover:bg-amber-300"
                >
                  Create Target
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {simulation.savingsGoals.map((goal) => {
              const progressPct = Math.min(
                100,
                Math.round((goal.currentAmount / goal.targetAmount) * 100)
              );
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-2xl bg-[#1c1c24] border border-white/5 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-white text-sm">{goal.name}</span>
                    </div>
                    <span className="font-bold text-amber-300">
                      ${goal.currentAmount} / <span className="text-zinc-400">${goal.targetAmount}</span>
                    </span>
                  </div>

                  {/* Dual Bar / Draggable contribution slider */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={goal.targetAmount}
                      step={20}
                      value={goal.currentAmount}
                      onChange={(e) => updateSavingsGoal(goal.id, Number(e.target.value))}
                      className="w-full accent-amber-400 h-1 bg-transparent cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{progressPct}% Completed</span>
                    <span>${goal.targetAmount - goal.currentAmount} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
