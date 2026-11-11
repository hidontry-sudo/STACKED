import { UserProfile, Lesson, SimulationState, DailyTask, WealthDataPoint } from '../types';

export const initialUser: UserProfile = {
  id: 'usr_01',
  name: 'Alex Rivera',
  username: '@alex_stacks',
  email: 'alex.rivera@stacked.app',
  role: 'student',
  level: 4,
  levelTitle: 'Saver',
  points: 1240,
  nextLevelPoints: 2000,
  streak: 7,
  savedThisMonth: 184,
  financialHealth: 82,
  joinedDate: 'Nov 2025',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  spendingCurrent: 320,
  savingsCurrent: 480,
  investCurrent: 250,
};

export const initialSimulation: SimulationState = {
  monthlyIncome: 800,
  incomeSources: [
    { id: 'inc-1', name: 'Allowance', amount: 400 },
    { id: 'inc-2', name: 'Freelance & Gigs', amount: 250 },
    { id: 'inc-3', name: 'Part-time Tutoring', amount: 150 },
  ],
  needsRentPercent: 35,
  wantsSpendingPercent: 20,
  savingsPercent: 25,
  investingPercent: 20,
  annualReturnRate: 8.5,
  projectionYears: 10,
  savingsGoals: [
    { id: 'sg-1', name: 'New Laptop M3', currentAmount: 480, targetAmount: 1200, icon: 'laptop' },
    { id: 'sg-2', name: 'Emergency Safety Net', currentAmount: 320, targetAmount: 1000, icon: 'shield' },
    { id: 'sg-3', name: 'Index Fund Kickstart', currentAmount: 650, targetAmount: 2000, icon: 'trending-up' },
  ],
};

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Money Fundamentals: The Real Rulebook',
    category: 'Foundations',
    chapterNumber: 1,
    duration: '6 min',
    pointsReward: 100,
    completed: true,
    locked: false,
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    description: 'Master the distinction between assets and liabilities, how money moves through your hands, and how inflation quietly erodes uninvested cash.',
    keyTakeaways: [
      'Cash sitting in zero-interest accounts loses purchasing power to inflation.',
      'Assets put money in your pocket; liabilities take money out.',
      'Paying yourself first creates automatic wealth building habits.'
    ],
    chapters: [
      { id: 'ch-1', title: '0:00 - Introduction & The Money Game', timeSeconds: 0, timeDisplay: '0:00', summary: 'Why financial literacy is the ultimate real-world skill.' },
      { id: 'ch-2', title: '1:45 - The Purchasing Power Trap', timeSeconds: 105, timeDisplay: '1:45', summary: 'Understanding how inflation devalues idle cash over time.' },
      { id: 'ch-3', title: '3:30 - Assets vs. Liabilities in Practice', timeSeconds: 210, timeDisplay: '3:30', summary: 'Breaking down real assets vs depreciating consumer goods.' },
      { id: 'ch-4', title: '5:10 - The Golden Rule: Pay Yourself First', timeSeconds: 310, timeDisplay: '5:10', summary: 'Automating savings before discretionary spending occurs.' },
    ],
    quiz: {
      id: 'quiz-1',
      title: 'Money Fundamentals Checkpoint',
      lessonId: 'lesson-1',
      passingScore: 75,
      totalPointsReward: 100,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary effect of 3% inflation on uninvested cash in a 0% interest account?',
          options: [
            'Your cash balance decreases in numerical count.',
            'Your purchasing power drops by roughly 3% each year.',
            'Your bank account automatically charges a tax penalty.',
            'Nothing happens as long as you keep it safe in a checking account.'
          ],
          correctIndex: 1,
          explanation: 'Inflation doesn’t lower your numerical balance, but it causes prices of goods to rise, diminishing what your money can buy!',
          points: 25,
        },
        {
          id: 'q2',
          question: 'According to sound financial principles, which of the following is considered an ASSET?',
          options: [
            'A high-end sports car purchased with a 72-month loan',
            'A low-cost S&P 500 index fund dividend generator',
            'Designer sneakers stored in a bedroom closet',
            'A latest-model smartphone bought on a monthly payment plan'
          ],
          correctIndex: 1,
          explanation: 'An asset generates income, pays dividends, or appreciates in real value over time, unlike consumer electronics and financed cars.',
          points: 25,
        },
        {
          id: 'q3',
          question: 'What does the principle "Pay Yourself First" actually mean?',
          options: [
            'Spend all your money on personal shopping before paying rent.',
            'Treat yourself to a luxury dinner whenever your paycheck lands.',
            'Automatically route a percentage of your income to savings & investing before daily spending.',
            'Borrow money from friends before touching your own bank accounts.'
          ],
          correctIndex: 2,
          explanation: 'Paying yourself first means treating your future wealth as your #1 non-negotiable expense before discretionary shopping.',
          points: 25,
        },
        {
          id: 'q4',
          question: 'If you invest $100 every month at an average 8% annual return, what is the secret multiplier that supercharges your wealth over decades?',
          options: [
            'Day-trading penny stocks',
            'Compound interest working on reinvested returns',
            'Buying lottery tickets every weekend',
            'Keeping physical cash locked inside a fireproof safe'
          ],
          correctIndex: 1,
          explanation: 'Compound interest generates interest on your interest, creating an exponential growth hockey-stick over time!',
          points: 25,
        },
      ]
    }
  },
  {
    id: 'lesson-2',
    title: 'Wants vs Needs & The 50/30/20 Rule',
    category: 'Budgeting',
    chapterNumber: 2,
    duration: '8 min',
    pointsReward: 125,
    completed: true,
    locked: false,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    description: 'Learn the world-famous 50/30/20 allocation framework. Distinguish psychological wants from survival needs without living like a monk.',
    keyTakeaways: [
      '50% goes to non-negotiable Needs (housing, utilities, groceries, basic transport).',
      '30% goes to Lifestyle & Wants (dining out, streaming, concerts).',
      '20% goes directly to Savings, Debt Paydown, and Investing.'
    ],
    chapters: [
      { id: 'ch-21', title: '0:00 - Why Most Diets & Budgets Fail', timeSeconds: 0, timeDisplay: '0:00', summary: 'The psychology of budget deprivation and how balance wins.' },
      { id: 'ch-22', title: '2:15 - Breaking Down The 50%: Core Survival', timeSeconds: 135, timeDisplay: '2:15', summary: 'What counts as a true need vs. lifestyle creep.' },
      { id: 'ch-23', title: '4:40 - The Fun 30%: Guilt-Free Spending', timeSeconds: 280, timeDisplay: '4:40', summary: 'Spending without guilt once your obligations are settled.' },
      { id: 'ch-24', title: '6:50 - The Wealth-Building 20%: Future Freedom', timeSeconds: 410, timeDisplay: '6:50', summary: 'Where to put the 20%: Emergency cushion -> Roth IRA -> Index Funds.' },
    ],
    quiz: {
      id: 'quiz-2',
      title: '50/30/20 Mastery Challenge',
      lessonId: 'lesson-2',
      passingScore: 75,
      totalPointsReward: 125,
      questions: [
        {
          id: 'q2-1',
          question: 'In the 50/30/20 budget framework, what category does your Netflix & Spotify subscriptions belong to?',
          options: [
            'Needs (50%)',
            'Wants (30%)',
            'Savings & Investments (20%)',
            'Emergency Expenses'
          ],
          correctIndex: 1,
          explanation: 'Entertainment streaming is a discretionary want. Even if you love music, it is not essential for biological survival or shelter.',
          points: 25,
        },
        {
          id: 'q2-2',
          question: 'If Alex earns $2,000 monthly take-home pay, how much should be allocated to savings and investments under the 50/30/20 rule?',
          options: [
            '$100',
            '$250',
            '$400',
            '$1,000'
          ],
          correctIndex: 2,
          explanation: '20% of $2,000 = $400 dedicated every single month to future wealth building.',
          points: 25,
        },
        {
          id: 'q2-3',
          question: 'What is "Lifestyle Creep"?',
          options: [
            'When your rent landlord increases the security deposit without notice.',
            'When your expenses rise at the exact same pace as your income, preventing wealth accumulation.',
            'When you secretly borrow money from a relative to pay bills.',
            'When you subscribe to too many workout fitness apps.'
          ],
          correctIndex: 1,
          explanation: 'Lifestyle creep is when people make more money but upgrade apartments, cars, and dinners so they remain at zero savings.',
          points: 25,
        },
        {
          id: 'q2-4',
          question: 'Which is the FIRST destination recommended for your 20% savings allocation?',
          options: [
            'Speculative meme coins and lottery tickets',
            'An emergency fund with 3-6 months of essential living expenses',
            'Luxury real estate in Miami',
            'A brand-new motorcycle'
          ],
          correctIndex: 1,
          explanation: 'A liquid emergency fund protects you from entering high-interest credit card debt when unexpected emergencies hit!',
          points: 25,
        }
      ]
    }
  },
  {
    id: 'lesson-3',
    title: 'Demystifying APR & The Credit Trap',
    category: 'Credit & Debt',
    chapterNumber: 3,
    duration: '10 min',
    pointsReward: 150,
    completed: false,
    locked: false,
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    description: 'Uncover how credit card companies extract billions through 24%+ APR interest and the "minimum payment" trap. Learn how to game the score in your favor.',
    keyTakeaways: [
      'APR stands for Annual Percentage Rate—the annualized cost of borrowing money.',
      'Paying only the minimum balance can turn a $500 purchase into a $1,500 multi-year debt.',
      'Pay your statement balance in full every month to get 0% effective interest and free rewards.'
    ],
    chapters: [
      { id: 'ch-31', title: '0:00 - Credit Cards: Sword vs Shield', timeSeconds: 0, timeDisplay: '0:00', summary: 'Why credit is a tool that can either build your score or trap you.' },
      { id: 'ch-32', title: '2:30 - How APR Really Works Day by Day', timeSeconds: 150, timeDisplay: '2:30', summary: 'The daily periodic rate and why card balances compound fast.' },
      { id: 'ch-33', title: '5:45 - The Minimum Payment Illusion', timeSeconds: 345, timeDisplay: '5:45', summary: 'Simulating a $1,000 balance paid at 2% minimum vs in full.' },
      { id: 'ch-34', title: '8:15 - How to Hack an 800+ Credit Score', timeSeconds: 495, timeDisplay: '8:15', summary: 'Payment history + utilization under 10% = credit score royalty.' },
    ],
    quiz: {
      id: 'quiz-3',
      title: 'Credit Score & APR Showdown',
      lessonId: 'lesson-3',
      passingScore: 75,
      totalPointsReward: 150,
      questions: [
        {
          id: 'q3-1',
          question: 'What does "APR" stand for in financial agreements?',
          options: [
            'Automated Payment Reserve',
            'Annual Percentage Rate',
            'Asset Protection Requirement',
            'Amortized Profit Ratio'
          ],
          correctIndex: 1,
          explanation: 'Annual Percentage Rate represents the yearly interest rate charged for borrowing funds, including fees.',
          points: 25,
        },
        {
          id: 'q3-2',
          question: 'If you pay your credit card "Statement Balance" in full before the due date each month, how much interest do you pay?',
          options: [
            'The standard 24.99% APR',
            'A flat 5% convenience transaction fee',
            '$0.00 (Zero Interest)',
            'Half of the prime lending rate'
          ],
          correctIndex: 2,
          explanation: 'Credit cards offer a grace period! If you pay the full statement balance every billing cycle, you pay exactly ZERO interest.',
          points: 25,
        },
        {
          id: 'q3-3',
          question: 'What single factor has the highest weight in determining your FICO credit score (35%)?',
          options: [
            'On-time Payment History',
            'Total net worth in checking account',
            'Whether you own an iPhone or Android',
            'How many different credit cards you opened this month'
          ],
          correctIndex: 0,
          explanation: 'Payment history accounts for 35% of your FICO score. Never miss a single minimum payment deadline!',
          points: 25,
        },
        {
          id: 'q3-4',
          question: 'What is the recommended credit utilization ratio for building a stellar credit score?',
          options: [
            'Keep it between 80% and 95% of your limit',
            'Keep it below 10% to 30% of your total credit limit',
            'Always max out your card to show you use it',
            'Utilization has zero impact on credit scores'
          ],
          correctIndex: 1,
          explanation: 'Lenders look for low credit utilization (under 10% is ideal, under 30% is good) to prove you aren’t dependent on debt.',
          points: 25,
        }
      ]
    }
  },
  {
    id: 'lesson-4',
    title: 'Investing 101: Stocks, Index Funds & Compound Interest',
    category: 'Investing',
    chapterNumber: 4,
    duration: '12 min',
    pointsReward: 200,
    completed: false,
    locked: false,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    description: 'Demystify Wall Street. Learn why broad-market index funds beat 90%+ of professional hedge fund managers, and how starting at age 18 makes you an automatic millionaire.',
    keyTakeaways: [
      'An index fund owns slices of hundreds of top companies at once, offering instant diversification.',
      'Time in the market beats trying to time the market.',
      'Albert Einstein called compound interest the eighth wonder of the world.'
    ],
    chapters: [
      { id: 'ch-41', title: '0:00 - Stocks Demystified: Owning a Slice', timeSeconds: 0, timeDisplay: '0:00', summary: 'What buying a share of a real operating company means.' },
      { id: 'ch-42', title: '3:10 - Why Individual Stock Picking Fails Most People', timeSeconds: 190, timeDisplay: '3:10', summary: 'The hidden risks of single-company exposure.' },
      { id: 'ch-43', title: '6:20 - The S&P 500 Index: Owning America’s Engine', timeSeconds: 380, timeDisplay: '6:20', summary: 'How index funds provide automatic rebalancing and diversification.' },
      { id: 'ch-44', title: '9:40 - The Millionaire Math of Compound Growth', timeSeconds: 580, timeDisplay: '9:40', summary: 'How $250/month turns into over $870,000 across 35 years.' },
    ],
    quiz: {
      id: 'quiz-4',
      title: 'Investing Fundamentals Quiz',
      lessonId: 'lesson-4',
      passingScore: 75,
      totalPointsReward: 200,
      questions: [
        {
          id: 'q4-1',
          question: 'What is an Index Fund (like the S&P 500)?',
          options: [
            'A government bond that guarantees 20% annual returns',
            'A basket that automatically buys and holds shares of hundreds of top companies',
            'A high-risk crypto speculation scheme',
            'A fee that financial advisors charge you every quarter'
          ],
          correctIndex: 1,
          explanation: 'An S&P 500 index fund holds shares in the 500 largest public US companies, giving you diversified ownership in one basket!',
          points: 50,
        },
        {
          id: 'q4-2',
          question: 'Historically over the last 100 years, what has been the average annual return of the US stock market before inflation?',
          options: [
            'Around 2% to 3%',
            'Around 9% to 10%',
            'Around 35% to 40%',
            'Exactly 0%'
          ],
          correctIndex: 1,
          explanation: 'Historically, the broad US stock market has returned an annualized average of approximately 10% (around 7% after inflation).',
          points: 50,
        },
        {
          id: 'q4-3',
          question: 'Why does "Time in the market beat timing the market"?',
          options: [
            'Because missing just the 10 best trading days in a decade cuts your overall returns in half.',
            'Because stock markets only go up on Mondays.',
            'Because brokers reward users who stare at charts for hours.',
            'It does not; timing every dip is easy.'
          ],
          correctIndex: 0,
          explanation: 'Missing just a handful of the market’s best days severely cripples long-term returns. Consistent dollar-cost averaging wins!',
          points: 50,
        },
        {
          id: 'q4-4',
          question: 'Which tax-advantaged account allows your investments to grow 100% tax-free and be withdrawn tax-free in retirement?',
          options: [
            'Regular checking account',
            'Roth IRA',
            'High-yield certificate of deposit (CD)',
            'Venmo balance'
          ],
          correctIndex: 1,
          explanation: 'A Roth IRA is funded with post-tax dollars, meaning all compounding growth and qualified retirement withdrawals are 100% tax-free!',
          points: 50,
        }
      ]
    }
  }
];

