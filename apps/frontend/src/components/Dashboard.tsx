import { Activity, Flame, Scale, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getBMIStatus } from '@health-metrics/shared';
import { useAppStore } from '../store/app-store';
import { MetricCard } from './MetricCard';
import { Chart } from './Chart';
import { InputForm } from './InputForm';
import { useMetrics } from '../hooks/use-metrics';

export const Dashboard = () => {
  const { t } = useTranslation();
  const latestEntry = useAppStore((state) => state.latestEntry);
  const history = useAppStore((state) => state.history);
  const insightKey = useAppStore((state) => state.insightKey);
  const { loading, createEntry } = useMetrics();

  const bmi = latestEntry?.bmi ?? 0;
  const bmiPercentage = Math.min((bmi / 40) * 100, 100);
  const bmiStatus = latestEntry ? getBMIStatus(latestEntry.bmi) : 'healthy';

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[40px] border border-[color:var(--line)] bg-[color:var(--panel)] p-8 shadow-[var(--shadow)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-[color:var(--accent)]">
                {t('dashboard.commandCenter')}
              </p>
              <h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
                {t('dashboard.title')}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)]">
                {t('dashboard.description')}
              </p>
            </div>

            <div className="min-w-[220px] rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                {t('dashboard.smartInsight')}
              </p>
              <p className="mt-4 text-lg font-semibold text-[color:var(--text)]">{t(insightKey)}</p>
            </div>
          </div>
        </motion.div>

        <InputForm onSubmit={createEntry} loading={loading} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <MetricCard
          label={t('metrics.bmi')}
          value={latestEntry ? latestEntry.bmi.toFixed(1) : '--'}
          hint={latestEntry ? t(`bmiStatus.${bmiStatus}`) : t('dashboard.noData')}
          icon={<Activity size={18} />}
        />
        <MetricCard
          label={t('metrics.idealWeight')}
          value={latestEntry ? `${latestEntry.idealWeight.toFixed(1)} kg` : '--'}
          hint={t('metrics.idealWeightHint')}
          accent="linear-gradient(90deg, #22c55e, transparent)"
          icon={<Scale size={18} />}
        />
        <MetricCard
          label={t('metrics.dailyCalories')}
          value={latestEntry ? `${Math.round(latestEntry.calories)} kcal` : '--'}
          hint={t('metrics.dailyCaloriesHint')}
          accent="linear-gradient(90deg, #f97316, transparent)"
          icon={<Flame size={18} />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Chart data={history} />

        <div className="rounded-[32px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur-xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                {t('dashboard.bodyBalance')}
              </p>
              <h3 className="mt-2 text-2xl font-bold">{t('dashboard.bmiVisual')}</h3>
            </div>
            <Sparkles className="text-[color:var(--accent)]" />
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--panel-strong)]">
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background: `conic-gradient(var(--accent) ${bmiPercentage}%, transparent 0)`
                }}
              />
              <div className="absolute inset-8 rounded-full bg-[color:var(--bg)]" />
              <div className="relative text-center">
                <div className="text-5xl font-extrabold">{latestEntry ? latestEntry.bmi.toFixed(1) : '--'}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  {t(`bmiStatus.${bmiStatus}`)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-5">
            <div className="mb-3 flex justify-between text-sm text-[color:var(--muted)]">
              <span>{t('dashboard.balanceScale')}</span>
              <span>{latestEntry ? latestEntry.weight.toFixed(1) : '--'} kg</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[color:var(--accent-soft)]">
              <div
                className="h-full rounded-full bg-[color:var(--accent)] transition-all duration-500"
                style={{
                  width: `${latestEntry ? Math.min((latestEntry.weight / (latestEntry.idealWeight * 1.4)) * 100, 100) : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
