import { Category, DailyRating, Rating, StreakInfo } from '../types';

export const mockCategories: Category[] = [
  { id: 'fitness', name: 'Fitness', emoji: '\u{1F3CB}', color: '#FF5733', sortOrder: 0 },
  { id: 'productivity', name: 'Productivity', emoji: '\u{1F4BB}', color: '#FFB347', sortOrder: 1 },
  { id: 'mindfulness', name: 'Mindfulness', emoji: '\u{1F9D8}', color: '#00D4AA', sortOrder: 2 },
  { id: 'nutrition', name: 'Nutrition', emoji: '\u{1F957}', color: '#34C759', sortOrder: 3 },
  { id: 'sleep', name: 'Sleep', emoji: '\u{1F634}', color: '#A8D844', sortOrder: 4 },
];

function generateScore(day: number, categoryIndex: number): number {
  const val = Math.sin(day * 0.7 + categoryIndex * 2.3) * 3 + 6.5;
  return Math.max(1, Math.min(10, Math.round(val)));
}

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const mockHistory: DailyRating[] = Array.from({ length: 14 }, (_, i) => {
  const daysAgo = 13 - i;
  const date = formatDate(daysAgo);
  const ratings: Rating[] = mockCategories.map((cat, ci) => ({
    id: `${date}-${cat.id}`,
    categoryId: cat.id,
    score: generateScore(i, ci),
    date,
  }));
  const averageScore =
    Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length) * 10) / 10;
  return { date, ratings, averageScore };
});

export const mockTodayRatings: DailyRating | null = null;

export const mockStreak: StreakInfo = {
  currentStreak: 13,
  longestStreak: 21,
  lastRatedDate: formatDate(1),
};
