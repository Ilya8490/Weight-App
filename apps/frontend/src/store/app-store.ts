import { create } from 'zustand';
import type { MetricEntry, User } from '@health-metrics/shared';

interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  history: MetricEntry[];
  latestEntry: MetricEntry | null;
  insightKey: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  setMetrics: (payload: {
    history: MetricEntry[];
    latestEntry: MetricEntry | null;
    insight: string;
  }) => void;
  addEntry: (entry: MetricEntry, insightKey: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  user: null,
  history: [],
  latestEntry: null,
  insightKey: 'insights.empty',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark'
    })),
  setUser: (user) => set({ user }),
  setMetrics: ({ history, latestEntry, insight }) =>
    set({
      history,
      latestEntry,
      insightKey: insight
    }),
  addEntry: (entry, insightKey) =>
    set((state) => ({
      latestEntry: entry,
      history: [...state.history, entry],
      insightKey
    }))
}));