export const mockDailyTasks: DailyTask[] = [
  {
    id: 'dt-1',
    type: 'QUICK Q',
    title: 'What does APR mean?',
    question: 'What does APR mean when borrowing or using a credit card?',
    options: ['Annual Percentage Rate', 'Asset Profit Ratio', 'Auto Payment Reserve'],
    correctIndex: 0,
    xpReward: 20,
    completed: false,
  },
  {
    id: 'dt-2',
    type: 'BUDGET',
    title: "50/30/20 rule — what's the 20?",
    question: "In the 50/30/20 rule, the 20% slice goes to:",
    options: ['Restaurants and dining', 'Savings, debt paydown & investing', 'Car payments'],
    correctIndex: 1,
    xpReward: 25,
    completed: false,
  },
  {
    id: 'dt-3',
    type: 'INVEST',
    title: 'Safest pick for a beginner?',
    question: 'Which asset is considered the safest, diversified pick for a beginner investor?',
    options: ['Broad market index fund (e.g. S&P 500)', 'Meme crypto tokens', 'Single penny stock'],
    correctIndex: 0,
    xpReward: 25,
    completed: false,
  },
  {
    id: 'dt-4',
    type: 'SUBS',
    title: '$10/mo subscription costs how much over 10 yrs at 8%?',
    question: 'Investing $10/month at an 8% average return yields approximately how much in 10 years?',
    options: ['~$1,200', '~$1,830 (52% more than just saving)', '~$300'],
    correctIndex: 1,
    xpReward: 15,
    completed: false,
  },
];

