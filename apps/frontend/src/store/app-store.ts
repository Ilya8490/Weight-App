import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MetricEntry, User } from '@health-metrics/shared';

interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  mode: 'authenticated' | 'guest';
  history: MetricEntry[];
  latestEntry: MetricEntry | null;
  insightKey: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  continueAsGuest: () => void;
  clearSession: () => void;
  setMetrics: (payload: {
    history: MetricEntry[];
    latestEntry: MetricEntry | null;
    insight: string;
  }) => void;
  addEntry: (entry: MetricEntry, insightKey: string) => void;
}

const guestUser: User = {
  id: 'guest',
  email: 'Guest Workspace'
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      user: null,
      mode: 'guest',
      history: [],
      latestEntry: null,
      insightKey: 'insights.empty',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark'
        })),
      setUser: (user) =>
        set({
          user,
          mode: user ? 'authenticated' : 'guest'
        }),
      continueAsGuest: () =>
        set((state) => ({
          mode: 'guest',
          user: guestUser,
          history: state.mode === 'guest' ? state.history : [],
          latestEntry: state.mode === 'guest' ? state.latestEntry : null,
          insightKey: state.mode === 'guest' ? state.insightKey : 'insights.empty'
        })),
      clearSession: () =>
        set({
          user: null,
          mode: 'guest',
          history: [],
          latestEntry: null,
          insightKey: 'insights.empty'
        }),
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
    }),
    {
      name: 'health-metrics-store',
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        user: state.mode === 'guest' ? state.user : null,
        history: state.mode === 'guest' ? state.history : [],
        latestEntry: state.mode === 'guest' ? state.latestEntry : null,
        insightKey: state.mode === 'guest' ? state.insightKey : 'insights.empty'
      })
    }
  )
);
