import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  accent?: string;
  icon?: ReactNode;
}

export const MetricCard = ({ label, value, hint, accent, icon }: MetricCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="relative overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur-xl"
  >
    <div
      className="absolute inset-x-0 top-0 h-1"
      style={{ background: accent ?? 'linear-gradient(90deg, var(--accent), transparent)' }}
    />
    <div className="mb-6 flex items-center justify-between text-[color:var(--muted)]">
      <span className="text-sm font-medium">{label}</span>
      <span>{icon}</span>
    </div>
    <div className="text-4xl font-extrabold tracking-tight text-[color:var(--text)]">{value}</div>
    <p className="mt-3 text-sm text-[color:var(--muted)]">{hint}</p>
  </motion.article>
);
