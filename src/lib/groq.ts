import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY || '';

export const isGroqConfigured = () => {
  return (
    Boolean(groqApiKey) &&
    !groqApiKey.includes('placeholder') &&
    groqApiKey.startsWith('gsk_')
  );
};

export const getGroqClient = () => {
  if (!isGroqConfigured()) {
    return null;
  }
  return new Groq({ apiKey: groqApiKey });
};

export interface GroqQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * Transcribe audio using Groq Whisper endpoint (model: whisper-large-v3)
 */
export async function transcribeAudioWithWhisper(
  fileOrBuffer: File | Blob | any,
  fileName = 'audio.mp3'
): Promise<string> {
  const groq = getGroqClient();

  if (groq) {
    try {
      const transcription = await groq.audio.transcriptions.create({
        file: fileOrBuffer,
        model: 'whisper-large-v3',
        response_format: 'text',
        language: 'en',
      });
      return typeof transcription === 'string' ? transcription : (transcription as any).text;
    } catch (error: any) {
      console.warn('Groq Whisper API call failed, falling back to simulated transcript:', error?.message);
    }
  }

  // Graceful fallback educational transcript for testing if no API key or on network failure
  return (
    'Welcome to STACKED Money Mastery. Today we are breaking down the critical difference between APR and APY. ' +
    'APR is the Annual Percentage Rate, which is what credit card companies charge you when you borrow money or carry a balance. ' +
    'If you carry a credit card balance at 24% APR, compound interest works against you aggressively. ' +
    'On the flip side, APY is the Annual Percentage Yield, which you earn on your high-yield savings accounts. ' +
    'The golden rule is: always pay your monthly credit card statement balance in full to pay zero percent APR, and stash 3 to 6 months of expenses in a 4.5% APY high-yield savings account.'
  );
}

/**
 * Generate 3 multiple-choice questions from transcript using Groq Llama 3
 * Strict prompt as required:
 * "You are an educational AI. Analyze the following transcript and return a valid JSON array of 3 multiple-choice questions.
 * Each object must have: 'question', 'options' (array of 4 strings), and 'correctAnswer' (string matching one option)."
 */
