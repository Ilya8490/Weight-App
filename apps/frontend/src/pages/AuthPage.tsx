import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useAuth } from '../hooks/use-auth';
import type { AuthFormValues } from '../types/forms';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const AuthPage = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [error, setError] = useState('');
  const { loading, login, register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-[color:var(--line)] bg-[color:var(--panel)] shadow-[var(--shadow)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative overflow-hidden p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,165,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_28%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-[color:var(--accent)]">
              Health Metrics Dashboard
            </p>
            <h1 className="mt-6 max-w-lg text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
              {t('auth.heroTitle')}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-[color:var(--muted)]">
              {t('auth.heroDescription')}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['BMI', 'BMR', 'Calories'].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4"
                >
                  <p className="font-semibold">{item}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{t('auth.featureHint')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-8 flex rounded-full border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-1">
            {(['register', 'login'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] ${
                  mode === value
                    ? 'bg-[color:var(--accent)] text-slate-950'
                    : 'text-[color:var(--muted)]'
                }`}
              >
                {value === 'register' ? t('auth.register') : t('auth.login')}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(async (values) => {
              try {
                setError('');
                if (mode === 'register') {
                  await registerUser(values);
                } else {
                  await login(values);
                }
              } catch (submissionError) {
                setError(
                  submissionError instanceof Error ? submissionError.message : t('errors.generic')
                );
              }
            })}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-[color:var(--muted)]">{t('auth.email')}</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-4 outline-none focus:border-[color:var(--accent)]"
              />
              {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm text-[color:var(--muted)]">{t('auth.password')}</label>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-4 outline-none focus:border-[color:var(--accent)]"
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>
              ) : null}
            </div>

            {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[color:var(--accent)] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-[color:var(--accent-strong)] disabled:opacity-60"
            >
              {loading ? t('actions.loading') : mode === 'register' ? t('auth.createAccount') : t('auth.signIn')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
