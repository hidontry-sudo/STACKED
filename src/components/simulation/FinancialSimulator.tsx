'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  Wallet,
  PiggyBank,
  Check,
  Sliders,
  Target,
  Briefcase,
  Store,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { mockSimulationScenarios } from '@/data/mockData';
import { formatCurrency, formatCurrencyCompact } from '@/lib/formatters';

export const FinancialSimulator: React.FC = () => {
  const {
    simulation,
    updateAllocations,
    updateIncomeSourceAmount,
    addIncomeSource,
    deleteIncomeSource,
    updateSavingsGoal,
    addSavingsGoal,
    addPoints,
    currency,
    activeScenarioId,
    setActiveScenarioId,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceAmount, setNewSourceAmount] = useState(200);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(1000);

  // Scenario 2: Freelance State
  const [freelanceRevenue, setFreelanceRevenue] = useState(3200);
  const [taxReservePercent, setTaxReservePercent] = useState(25);
  const [essentialNeedsPercent, setEssentialNeedsPercent] = useState(40);
  const [dryMonthBufferPercent, setDryMonthBufferPercent] = useState(20);
  const [businessGrowthPercent, setBusinessGrowthPercent] = useState(15);

  // Scenario 3: Small Business Setup State
  const [seedCapital, setSeedCapital] = useState(10000);
  const [inventoryPercent, setInventoryPercent] = useState(35);
  const [marketingPercent, setMarketingPercent] = useState(30);
  const [operationsPercent, setOperationsPercent] = useState(15);
  const [workingReservePercent, setWorkingReservePercent] = useState(20);

  // Scenario 4: Emergency Fund Crisis State
  const [emergencySavings, setEmergencySavings] = useState(6000);
  const [baselineExpense, setBaselineExpense] = useState(2200);
  const [austerityCutPercent, setAusterityCutPercent] = useState(35);
  const [gigBridgeIncome, setGigBridgeIncome] = useState(600);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeScenario = useMemo(() => {
    return (
      mockSimulationScenarios.find((s) => s.id === activeScenarioId) ||
      mockSimulationScenarios[0]
    );
  }, [activeScenarioId]);

  // ==========================================
  // SCENARIO 1: PERSONAL WEALTH CALCULATIONS
  // ==========================================
  const totalMonthlyIncome = useMemo(() => {
    return simulation.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  }, [simulation.incomeSources]);

  const { needsRentPercent, wantsSpendingPercent, savingsPercent, investingPercent } = simulation;
  const totalPercent = needsRentPercent + wantsSpendingPercent + savingsPercent + investingPercent;

  const needsAmount = Math.round((needsRentPercent / 100) * totalMonthlyIncome);
  const wantsAmount = Math.round((wantsSpendingPercent / 100) * totalMonthlyIncome);
  const savingsAmount = Math.round((savingsPercent / 100) * totalMonthlyIncome);
  const investingAmount = Math.round((investingPercent / 100) * totalMonthlyIncome);

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

  const personalWealthPieData = [
    { name: 'Needs & Rent', value: needsAmount, color: '#b45309' },
    { name: 'Wants & Lifestyle', value: wantsAmount, color: '#f59e0b' },
    { name: 'Liquid Savings', value: savingsAmount, color: '#fde68a' },
    { name: 'Investments', value: investingAmount, color: '#10b981' },
  ];

  const compoundProjectionData = useMemo(() => {
    const monthlyRate = 0.085 / 12;
    const years = [1, 3, 5, 10, 15, 20];

    return years.map((yr) => {
      const months = yr * 12;
      const principal = investingAmount * months;
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

  // ==========================================
  // SCENARIO 2: FREELANCE BUDGETING CALCULATIONS
  // ==========================================
  const freelanceTaxAmount = Math.round((taxReservePercent / 100) * freelanceRevenue);
  const freelanceNeedsAmount = Math.round((essentialNeedsPercent / 100) * freelanceRevenue);
  const freelanceBufferAmount = Math.round((dryMonthBufferPercent / 100) * freelanceRevenue);
  const freelanceGrowthAmount = Math.round((businessGrowthPercent / 100) * freelanceRevenue);
  const freelanceTotalPercent =
    taxReservePercent + essentialNeedsPercent + dryMonthBufferPercent + businessGrowthPercent;

  const freelancePieData = [
    { name: 'Tax Reserve (IRS)', value: freelanceTaxAmount, color: '#f59e0b' },
    { name: 'Lean Living Needs', value: freelanceNeedsAmount, color: '#b45309' },
    { name: 'Slush / Dry Buffer', value: freelanceBufferAmount, color: '#fde68a' },
    { name: 'Tooling & 401(k)', value: freelanceGrowthAmount, color: '#10b981' },
  ];

  const freelanceProjectionData = useMemo(() => {
    // 12-month simulation of volatile client revenue vs smoothed salary draw & buffer cushion
    const seasonality = [1.2, 0.9, 0.65, 1.1, 1.3, 0.5, 0.85, 1.25, 1.0, 0.7, 1.15, 1.35];
    let cumulativeBuffer = freelanceBufferAmount * 2; // initial baseline

    return seasonality.map((factor, idx) => {
      const monthInvoice = Math.round(freelanceRevenue * factor);
      const stableNeedsDraw = Math.round((essentialNeedsPercent / 100) * freelanceRevenue);
      const taxDeducted = Math.round((taxReservePercent / 100) * monthInvoice);
      const netMonthTake = monthInvoice - taxDeducted;
      const monthSurplusOrDeficit = netMonthTake - stableNeedsDraw;
      cumulativeBuffer = Math.max(0, cumulativeBuffer + monthSurplusOrDeficit);

      return {
        month: `M${idx + 1}`,
        invoicedRevenue: monthInvoice,
        takeHomeSalary: stableNeedsDraw,
        bufferFund: cumulativeBuffer,
      };
    });
  }, [freelanceRevenue, essentialNeedsPercent, taxReservePercent, freelanceBufferAmount]);

  // ==========================================
  // SCENARIO 3: SMALL BUSINESS SETUP CALCULATIONS
  // ==========================================
  const inventoryAmount = Math.round((inventoryPercent / 100) * seedCapital);
  const marketingAmount = Math.round((marketingPercent / 100) * seedCapital);
  const operationsAmount = Math.round((operationsPercent / 100) * seedCapital);
  const workingReserveAmount = Math.round((workingReservePercent / 100) * seedCapital);
  const businessTotalPercent =
    inventoryPercent + marketingPercent + operationsPercent + workingReservePercent;

  const businessPieData = [
    { name: 'Inventory & Stock', value: inventoryAmount, color: '#3b82f6' },
    { name: 'Marketing & Ads', value: marketingAmount, color: '#f59e0b' },
    { name: 'Operations & Tech', value: operationsAmount, color: '#8b5cf6' },
    { name: 'Working Reserve', value: workingReserveAmount, color: '#10b981' },
  ];

  const businessProjectionData = useMemo(() => {
    // 12-Month Break-Even Curve driven by Inventory vs Marketing balance
    // Optimal ratio: Marketing drives acquisition, Inventory fulfills orders
    const balanceFactor = Math.min(inventoryPercent, marketingPercent) / 30;
    const initialSpend = inventoryAmount + operationsAmount + marketingAmount * 0.5;

    let cumulativeCost = initialSpend;
    let cumulativeRevenue = 0;

    return Array.from({ length: 12 }, (_, i) => {
      const month = `M${i + 1}`;
      const monthlyAdSpend = Math.round((marketingAmount * 0.5) / 12) + (i > 3 ? i * 150 : 50);
      const monthlyOpCost = Math.round(operationsAmount / 12);
      cumulativeCost += monthlyAdSpend + monthlyOpCost;

      // Monthly sales scale up based on inventory available and marketing traction
      const baseMonthlySales = (seedCapital * 0.22 * Math.log(i + 2) * balanceFactor);
      cumulativeRevenue += Math.round(baseMonthlySales);

      return {
        month,
        cumulativeCosts: cumulativeCost,
        cumulativeRevenue: Math.round(cumulativeRevenue),
        profitMargin: Math.round(cumulativeRevenue - cumulativeCost),
      };
    });
  }, [seedCapital, inventoryPercent, marketingPercent, inventoryAmount, operationsAmount, marketingAmount]);

  // ==========================================
  // SCENARIO 4: EMERGENCY FUND CRISIS CALCULATIONS
  // ==========================================
  const austerityCutAmount = Math.round((austerityCutPercent / 100) * baselineExpense);
  const austerityExpense = Math.max(300, baselineExpense - austerityCutAmount);
  const netMonthlyBurn = Math.max(50, austerityExpense - gigBridgeIncome);
  const standardRunwayMonths = (emergencySavings / Math.max(100, baselineExpense)).toFixed(1);
  const extendedRunwayMonths = (emergencySavings / Math.max(50, netMonthlyBurn)).toFixed(1);

  const crisisPieData = [
    { name: 'Surviving Living Cost', value: austerityExpense, color: '#ef4444' },
    { name: 'Austerity Spending Cuts', value: austerityCutAmount, color: '#f59e0b' },
    { name: 'Gig Bridge Offset', value: gigBridgeIncome, color: '#10b981' },
  ];

  const crisisProjectionData = useMemo(() => {
    // 12-Month Cash Depletion comparison: Without Cuts vs With Austerity & Gig Bridge
    return Array.from({ length: 13 }, (_, i) => {
      const month = `M${i}`;
      const withoutCuts = Math.max(0, Math.round(emergencySavings - i * baselineExpense));
      const withAusterity = Math.max(0, Math.round(emergencySavings - i * netMonthlyBurn));

      return {
        month,
        withoutAusterity: withoutCuts,
        withAusterity: withAusterity,
      };
    });
  }, [emergencySavings, baselineExpense, netMonthlyBurn]);

  // Handlers for personal wealth sources/goals
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
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Financial Simulation Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Test real-world financial scenarios, stress-test irregular cash flows, and simulate long-term growth.
          </p>
        </div>

        {/* Currency Reminder Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#17171b] border border-amber-500/25 text-amber-300 font-bold">
            Active Currency: {currency} ({currency === 'IDR' ? 'Indonesian Rupiah' : 'US Dollar'})
          </span>
        </div>
      </div>

      {/* 4 Scenario Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
            CHOOSE SCENARIO
          </span>
          <span className="text-xs text-amber-400 font-bold">
            {mockSimulationScenarios.length} Advanced Scenarios Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockSimulationScenarios.map((sc) => {
            const isSelected = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  addPoints(10, `Loaded ${sc.title} Simulation!`);
                }}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e1c18] border-amber-400 text-white shadow-gold-glow scale-[1.02]'
                    : 'bg-[#141417] border-white/10 text-zinc-300 hover:border-amber-400/40 hover:bg-[#18181d]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/5 text-zinc-400 border border-white/5'
                      }`}
                    >
                      {sc.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <h3 className="font-extrabold text-sm text-white mb-1">{sc.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-bold text-amber-300 flex items-center justify-between">
                  <span>{sc.category}</span>
                  <span className="text-zinc-500">Select →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCENARIO 1: PERSONAL WEALTH BUILDING VIEW */}
      {/* ======================================================== */}
      {activeScenario.id === 'personal-wealth' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#141417] border border-white/5">
            <span className="text-xs font-bold text-zinc-400">Quick Strategy Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
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

          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black shadow-gold-glow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
                  MONTHLY INCOME
                </span>
                <Wallet className="w-5 h-5 opacity-70" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(totalMonthlyIncome, currency)}</p>
                <p className="text-xs font-bold opacity-80">total cash inflow</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/15 px-2.5 py-1 rounded-full w-fit">
                {simulation.incomeSources.length} Active Streams
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#f1ece2] text-zinc-900 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600">
                  LIQUID SAVINGS
                </span>
                <PiggyBank className="w-5 h-5 text-zinc-700" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(savingsAmount, currency)}</p>
                <p className="text-xs font-bold text-zinc-600">monthly deposit ({savingsPercent}%)</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/10 px-2.5 py-1 rounded-full w-fit text-zinc-800">
                Emergency Cushion Buffer
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#17171b] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  INVEST & COMPOUND
                </span>
                <span className="text-xs font-bold text-zinc-400">{investingPercent}%</span>
              </div>
              <div className="my-2">
                <p className="text-3xl font-black text-white">{formatCurrency(investingAmount, currency)}</p>
                <p className="text-xs text-zinc-400">compounding monthly at 8.5%</p>
              </div>
              <div className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                ~{formatCurrency(compoundProjectionData[3]?.total, currency)} in 10 yrs
              </div>
            </div>
          </div>

          {/* Sliders & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Monthly Allocation Sliders</h2>
                  <p className="text-xs text-zinc-400">
                    Adjust how your income is divided between needs, wants, and long-term assets.
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

              {/* Slider 1: Needs */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-700"></span>
                    Needs & Rent / Utilities
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    {needsRentPercent}% · {formatCurrency(needsAmount, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={needsRentPercent}
                  onChange={(e) =>
                    updateAllocations({ ...simulation, needsRentPercent: Number(e.target.value) })
                  }
                  className="w-full accent-amber-600 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Wants */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    Wants & Lifestyle
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    {wantsSpendingPercent}% · {formatCurrency(wantsAmount, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={wantsSpendingPercent}
                  onChange={(e) =>
                    updateAllocations({ ...simulation, wantsSpendingPercent: Number(e.target.value) })
                  }
                  className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Savings */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-200"></span>
                    Emergency & Liquid Savings
                  </span>
                  <span className="font-black text-yellow-300 tabular-nums">
                    {savingsPercent}% · {formatCurrency(savingsAmount, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={savingsPercent}
                  onChange={(e) =>
                    updateAllocations({ ...simulation, savingsPercent: Number(e.target.value) })
                  }
                  className="w-full accent-yellow-300 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Investing */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-emerald-500/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    Investing & Compound Assets
                  </span>
                  <span className="font-black text-emerald-400 tabular-nums">
                    {investingPercent}% · {formatCurrency(investingAmount, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={investingPercent}
                  onChange={(e) =>
                    updateAllocations({ ...simulation, investingPercent: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white">Monthly Cash Flow</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                    FLOW BREAKDOWN
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Distribution of {formatCurrency(totalMonthlyIncome, currency)} monthly income
                </p>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={personalWealthPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {personalWealthPieData.map((entry, index) => (
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
                                  {formatCurrency(payload[0].value as number, currency)} / month
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
                  <span className="text-sm font-black text-white">
                    {formatCurrency(totalMonthlyIncome, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-white/5">
                {personalWealthPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 20-Year Compound Growth Chart */}
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
                  Watch what happens to your {formatCurrency(investingAmount, currency)}/month investment over 20 years.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#1c1c24] border border-white/10 text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">20-Year Net Total</span>
                <p className="text-xl font-black text-emerald-400">
                  {formatCurrency(compoundProjectionData[5]?.total, currency)}
                </p>
              </div>
            </div>

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
                      tickFormatter={(val) => formatCurrencyCompact(val, currency)}
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
                                Out-of-Pocket Deposits: {formatCurrency(principal, currency)}
                              </p>
                              <p className="text-emerald-400 font-extrabold">
                                Compound Growth: +{formatCurrency(interest, currency)}
                              </p>
                              <p className="text-white font-black text-sm pt-1 border-t border-white/10">
                                Total Stacked Wealth: {formatCurrency(total, currency)}
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
                <div className="h-full flex items-center justify-center text-zinc-500">
                  Loading bar chart...
                </div>
              )}
            </div>
          </div>

          {/* Income Sources & Savings Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <span>Add Stream</span>
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
                  <div key={source.id} className="p-4 rounded-2xl bg-[#1c1c24] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white text-sm">{source.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-amber-300 text-sm">
                          {formatCurrency(source.amount, currency)}
                        </span>
                        <button
                          onClick={() => deleteIncomeSource(source.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
                  <span>Add Goal</span>
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
                    <div key={goal.id} className="p-4 rounded-2xl bg-[#1c1c24] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-extrabold text-white text-sm">{goal.name}</span>
                        </div>
                        <span className="font-bold text-amber-300">
                          {formatCurrency(goal.currentAmount, currency)} /{' '}
                          <span className="text-zinc-400">{formatCurrency(goal.targetAmount, currency)}</span>
                        </span>
                      </div>

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
                        <span>{formatCurrency(goal.targetAmount - goal.currentAmount, currency)} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 2: FREELANCE BUDGETING VIEW */}
      {/* ======================================================== */}
      {activeScenario.id === 'freelance-budgeting' && (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black shadow-gold-glow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-85">
                  MONTHLY CLIENT REVENUE
                </span>
                <Briefcase className="w-5 h-5 opacity-70" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(freelanceRevenue, currency)}</p>
                <p className="text-xs font-bold opacity-80">gross monthly invoices</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/15 px-2.5 py-1 rounded-full w-fit">
                Tax Deducted: {formatCurrency(freelanceTaxAmount, currency)}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#f1ece2] text-zinc-900 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600">
                  DRY-MONTH BUFFER
                </span>
                <ShieldCheck className="w-5 h-5 text-zinc-700" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(freelanceBufferAmount, currency)}</p>
                <p className="text-xs font-bold text-zinc-600">monthly allocation ({dryMonthBufferPercent}%)</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/10 px-2.5 py-1 rounded-full w-fit text-zinc-800">
                Smooths Late Invoices
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#17171b] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  STABILIZED SALARY DRAW
                </span>
                <span className="text-xs font-bold text-zinc-400">{essentialNeedsPercent}%</span>
              </div>
              <div className="my-2">
                <p className="text-3xl font-black text-white">{formatCurrency(freelanceNeedsAmount, currency)}</p>
                <p className="text-xs text-zinc-400">predictable monthly living draw</p>
              </div>
              <div className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                + {formatCurrency(freelanceGrowthAmount, currency)} to Gear / 401(k)
              </div>
            </div>
          </div>

          {/* Dynamic Sliders & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Freelance Allocation Sliders</h2>
                  <p className="text-xs text-zinc-400">
                    Control your tax withholding safety net, living needs draw, and dry-month cushion.
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    freelanceTotalPercent === 100
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  Total: {freelanceTotalPercent}%
                </span>
              </div>

              {/* Master Gross Revenue Slider */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1c1c24] border border-amber-400/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    Gross Client Invoices
                  </span>
                  <span className="font-black text-amber-300 text-sm">
                    {formatCurrency(freelanceRevenue, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={100}
                  value={freelanceRevenue}
                  onChange={(e) => setFreelanceRevenue(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 1: Tax Reserve */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    🛡️ Tax Withholding Reserve (IRS/SE)
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    {taxReservePercent}% · {formatCurrency(freelanceTaxAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={40}
                  step={1}
                  value={taxReservePercent}
                  onChange={(e) => setTaxReservePercent(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Self-employment taxes require setting aside 25-30% before spending.
                </p>
              </div>

              {/* Slider 2: Essential Needs */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    🏠 Lean Baseline Living Needs
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    {essentialNeedsPercent}% · {formatCurrency(freelanceNeedsAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={60}
                  step={1}
                  value={essentialNeedsPercent}
                  onChange={(e) => setEssentialNeedsPercent(Number(e.target.value))}
                  className="w-full accent-amber-700 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Dry Month Buffer */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    🌊 Dry-Month Slush Buffer
                  </span>
                  <span className="font-black text-yellow-300 tabular-nums">
                    {dryMonthBufferPercent}% · {formatCurrency(freelanceBufferAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={dryMonthBufferPercent}
                  onChange={(e) => setDryMonthBufferPercent(Number(e.target.value))}
                  className="w-full accent-yellow-300 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Business Growth & Retirement */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-emerald-500/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    📈 Software Gear & Solo 401(k)
                  </span>
                  <span className="font-black text-emerald-400 tabular-nums">
                    {businessGrowthPercent}% · {formatCurrency(freelanceGrowthAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={businessGrowthPercent}
                  onChange={(e) => setBusinessGrowthPercent(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white">Freelance Outflow</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                    ALLOCATION
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Where each invoice dollar is quarantined
                </p>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={freelancePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {freelancePieData.map((entry, index) => (
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
                                  {formatCurrency(payload[0].value as number, currency)}
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
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Gross</span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(freelanceRevenue, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-white/5">
                {freelancePieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 12-Month Volatility Smoothing Recharts Chart */}
          <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">
                    12-Month Freelance Cash Flow & Buffer Smoothing
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Yellow bars represent erratic client invoicing; the green line shows your cumulative buffer protecting living needs during dry months.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#1c1c24] border border-white/10 text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Ending Slush Buffer</span>
                <p className="text-xl font-black text-emerald-400">
                  {formatCurrency(freelanceProjectionData[11]?.bufferFund, currency)}
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={freelanceProjectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => formatCurrencyCompact(val, currency)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const invoiced = (payload[0]?.value as number) || 0;
                          const buffer = (payload[1]?.value as number) || 0;
                          return (
                            <div className="p-3.5 bg-[#1b1b22] border border-white/10 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="font-black text-white border-b border-white/10 pb-1 mb-1">
                                Month {label} Financials
                              </p>
                              <p className="text-amber-300 font-semibold">
                                Invoiced Revenue: {formatCurrency(invoiced, currency)}
                              </p>
                              <p className="text-emerald-400 font-extrabold">
                                Total Buffer Reserve: {formatCurrency(buffer, currency)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Bar dataKey="invoicedRevenue" name="Invoiced Revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bufferFund" name="Accumulated Slush Buffer" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">Loading chart...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 3: SMALL BUSINESS SETUP VIEW */}
      {/* ======================================================== */}
      {activeScenario.id === 'small-business-setup' && (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black shadow-gold-glow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-85">
                  INITIAL LAUNCH CAPITAL
                </span>
                <Store className="w-5 h-5 opacity-70" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(seedCapital, currency)}</p>
                <p className="text-xs font-bold opacity-80">total bootstrapped seed</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/15 px-2.5 py-1 rounded-full w-fit">
                Reserve: {formatCurrency(workingReserveAmount, currency)}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#f1ece2] text-zinc-900 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600">
                  INVENTORY & STOCK
                </span>
                <Target className="w-5 h-5 text-zinc-700" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(inventoryAmount, currency)}</p>
                <p className="text-xs font-bold text-zinc-600">fulfillment capital ({inventoryPercent}%)</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/10 px-2.5 py-1 rounded-full w-fit text-zinc-800">
                ~{Math.round(inventoryAmount / 18)} Product Units
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#17171b] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  MARKETING & ACQUISITION
                </span>
                <span className="text-xs font-bold text-zinc-400">{marketingPercent}%</span>
              </div>
              <div className="my-2">
                <p className="text-3xl font-black text-white">{formatCurrency(marketingAmount, currency)}</p>
                <p className="text-xs text-zinc-400">customer outreach & ad spend</p>
              </div>
              <div className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full w-fit border border-amber-400/20">
                Break-Even Month ~4-5
              </div>
            </div>
          </div>

          {/* Sliders & Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Capital Allocation Sliders</h2>
                  <p className="text-xs text-zinc-400">
                    Balance inventory units against marketing ads to optimize sales velocity.
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    businessTotalPercent === 100
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  Total: {businessTotalPercent}%
                </span>
              </div>

              {/* Master Seed Capital */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1c1c24] border border-amber-400/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    Total Startup Seed Capital
                  </span>
                  <span className="font-black text-amber-300 text-sm">
                    {formatCurrency(seedCapital, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={50000}
                  step={500}
                  value={seedCapital}
                  onChange={(e) => setSeedCapital(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 1: Inventory */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    📦 Inventory & Product Supply
                  </span>
                  <span className="font-black text-blue-400 tabular-nums">
                    {inventoryPercent}% · {formatCurrency(inventoryAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={1}
                  value={inventoryPercent}
                  onChange={(e) => setInventoryPercent(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Wholesale units and freight packaging. Avoid running out of stock!
                </p>
              </div>

              {/* Slider 2: Marketing */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    📣 Marketing & Customer Acquisition
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    {marketingPercent}% · {formatCurrency(marketingAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={1}
                  value={marketingPercent}
                  onChange={(e) => setMarketingPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Paid media, social creators, and SEO to drive initial buyers.
                </p>
              </div>

              {/* Slider 3: Operations */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    ⚙️ Operations & Software Tools
                  </span>
                  <span className="font-black text-purple-400 tabular-nums">
                    {operationsPercent}% · {formatCurrency(operationsAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={operationsPercent}
                  onChange={(e) => setOperationsPercent(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Working Capital Reserve */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-emerald-500/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    🛡️ Working Capital Reserve
                  </span>
                  <span className="font-black text-emerald-400 tabular-nums">
                    {workingReservePercent}% · {formatCurrency(workingReserveAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={workingReservePercent}
                  onChange={(e) => setWorkingReservePercent(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white">Capital Split</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                    SEED ALLOCATION
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Division of {formatCurrency(seedCapital, currency)} initial capital
                </p>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={businessPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {businessPieData.map((entry, index) => (
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
                                  {formatCurrency(payload[0].value as number, currency)}
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
                  <div className="text-zinc-500 text-xs">Loading chart...</div>
                )}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Seed</span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(seedCapital, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-white/5">
                {businessPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 12-Month Break-Even Projection Chart */}
          <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white">
                    12-Month Break-Even & Revenue Trajectory
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The green area tracks cumulative customer revenue crossing your total costs (gray line) to achieve net profitability.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#1c1c24] border border-white/10 text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Year 1 Net Revenue</span>
                <p className="text-xl font-black text-emerald-400">
                  {formatCurrency(businessProjectionData[11]?.cumulativeRevenue, currency)}
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={businessProjectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bizRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => formatCurrencyCompact(val, currency)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const costs = (payload[0]?.value as number) || 0;
                          const rev = (payload[1]?.value as number) || 0;
                          const net = rev - costs;
                          return (
                            <div className="p-3.5 bg-[#1b1b22] border border-white/10 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="font-black text-white border-b border-white/10 pb-1 mb-1">
                                Month {label} Milestone
                              </p>
                              <p className="text-zinc-400 font-semibold">
                                Cumulative Spend: {formatCurrency(costs, currency)}
                              </p>
                              <p className="text-emerald-400 font-extrabold">
                                Cumulative Sales: {formatCurrency(rev, currency)}
                              </p>
                              <p
                                className={`text-xs font-black pt-1 border-t border-white/10 ${
                                  net >= 0 ? 'text-emerald-300' : 'text-rose-400'
                                }`}
                              >
                                Net Status: {net >= 0 ? `+${formatCurrency(net, currency)} Profit` : `${formatCurrency(net, currency)} Pre-Break-Even`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Area
                      type="monotone"
                      dataKey="cumulativeCosts"
                      name="Cumulative Setup Costs"
                      stroke="#71717a"
                      strokeDasharray="4 4"
                      fill="#71717a"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeRevenue"
                      name="Cumulative Sales Revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#bizRevGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">Loading chart...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 4: EMERGENCY FUND CRISIS VIEW */}
      {/* ======================================================== */}
      {activeScenario.id === 'emergency-fund-crisis' && (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-90">
                  EMERGENCY CASH RESERVE
                </span>
                <ShieldAlert className="w-5 h-5 opacity-90" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black">{formatCurrency(emergencySavings, currency)}</p>
                <p className="text-xs font-medium opacity-85">starting crisis cushion</p>
              </div>
              <div className="text-[10px] font-extrabold bg-black/20 px-2.5 py-1 rounded-full w-fit">
                Base Burn: {formatCurrency(baselineExpense, currency)}/mo
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#f1ece2] text-zinc-900 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600">
                  SURVIVAL RUNWAY
                </span>
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div className="my-2">
                <p className="text-3xl font-black text-emerald-600">{extendedRunwayMonths} Months</p>
                <p className="text-xs font-bold text-zinc-600">
                  vs {standardRunwayMonths} months without austerity
                </p>
              </div>
              <div className="text-[10px] font-extrabold bg-emerald-500/10 text-emerald-800 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                +{((Number(extendedRunwayMonths) - Number(standardRunwayMonths))).toFixed(1)} Months Gained!
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#17171b] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  NET MONTHLY CASH BURN
                </span>
                <span className="text-xs font-bold text-zinc-400">-{austerityCutPercent}%</span>
              </div>
              <div className="my-2">
                <p className="text-3xl font-black text-white">{formatCurrency(netMonthlyBurn, currency)}</p>
                <p className="text-xs text-zinc-400">burn rate with gig bridge offset</p>
              </div>
              <div className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                Solvency: Extended Buffer
              </div>
            </div>
          </div>

          {/* Sliders & Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-black text-white">Crisis Management Sliders</h2>
                <p className="text-xs text-zinc-400">
                  Simulate severe income disruption. Test how expense reduction and gig work extend your survival runway.
                </p>
              </div>

              {/* Master Emergency Reserve */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1c1c24] border border-rose-500/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Starting Emergency Cash Cushion
                  </span>
                  <span className="font-black text-rose-300 text-sm">
                    {formatCurrency(emergencySavings, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={250}
                  value={emergencySavings}
                  onChange={(e) => setEmergencySavings(Number(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 1: Monthly Living Costs */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    💳 Monthly Baseline Living Costs
                  </span>
                  <span className="font-black text-rose-400 tabular-nums">
                    {formatCurrency(baselineExpense, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={baselineExpense}
                  onChange={(e) => setBaselineExpense(Number(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Austerity Cuts */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-amber-500/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    ✂️ Austerity Spending Cuts (% of wants cut)
                  </span>
                  <span className="font-black text-amber-400 tabular-nums">
                    -{austerityCutPercent}% (-{formatCurrency(austerityCutAmount, currency)})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={austerityCutPercent}
                  onChange={(e) => setAusterityCutPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Cancel all subscriptions, eliminate dining out, and negotiate lower rates.
                </p>
              </div>

              {/* Slider 3: Gig Bridge */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#1b1b22] border border-emerald-500/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    🛵 Part-Time / Gig Bridge Income
                  </span>
                  <span className="font-black text-emerald-400 tabular-nums">
                    +{formatCurrency(gigBridgeIncome, currency)}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2500}
                  step={50}
                  value={gigBridgeIncome}
                  onChange={(e) => setGigBridgeIncome(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Freelancing or part-time work dramatically stems cash burn.
                </p>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/[0.08] flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white">Monthly Crisis Outflow</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                    BURN RATE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Net cash outflow per month during emergency
                </p>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={crisisPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {crisisPieData.map((entry, index) => (
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
                                  {formatCurrency(payload[0].value as number, currency)}
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
                  <div className="text-zinc-500 text-xs">Loading chart...</div>
                )}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Net Burn</span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(netMonthlyBurn, currency)}/mo
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-white/5">
                {crisisPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white tabular-nums">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 12-Month Depletion Runway Recharts Chart */}
          <div className="p-6 rounded-3xl bg-[#141417] border border-white/[0.08] shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h2 className="text-lg font-black text-white">
                    12-Month Cash Depletion Survival Runway
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  See how fast zero-cash insolvency hits: The red line is standard unadjusted burn; the green curve proves how austerity cuts and a side gig save you.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#1c1c24] border border-white/10 text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Runway Extension</span>
                <p className="text-xl font-black text-emerald-400">
                  {extendedRunwayMonths} Months Solvency
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={crisisProjectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="crisisGreenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => formatCurrencyCompact(val, currency)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const withoutCuts = (payload[0]?.value as number) || 0;
                          const withCuts = (payload[1]?.value as number) || 0;
                          return (
                            <div className="p-3.5 bg-[#1b1b22] border border-white/10 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="font-black text-white border-b border-white/10 pb-1 mb-1">
                                Month {label} Remaining Cash
                              </p>
                              <p className="text-rose-400 font-semibold">
                                Without Austerity: {formatCurrency(withoutCuts, currency)}
                              </p>
                              <p className="text-emerald-400 font-extrabold">
                                With Austerity + Bridge: {formatCurrency(withCuts, currency)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Area
                      type="monotone"
                      dataKey="withoutAusterity"
                      name="Without Austerity (Rapid Burn)"
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      fill="#ef4444"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="withAusterity"
                      name="With Austerity & Gig Bridge"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#crisisGreenGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">Loading chart...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