export const mockWealthHistory: WealthDataPoint[] = [
  { month: 'Jun', netWorth: 650, projectedWithoutStacked: 600, projectedWithStacked: 650, savings: 350, investments: 150 },
  { month: 'Jul', netWorth: 780, projectedWithoutStacked: 620, projectedWithStacked: 780, savings: 400, investments: 180 },
  { month: 'Aug', netWorth: 890, projectedWithoutStacked: 650, projectedWithStacked: 890, savings: 420, investments: 200 },
  { month: 'Sep', netWorth: 940, projectedWithoutStacked: 670, projectedWithStacked: 940, savings: 440, investments: 220 },
  { month: 'Oct', netWorth: 1050, projectedWithoutStacked: 700, projectedWithStacked: 1050, savings: 480, investments: 250 },
  { month: 'Nov (Now)', netWorth: 1184, projectedWithoutStacked: 720, projectedWithStacked: 1184, savings: 520, investments: 280 },
  { month: 'Dec (Est)', netWorth: 1320, projectedWithoutStacked: 740, projectedWithStacked: 1320, savings: 560, investments: 320 },
  { month: 'Jan', netWorth: 1490, projectedWithoutStacked: 760, projectedWithStacked: 1490, savings: 610, investments: 370 },
  { month: 'Feb', netWorth: 1680, projectedWithoutStacked: 780, projectedWithStacked: 1680, savings: 660, investments: 420 },
  { month: 'Mar', netWorth: 1910, projectedWithoutStacked: 800, projectedWithStacked: 1910, savings: 720, investments: 480 },
  { month: 'Apr', netWorth: 2150, projectedWithoutStacked: 820, projectedWithStacked: 2150, savings: 780, investments: 540 },
  { month: 'May', netWorth: 2420, projectedWithoutStacked: 850, projectedWithStacked: 2420, savings: 850, investments: 620 },
];
