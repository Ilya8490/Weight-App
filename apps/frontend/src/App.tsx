import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './hooks/use-auth';
import { useMetrics } from './hooks/use-metrics';
import { useTheme } from './hooks/use-theme';
import { useAppStore } from './store/app-store';

function App() {
  useTheme();

  const [initializing, setInitializing] = useState(true);
  const user = useAppStore((state) => state.user);
  const mode = useAppStore((state) => state.mode);
  const { me, logout } = useAuth();
  const { fetchHistory } = useMetrics();

  useEffect(() => {
    const initialize = async () => {
      const store = useAppStore.getState();

      if (store.mode === 'guest' && store.user) {
        setInitializing(false);
        return;
      }

      try {
        await me();
      } catch {
        store.clearSession();
      } finally {
        setInitializing(false);
      }
    };

    void initialize();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchHistory();
  }, [user?.id, mode]);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-6 py-4 text-sm text-[color:var(--muted)] backdrop-blur-xl">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar onLogout={() => void logout()} />
      <Dashboard />
    </div>
  );
}

export default App;
