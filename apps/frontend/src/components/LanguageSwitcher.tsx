import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UKR' }
] as const;

export const LanguageSwitcher = () => {
  const { i18n: instance } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] p-1 backdrop-blur-xl">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => void i18n.changeLanguage(language.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${
            instance.language === language.code
              ? 'bg-[color:var(--accent)] text-slate-950'
              : 'text-[color:var(--muted)]'
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
};
