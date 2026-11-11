import { create } from 'zustand';
import { AppTab, UserProfile, Lesson, SimulationState, DailyTask } from '../types';
import { initialUser, initialSimulation, mockLessons, mockDailyTasks } from '../data/mockData';

interface ToastNotification {
  show: boolean;
  message: string;
  points?: number;
  type?: 'success' | 'info' | 'award';
}

interface MintMessage {
  id: string;
  sender: 'mint' | 'user';
  text: string;
  time: string;
}

interface StoreState {
  // Navigation & Auth
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email: string, role?: 'student' | 'instructor') => void;
  logout: () => void;
  demoLogin: (role?: 'student' | 'instructor') => void;

  // Gamification & Points
  addPoints: (points: number, reason?: string) => void;
  dailyTasks: DailyTask[];
  completeDailyTask: (id: string) => void;

  // Lessons & Learning
  lessons: Lesson[];
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  completeLessonAndQuiz: (lessonId: string, earnedPoints: number) => void;
  addInstructorLesson: (newLesson: Lesson) => void;

  // Simulation Engine State
  simulation: SimulationState;
  updateMonthlyIncome: (income: number) => void;
  updateIncomeSourceAmount: (id: string, amount: number) => void;
  addIncomeSource: (name: string, amount: number) => void;
  deleteIncomeSource: (id: string) => void;
  updateAllocations: (allocations: {
    needsRentPercent: number;
    wantsSpendingPercent: number;
    savingsPercent: number;
    investingPercent: number;
  }) => void;
  updateSavingsGoal: (goalId: string, currentAmount: number) => void;
  addSavingsGoal: (name: string, targetAmount: number) => void;

  // MINT AI Companion
  isMintOpen: boolean;
  toggleMint: (open?: boolean) => void;
  mintMessages: MintMessage[];
  sendMintMessage: (userText: string) => void;

  // Toast Notification
  toast: ToastNotification | null;
  showToast: (message: string, points?: number, type?: 'success' | 'info' | 'award') => void;
  dismissToast: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentTab: 'dashboard',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  isAuthenticated: true, // Default to true for smooth prototype experience, can toggle to landing
  user: initialUser,

  login: (email, role = 'student') => {
    set((state) => ({
      isAuthenticated: true,
      currentTab: role === 'instructor' ? 'instructor' : 'dashboard',
      user: {
        ...state.user,
        email,
        name: role === 'instructor' ? 'Prof. Sarah Vance' : 'Alex Rivera',
        role,
      },
    }));
  },

  logout: () => {
    set({
      isAuthenticated: false,
      currentTab: 'landing',
    });
  },

  demoLogin: (role = 'student') => {
    set((state) => ({
      isAuthenticated: true,
      currentTab: role === 'instructor' ? 'instructor' : 'dashboard',
      user: {
        ...state.user,
        name: role === 'instructor' ? 'Prof. Sarah Vance' : 'Alex Rivera',
        username: role === 'instructor' ? '@prof_vance' : '@alex_stacks',
        role,
      },
    }));
  },

  addPoints: (points, reason) => {
    const { user, showToast } = get();
    const newPoints = user.points + points;
    let newLevel = user.level;
    let newTitle = user.levelTitle;
    let newNextPoints = user.nextLevelPoints;

    // Level progression calculation
    if (newPoints >= 2000 && user.level < 5) {
      newLevel = 5;
      newTitle = 'Wealth Architect';
      newNextPoints = 3000;
      showToast(`LEVEL UP! You are now Level 5 (${newTitle})!`, points, 'award');
    } else if (points > 0) {
      showToast(reason || `+${points} XP Earned!`, points, 'success');
    }

    set({
      user: {
        ...user,
        points: newPoints,
        level: newLevel,
        levelTitle: newTitle,
        nextLevelPoints: newNextPoints,
      },
    });
  },

  dailyTasks: mockDailyTasks,
  completeDailyTask: (id) => {
    const { dailyTasks, addPoints } = get();
    const task = dailyTasks.find((t) => t.id === id);
    if (!task || task.completed) return;

    addPoints(task.xpReward, `Completed Daily Quest: ${task.title}`);

    set({
      dailyTasks: dailyTasks.map((t) => (t.id === id ? { ...t, completed: true } : t)),
    });
  },

  lessons: mockLessons,
  activeLessonId: 'lesson-1',
  setActiveLessonId: (id) => set({ activeLessonId: id, currentTab: 'lessons' }),

  completeLessonAndQuiz: (lessonId, earnedPoints) => {
    const { lessons, addPoints } = get();
    addPoints(earnedPoints, 'Module Quiz Mastered!');
    set({
      lessons: lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)),
    });
  },

  addInstructorLesson: (newLesson) => {
    const { lessons, addPoints, showToast } = get();
    set({
      lessons: [newLesson, ...lessons],
    });
    addPoints(250, 'New Lesson Curriculum Published!');
    showToast('Lesson published to students successfully!', 250, 'award');
  },

  // Simulation
  simulation: initialSimulation,
  updateMonthlyIncome: (income) => {
    set((state) => ({
      simulation: {
        ...state.simulation,
        monthlyIncome: Math.max(100, income),
      },
    }));
  },

  updateIncomeSourceAmount: (id, amount) => {
    set((state) => {
      const updatedSources = state.simulation.incomeSources.map((s) =>
        s.id === id ? { ...s, amount: Math.max(0, amount) } : s
      );
      const totalIncome = updatedSources.reduce((sum, s) => sum + s.amount, 0);
      return {
        simulation: {
          ...state.simulation,
          incomeSources: updatedSources,
          monthlyIncome: totalIncome,
        },
      };
    });
  },

  addIncomeSource: (name, amount) => {
    set((state) => {
      const newSource = { id: `inc-${Date.now()}`, name, amount };
      const updatedSources = [...state.simulation.incomeSources, newSource];
      const totalIncome = updatedSources.reduce((sum, s) => sum + s.amount, 0);
      return {
        simulation: {
          ...state.simulation,
          incomeSources: updatedSources,
          monthlyIncome: totalIncome,
        },
      };
    });
  },

  deleteIncomeSource: (id) => {
    set((state) => {
      const updatedSources = state.simulation.incomeSources.filter((s) => s.id !== id);
      const totalIncome = updatedSources.reduce((sum, s) => sum + s.amount, 0);
      return {
        simulation: {
          ...state.simulation,
          incomeSources: updatedSources,
          monthlyIncome: Math.max(100, totalIncome),
        },
      };
    });
  },

  updateAllocations: (allocations) => {
    set((state) => ({
      simulation: {
        ...state.simulation,
        ...allocations,
      },
    }));
  },

  updateSavingsGoal: (goalId, currentAmount) => {
    set((state) => ({
      simulation: {
        ...state.simulation,
        savingsGoals: state.simulation.savingsGoals.map((g) =>
          g.id === goalId ? { ...g, currentAmount: Math.max(0, currentAmount) } : g
        ),
      },
    }));
  },

  addSavingsGoal: (name, targetAmount) => {
    set((state) => ({
      simulation: {
        ...state.simulation,
        savingsGoals: [
          ...state.simulation.savingsGoals,
          { id: `sg-${Date.now()}`, name, currentAmount: 0, targetAmount },
        ],
      },
    }));
  },

  // MINT AI Coach
  isMintOpen: false,
  toggleMint: (open) => {
    set((state) => ({
      isMintOpen: open !== undefined ? open : !state.isMintOpen,
    }));
  },

  mintMessages: [
    {
      id: 'm1',
      sender: 'mint',
      text: "Hey Alex! 👋 I'm MINT, your personal AI financial guide. Ask me anything about budgeting, compound interest, index funds, or your simulation stats!",
      time: 'Just now',
    },
  ],

  sendMintMessage: (userText) => {
    const userMsg: MintMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: 'Just now',
    };

    set((state) => ({
      mintMessages: [...state.mintMessages, userMsg],
    }));

    // Simulated intelligent AI response
    setTimeout(() => {
      let botReply = "That's a fantastic financial question! Consistent habits beat timing every time.";
      const lower = userText.toLowerCase();

      if (lower.includes('apr') || lower.includes('credit')) {
        botReply = "APR is the Annual Percentage Rate! If you pay your credit card balance in full every month before the due date, you pay exactly 0% interest and build an 800+ credit score effortlessly.";
      } else if (lower.includes('50/30/20') || lower.includes('budget') || lower.includes('allocate')) {
        botReply = "The 50/30/20 rule splits your take-home pay: 50% for Needs (rent, utilities, food), 30% for Wants (fun, dining out), and 20% strictly for Savings & Investments!";
      } else if (lower.includes('compound') || lower.includes('interest') || lower.includes('invest')) {
        botReply = "Compound interest is exponential math in action! At an 8.5% annual return, $200 invested monthly grows into ~$35,000 in 10 years and over $185,000 in 25 years.";
      } else if (lower.includes('roth') || lower.includes('tax')) {
        botReply = "A Roth IRA is funded with after-tax money. That means every single penny of capital gains and dividends you earn over the next 40 years is 100% tax-free!";
      } else if (lower.includes('emergency')) {
        botReply = "Aim for 3 to 6 months of basic living expenses in a High-Yield Savings Account (HYSA) before making aggressive speculative investments.";
      }

      const mintReply: MintMessage = {
        id: `mint-${Date.now()}`,
        sender: 'mint',
        text: botReply,
        time: 'Just now',
      };

      set((state) => ({
        mintMessages: [...state.mintMessages, mintReply],
      }));
    }, 700);
  },

  toast: null,
  showToast: (message, points, type = 'success') => {
    set({ toast: { show: true, message, points, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3500);
  },
  dismissToast: () => set({ toast: null }),
}));