export async function generateQuizWithLlama3(
  transcript: string
): Promise<GroqQuizQuestion[]> {
  const groq = getGroqClient();

  const systemPrompt =
    "You are an educational AI. Analyze the following transcript and return a valid JSON array of 3 multiple-choice questions. Each object must have: 'question', 'options' (array of 4 strings), and 'correctAnswer' (string matching one option).";

  if (groq) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Transcript:\n\n${transcript}\n\nReturn strictly a valid JSON array of 3 objects with 'question', 'options' (4 items), and 'correctAnswer'. Do not wrap in markdown or backticks.`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
      });

      const rawContent = chatCompletion.choices[0]?.message?.content?.trim() || '[]';
      // Clean JSON if backticks were added
      const cleanedJson = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanedJson);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed.slice(0, 3).map((item) => ({
          question: String(item.question || ''),
          options: Array.isArray(item.options) ? item.options.map(String) : [],
          correctAnswer: String(item.correctAnswer || item.options?.[0] || ''),
        }));
      }
    } catch (error: any) {
      console.warn('Groq Llama 3 inference failed, falling back to educational template:', error?.message);
    }
  }

  // Graceful fallback matching the exact schema if Groq API key is not yet supplied
  return [
    {
      question: 'What does APR stand for in credit and loan agreements?',
      options: [
        'Annual Percentage Rate',
        'Automated Payment Reserve',
        'Amortized Profit Ratio',
        'Asset Protection Rate',
      ],
      correctAnswer: 'Annual Percentage Rate',
    },
    {
      question: 'How can you legally pay 0% interest on a 24% APR credit card?',
      options: [
        'Pay only the minimum required payment each month',
        'Pay the statement balance in full before the due date',
        'Close the card immediately after purchase',
        'Only use the credit card on weekends',
      ],
      correctAnswer: 'Pay the statement balance in full before the due date',
    },
    {
      question: 'Where should your 3-6 month emergency cash cushion be kept for maximum safe growth?',
      options: [
        'A high-yield savings account (HYSA)',
        'Physical cash stored under a mattress',
        'Volatile cryptocurrency memecoins',
        'A zero-interest standard checking account',
      ],
      correctAnswer: 'A high-yield savings account (HYSA)',
    },
  ];
}

export interface MintChatContext {
  simulatedWealth?: number;
  level?: number;
  levelTitle?: string;
  currency?: 'USD' | 'IDR';
  streak?: number;
}

export function buildMintSystemPrompt(userContext?: MintChatContext): string {
  const currencyStr = userContext?.currency || 'USD';
  const wealthStr =
    userContext?.simulatedWealth !== undefined
      ? currencyStr === 'IDR'
        ? `Rp ${(userContext.simulatedWealth * 15000).toLocaleString('id-ID')}`
        : `$${userContext.simulatedWealth.toLocaleString()}`
      : '$1,050';

  const levelStr = userContext?.level
    ? `Level ${userContext.level} (${userContext.levelTitle || 'Saver'})`
    : 'Level 4 (Saver)';

  return `You are MINT, a friendly, encouraging, and highly flexible personal financial advisor and wealth coach inside the STACKED gamified financial platform.

USER GAME STATE:
- Current Player Level: ${levelStr}
- Mocked Simulated Wealth: ${wealthStr} (${currencyStr})
${userContext?.streak ? `- Current Daily Streak: ${userContext.streak} days` : ''}

CORE ADVISORY PHILOSOPHY:
1. Highly Flexible & Conversational: Do NOT follow rigid scripts, mechanical bullet templates, or cookie-cutter formulas. Speak naturally, empathetically, and adapt directly to the nuances of what the user is asking.
2. Personalized & Context-Aware: Connect your guidance directly to the user's current game state (${levelStr}, Simulated Wealth: ${wealthStr}). Acknowledge their progress (e.g., advancing from Saver to Investor, optimizing emergency cash buffers, or balancing side gigs).
3. Encourage Open-Ended Exploration: Actively invite open-ended questions about their life goals, mindset around spending vs. investing, career moves, freelancing, credit scores, debt reduction, or starting a business. Proactively ask an engaging, thought-provoking follow-up question.
4. Currency & Practical Financial Literacy: Respect their currency preference (${currencyStr}). If they mention IDR or Indonesian financial realities (e.g. SBN, reksadana, emergency funds in rupiah), incorporate practical local insights naturally alongside global financial literacy principles.
5. Action-Oriented & Clear: Keep advice punchy, jargon-free, uplifting, and realistic. Keep responses concise (typically 2-3 focused paragraphs or conversational bites), never overwhelming the user with walls of text.`;
}

/**
 * Chat with MINT using Groq Llama 3 with customized financial advisor system prompt
 */
export async function chatWithMintAI(
  userMessage: string,
  history: Array<{ sender: 'mint' | 'user'; text: string }> = [],
  userContext?: MintChatContext
): Promise<string> {
  const groq = getGroqClient();
  const systemPrompt = buildMintSystemPrompt(userContext);

  if (groq) {
    try {
      // Format chat history for Llama 3
      const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
      ];

      // Add last few messages for continuity
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        formattedMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      }

      // Add current message
      formattedMessages.push({
        role: 'user',
        content: userMessage,
      });

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = response.choices[0]?.message?.content?.trim();
      if (reply) {
        return reply;
      }
    } catch (error: any) {
      console.warn('Primary Groq Llama 3.3 call failed, attempting fallback model:', error?.message);
      try {
        const fallbackResponse = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 450,
        });
        const fallbackReply = fallbackResponse.choices[0]?.message?.content?.trim();
        if (fallbackReply) return fallbackReply;
      } catch (fallbackError: any) {
        console.warn('Fallback Groq model also failed:', fallbackError?.message);
      }
    }
  }

  // Resilient contextual fallback if Groq API is offline or key quota exhausted
  const currencyStr = userContext?.currency || 'USD';
  const wealthStr =
    userContext?.simulatedWealth !== undefined
      ? currencyStr === 'IDR'
        ? `Rp ${(userContext.simulatedWealth * 15000).toLocaleString('id-ID')}`
        : `$${userContext.simulatedWealth.toLocaleString()}`
      : '$1,050';
  const levelStr = userContext?.level ? `Level ${userContext.level}` : 'Level 4';

  const lower = userMessage.toLowerCase();
  if (lower.includes('debt') || lower.includes('avalanche') || lower.includes('snowball')) {
    return `That's a pivotal question at ${levelStr}! When managing debt with ${wealthStr} in simulated wealth, you have two proven paths: the Avalanche method (paying highest APR first to mathematically save money) vs. the Snowball method (clearing smallest balances first for psychological momentum). Which one sounds more motivating for your current mindset?`;
  }
  if (lower.includes('freelance') || lower.includes('variable') || lower.includes('gig')) {
    return `Freelance cash flow is all about smoothing out the rollercoaster! With your current ${wealthStr} cushion, I recommend locking in 25-30% immediately into a separate tax holding bucket, and building a 3-month "dry-month buffer". How unpredictable has your income been recently?`;
  }
  if (lower.includes('business') || lower.includes('startup') || lower.includes('inventory')) {
    return `Exciting move! In our Small Business Setup scenario, the classic mistake is overspending on inventory before validating customer acquisition. At ${levelStr}, balancing inventory and marketing gives you staying power. What type of venture are you exploring launching?`;
  }
  if (lower.includes('invest') || lower.includes('index') || lower.includes('compound') || lower.includes('stock')) {
    return `At ${levelStr}, compound interest is your ultimate wealth engine! Putting even 20% of your cash flow into low-cost broad index funds compounds exponentially. At an 8.5% annual average, consistent monthly deposits turn your current ${wealthStr} foundation into serious long-term freedom. What timeline are you targeting for your main financial goals?`;
  }

  return `That's a thoughtful question! Looking at your game state (${levelStr}, Simulated Wealth: ${wealthStr}), you're building solid financial momentum. The key is staying consistent with your allocations and testing different scenarios. What specific outcome are you hoping to achieve next with your money?`;
}

