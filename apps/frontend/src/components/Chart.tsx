import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricEntry } from '@health-metrics/shared';

interface ChartProps {
  data: MetricEntry[];
}

export const Chart = ({ data }: ChartProps) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-[32px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur-xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
            {t('dashboard.trend')}
          </p>
          <h3 className="mt-2 text-2xl font-bold">{t('dashboard.weightHistory')}</h3>
        </div>
        <p className="max-w-xs text-right text-sm text-[color:var(--muted)]">
          {t('dashboard.weightHistoryHint')}
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.map((entry) => ({
              ...entry,
              date: new Date(entry.createdAt).toLocaleDateString()
            }))}
          >
            <defs>
              <linearGradient id="weightFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted)" tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{
                background: 'var(--panel-strong)',
                border: '1px solid var(--line)',
                borderRadius: 16
              }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="var(--accent)"
              strokeWidth={3}
              fill="url(#weightFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
