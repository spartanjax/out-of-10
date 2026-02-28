import React, { createContext, useContext, useState } from 'react';
import { Category, DailyRating } from '../types';

export const PRESET_CATEGORIES: Category[] = [
  { id: 'productivity', name: 'Productivity', emoji: '💻', color: '#FFB347', sortOrder: 0 },
  { id: 'sleep', name: 'Sleep', emoji: '😴', color: '#7B61FF', sortOrder: 1 },
  { id: 'happiness', name: 'Happiness', emoji: '😊', color: '#FFCC00', sortOrder: 2 },
  { id: 'fitness', name: 'Fitness', emoji: '🏋️', color: '#FF5733', sortOrder: 3 },
  { id: 'mindfulness', name: 'Mindfulness', emoji: '🧘', color: '#00D4AA', sortOrder: 4 },
  { id: 'nutrition', name: 'Nutrition', emoji: '🥗', color: '#34C759', sortOrder: 5 },
  { id: 'energy', name: 'Energy', emoji: '⚡', color: '#FF9500', sortOrder: 6 },
  { id: 'social', name: 'Social', emoji: '🤝', color: '#007AFF', sortOrder: 7 },
];

const DEFAULT_ACTIVE: Category[] = PRESET_CATEGORIES.slice(0, 3);

type AppContextType = {
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'sortOrder'>) => void;
  removeCategory: (id: string) => void;
  todayRatings: DailyRating | null;
  setTodayRatings: (ratings: DailyRating | null) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_ACTIVE);
  const [todayRatings, setTodayRatings] = useState<DailyRating | null>(null);

  const addCategory = (cat: Omit<Category, 'id' | 'sortOrder'>) => {
    setCategories((prev) => [
      ...prev,
      { ...cat, id: `custom-${Date.now()}`, sortOrder: prev.length },
    ]);
    // Adding a category invalidates the day's ratings since they're now incomplete
    setTodayRatings(null);
  };

  const removeCategory = (id: string) => {
    setCategories((prev) =>
      prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, sortOrder: i }))
    );
    // If the removed category had a rating today, reset
    setTodayRatings((prev) => {
      if (prev?.ratings.some((r) => r.categoryId === id)) return null;
      return prev;
    });
  };

  return (
    <AppContext.Provider
      value={{ categories, addCategory, removeCategory, todayRatings, setTodayRatings }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
