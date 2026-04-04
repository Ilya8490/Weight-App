import { zodResolver } from '@hookform/resolvers/zod';
import { type MetricInput } from '@health-metrics/shared';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
  weight: z.coerce.number().min(20).max(400),
  height: z.coerce.number().min(100).max(250),
  age: z.coerce.number().min(10).max(100),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive'])
});

interface InputFormProps {
  loading: boolean;
  onSubmit: (values: MetricInput) => Promise<unknown>;
}

export const InputForm = ({ loading, onSubmit }: InputFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MetricInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      weight: 72,
      height: 178,
      age: 28,
      gender: 'male',
      activityLevel: 'moderate'
    }
  });

  const fieldClassName =
    'w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-3 text-[color:var(--text)] outline-none transition focus:border-[color:var(--accent)]';

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="rounded-[32px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur-xl"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
          {t('dashboard.input')}
        </p>
        <h3 className="mt-2 text-2xl font-bold">{t('dashboard.updateMetrics')}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[color:var(--muted)]">
          <span>{t('form.weight')}</span>
          <input type="number" step="0.1" {...register('weight')} className={fieldClassName} />
          {errors.weight ? <span className="text-xs text-rose-400">{errors.weight.message}</span> : null}
        </label>
        <label className="space-y-2 text-sm text-[color:var(--muted)]">
          <span>{t('form.height')}</span>
          <input type="number" {...register('height')} className={fieldClassName} />
        </label>
        <label className="space-y-2 text-sm text-[color:var(--muted)]">
          <span>{t('form.age')}</span>
          <input type="number" {...register('age')} className={fieldClassName} />
        </label>
        <label className="space-y-2 text-sm text-[color:var(--muted)]">
          <span>{t('form.gender')}</span>
          <select {...register('gender')} className={fieldClassName}>
            <option value="male">{t('form.male')}</option>
            <option value="female">{t('form.female')}</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-[color:var(--muted)] md:col-span-2">
          <span>{t('form.activityLevel')}</span>
          <select {...register('activityLevel')} className={fieldClassName}>
            <option value="sedentary">{t('activity.sedentary')}</option>
            <option value="light">{t('activity.light')}</option>
            <option value="moderate">{t('activity.moderate')}</option>
            <option value="active">{t('activity.active')}</option>
            <option value="veryActive">{t('activity.veryActive')}</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-[color:var(--accent)] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t('actions.saving') : t('actions.saveEntry')}
      </button>
    </form>
  );
};
