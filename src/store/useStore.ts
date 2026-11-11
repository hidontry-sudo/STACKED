import { create } from 'zustand';
import { AppTab, UserProfile, Lesson, SimulationState, DailyTask } from '../types';
import { initialUser, initialSimulation, mockLessons, mockDailyTasks } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

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
  login: (email: string, role?: 'student' | 'admin' | 'instructor') => void;
  logout: () => void;
  demoLogin: (role?: 'student' | 'admin' | 'instructor') => void;
  switchRole: (role: 'student' | 'admin') => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  initAuth: () => Promise<void>;

  // Gamification & Points
  addPoints: (points: number, reason?: string) => void;
  dailyTasks: DailyTask[];
  completeDailyTask: (id: string) => void;

  // Lessons & Learning
  lessons: Lesson[];
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  completeLessonAndQuiz: (lessonId: string, earnedPoints: number, score?: number) => Promise<void>;
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
  currentTab: 'landing',
  setCurrentTab: (tab) => {
    // If student attempts to access instructor portal, guard it
    const { user, showToast } = get();
    if (tab === 'instructor' && user.role !== 'admin') {
      showToast('Access Restricted: Instructor portal is reserved for educator accounts.', undefined, 'info');
      set({ currentTab: 'dashboard' });
      return;
    }
    set({ currentTab: tab });
  },

  isAuthenticated: false,
  user: {
    ...initialUser,
    role: 'student',
  },

  fetchUserProfile: async (userId: string) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('id, role, total_points, level')
        .eq('id', userId)
        .single();

      if (profile) {
        const assignedRole: 'student' | 'admin' = profile.role === 'admin' ? 'admin' : 'student';
        set((state) => ({
          user: {
            ...state.user,
            id: profile.id,
            role: assignedRole,
            level: profile.level || state.user.level,
            points: profile.total_points ?? state.user.points,
            total_points: profile.total_points ?? state.user.points,
          },
        }));
      }
    } catch (err) {
      console.warn('Could not fetch user profile from Supabase users table:', err);
    }
  },

  initAuth: async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ isAuthenticated: true });
        await get().fetchUserProfile(session.user.id);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          set({ isAuthenticated: true });
          await get().fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          set({ isAuthenticated: false, currentTab: 'landing' });
        }
      });
    } catch (err) {
      console.warn('Auth session initialization notice:', err);
    }
  },

  login: (email, role = 'student') => {
    const assignedRole: 'student' | 'admin' = (role === 'admin' || role === 'instructor') ? 'admin' : 'student';
    set((state) => ({
      isAuthenticated: true,
      currentTab: assignedRole === 'admin' ? 'instructor' : 'dashboard',
      user: {
        ...state.user,
        email,
        name: assignedRole === 'admin' ? 'Sarah Vance (Instructor)' : 'Alex Rivera (Student)',
        username: assignedRole === 'admin' ? '@sarah_educator' : '@alex_stacks',
        role: assignedRole,
      },
    }));
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // ignore
      }
    }
    set({
      isAuthenticated: false,
      currentTab: 'landing',
    });
  },

  demoLogin: (role = 'student') => {
    const assignedRole: 'student' | 'admin' = (role === 'admin' || role === 'instructor') ? 'admin' : 'student';
    set((state) => ({
      isAuthenticated: true,
      currentTab: assignedRole === 'admin' ? 'instructor' : 'dashboard',
      user: {
        ...state.user,
        name: assignedRole === 'admin' ? 'Sarah Vance (Instructor)' : 'Alex Rivera (Student)',
        username: assignedRole === 'admin' ? '@sarah_educator' : '@alex_stacks',
        role: assignedRole,
        level: assignedRole === 'admin' ? 10 : 4,
        levelTitle: assignedRole === 'admin' ? 'Curriculum Director' : 'Saver',
      },
    }));
  },

  switchRole: (role: 'student' | 'admin') => {
    set((state) => ({
      user: {
        ...state.user,
        role,
        name: role === 'admin' ? 'Sarah Vance (Instructor)' : 'Alex Rivera (Student)',
        username: role === 'admin' ? '@sarah_educator' : '@alex_stacks',
        levelTitle: role === 'admin' ? 'Curriculum Director' : 'Saver',
      },
      currentTab: role === 'admin' ? state.currentTab : state.currentTab === 'instructor' ? 'dashboard' : state.currentTab,
    }));
  },

  addPoints: (points, reason) => {
    const { user, showToast } = get();
    const newPoints = user.points + points;
    let newLevel = user.level;
    let newTitle = user.levelTitle;
    let newNextPoints = user.nextLevelPoints;

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
        total_points: newPoints,
        level: newLevel,
        levelTitle: newTitle,
        nextLevelPoints: newNextPoints,
      },
    });

    // Optionally update Supabase users table if connected
    if (isSupabaseConfigured() && user.id && !user.id.startsWith('usr_')) {
      supabase
        .from('users')
        .update({ total_points: newPoints, level: newLevel })
        .eq('id', user.id)
        .then(() => {});
    }
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

  completeLessonAndQuiz: async (lessonId, earnedPoints, score = 100) => {
    const { lessons, addPoints, user } = get();
    addPoints(earnedPoints, 'Module Quiz Mastered!');
    set({
      lessons: lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)),
    });

    // Record in Supabase student_progress table (RLS enforced)
    if (isSupabaseConfigured() && user.id && !user.id.startsWith('usr_')) {
      try {
        await supabase
          .from('student_progress')
          .upsert({
            student_id: user.id,
            score,
          }, { onConflict: 'student_id,quiz_id' });
      } catch (err) {
        console.warn('Student progress update notice:', err);
      }
    }
  },

  addInstructorLesson: (newLesson) => {
    const { lessons, addPoints, showToast } = get();
    set({
      lessons: [newLesson, ...lessons],
      activeLessonId: newLesson.id,
    });
    addPoints(250, 'New Lesson Curriculum Published!');
    showToast(`"${newLesson.title}" published to student curriculum!`, 250, 'award');
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
      text: "Hey there! 👋 I'm MINT, your personal AI financial guide. Ask me anything about budgeting, compound interest, index funds, or your simulation stats!",
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
