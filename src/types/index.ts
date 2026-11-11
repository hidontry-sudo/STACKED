export type AppTab = 'landing' | 'dashboard' | 'simulations' | 'lessons' | 'instructor' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'student' | 'instructor';
  level: number;
  levelTitle: string;
  points: number;
  nextLevelPoints: number;
  streak: number;
  savedThisMonth: number;
  financialHealth: number;
  joinedDate: string;
  avatar: string;
  spendingCurrent: number;
  savingsCurrent: number;
  investCurrent: number;
}

export interface Chapter {
  id: string;
  title: string;
  timeSeconds: number;
  timeDisplay: string;
  summary: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  questions: QuizQuestion[];
  passingScore: number;
  totalPointsReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  chapterNumber: number;
  duration: string;
  pointsReward: number;
  completed: boolean;
  locked: boolean;
  thumbnail: string;
  description: string;
  keyTakeaways: string[];
  chapters: Chapter[];
  quiz: Quiz;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  icon?: string;
}

export interface SimulationState {
  monthlyIncome: number;
  incomeSources: IncomeSource[];
  needsRentPercent: number;
  wantsSpendingPercent: number;
  savingsPercent: number;
  investingPercent: number;
  annualReturnRate: number; // e.g. 8%
  projectionYears: number; // e.g. 10
  savingsGoals: SavingsGoal[];
}

export interface DailyTask {
  id: string;
  type: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  xpReward: number;
  completed: boolean;
}

export interface WealthDataPoint {
  month: string;
  netWorth: number;
  projectedWithoutStacked: number;
  projectedWithStacked: number;
  savings: number;
  investments: number;
}
