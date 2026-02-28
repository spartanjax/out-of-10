export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sortOrder: number;
};

export type Rating = {
  id: string;
  categoryId: string;
  score: number;
  date: string;
  note?: string;
};

export type DailyRating = {
  date: string;
  ratings: Rating[];
  averageScore: number;
};

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastRatedDate: string;
};

export type AuthStackParamList = {
  Auth: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  RatingFlow: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Stats: undefined;
  Insights: undefined;
  Settings: undefined;
};
