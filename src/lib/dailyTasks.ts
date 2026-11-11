import { DailyTask } from '@/types';
import { DAILY_TASKS_POOL } from '@/data/dailyTasksPool';

/**
 * Creates a numeric hash from a string (such as "2026-11-11").
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Deterministic PRNG seeded by an integer.
 * Produces pseudorandom values in [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generates the local date key (e.g., "2026-11-11") using the user's local timezone.
 */
export function getTodayDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Selects a deterministic set of tasks (default 3) from the pool using the local date as seed.
 * Guarantees that the same date returns the exact same tasks, changing automatically every 24h.
 */
export function getDailyTasksForDate(
  pool: DailyTask[] = DAILY_TASKS_POOL,
  date: Date = new Date(),
  count: number = 3
): DailyTask[] {
  if (!pool || pool.length === 0) return [];

  const dateKey = getTodayDateKey(date);
  const seed = hashString(dateKey);
  const rng = seededRandom(seed);

  // Clone pool so we don't mutate original
  const poolClone = pool.map((t) => ({ ...t, completed: false }));

  // Fisher-Yates shuffle with seeded RNG
  for (let i = poolClone.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = poolClone[i];
    poolClone[i] = poolClone[j];
    poolClone[j] = temp;
  }

  return poolClone.slice(0, Math.min(count, poolClone.length));
}
