import { MoonStar, SunMedium } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAppStore } from '../store/app-store';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const { t } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAppStore((state) => state.user);
  const mode = useAppStore((state) => state.mode);

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:var(--panel)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">
            Health Metrics Dashboard
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {mode === 'guest' ? t('auth.guestActive') : user?.email ?? t('auth.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] p-3 text-[color:var(--text)] transition hover:scale-105"
            aria-label={t('actions.toggleTheme')}
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-[color:var(--accent-strong)]"
          >
            {mode === 'guest' ? t('auth.exitGuest') : t('auth.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};
