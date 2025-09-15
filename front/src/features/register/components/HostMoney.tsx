'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { registerMessages } from '@/features/register';
import { Button } from '@/components/atoms/Button';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { DonutPercentPicker } from './DonutPercentPicker';
import { CenterModal } from '@/components/organisms/CenterModel';
import { useRouter } from 'next/navigation';
import { Lottie } from '@/components/atoms/Lottie';

type Rule = {
  id: string;
  daysBefore: number;
  value: number;
  label: { kor: string; eng: string };
};

type HostMoneyProps = {
  defaultRules?: Rule[];
  onConfirm?: (rules: Rule[]) => void;
  loading?: boolean;
};

const DEFAULT_RULES: Rule[] = [
  { id: 'd10', daysBefore: 10, value: 100, label: { kor: '10일전', eng: '10 days before' } },
  { id: 'd7', daysBefore: 7, value: 100, label: { kor: '7일전', eng: '7 days before' } },
  { id: 'd5', daysBefore: 5, value: 70, label: { kor: '5일전', eng: '5 days before' } },
  { id: 'd3', daysBefore: 3, value: 50, label: { kor: '3일전', eng: '3 days before' } },
  {
    id: 'd1',
    daysBefore: 1,
    value: 10,
    label: { kor: '당일·1일전', eng: 'Same day · 1 day before' },
  },
];

export function HostMoney({ defaultRules = DEFAULT_RULES, onConfirm, loading }: HostMoneyProps) {
  const { lang } = useLanguage();
  const t = registerMessages[lang];
  const langKey = (lang as keyof Rule['label']) ?? 'kor';
  const router = useRouter();

  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [error, setError] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const percentOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => i * 10).reverse(), []);
  const activeRule = rules.find((r) => r.id === activeId) ?? null;

  const setValue = (id: string, next: number) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, value: next } : r)));
  };

  const validate = (arr: Rule[]) => {
    const sorted = [...arr].sort((a, b) => b.daysBefore - a.daysBefore);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].value > sorted[i - 1].value) {
        return `${sorted[i].label[langKey]} 환불률이 이전 단계보다 높아요.`;
      }
    }
    return '';
  };

  const handleSubmit = () => {
    const msg = validate(rules);
    setError(msg);
    if (msg) return;
    setConfirmOpen(true);
  };

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Lottie src="/lotties/success.json" className="w-20 h-20" />
        <p className="text-sm text-gray-500">{t.successLogin}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
        {t.moneyTitle}
      </h1>
      <p className="text-base text-gray-400 mb-8 whitespace-pre-line">{t.moneySubTitle}</p>
      <ul className="space-y-4 mt-6 mb-14">
        {rules
          .sort((a, b) => b.daysBefore - a.daysBefore)
          .map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between px-4 py-3 rounded-full bg-gray-100"
            >
              <span className="text-[13px] font-normal text-white bg-gray-600 rounded-full px-2.5 py-1">
                {r.label[langKey]}
              </span>
              <button
                onClick={() => {
                  setActiveId(r.id);
                  setSheetOpen(true);
                }}
                className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50"
              >
                {r.value}%
                <ChevronDown />
              </button>
            </li>
          ))}
      </ul>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <div className="mt-auto pt-6">
        <Button variant="default" onClick={handleSubmit} className="w-full" disabled={loading}>
          {t.confirm}
        </Button>
      </div>

      <CenterModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t.moneyModalTitle}
        description={t.moneyModalDescription}
      >
        <button
          className="h-11 rounded-md bg-gray-100 font-normal text-sm text-gray-300 hover:bg-gray-50"
          onClick={() => setConfirmOpen(false)}
        >
          {t.back}
        </button>
        <button
          className="h-11 rounded-md bg-gray-600 font-normal text-sm text-white hover:opacity-90"
          onClick={async () => {
            setConfirmOpen(false);
            setSubmitting(true);
            onConfirm?.(rules);
            await new Promise((r) => setTimeout(r, 1500));
            router.push('/main');
          }}
        >
          {t.confirm}
        </button>
      </CenterModal>

      <BottomSheet
        open={sheetOpen && !!activeRule}
        onClose={() => setSheetOpen(false)}
        title={activeRule?.label[langKey]}
      >
        {activeRule && (
          <div className="flex flex-col items-center gap-6">
            <DonutPercentPicker
              value={activeRule.value}
              onChange={(v) => setValue(activeRule.id, v)}
              step={5}
              size={200}
            />
            <div className="grid grid-cols-5 gap-2 w-full pb-5">
              {percentOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setValue(activeRule.id, p)}
                  className={`rounded-lg border border-gray-100 px-2 py-1.5 text-sm font-medium text-gray-600 ${
                    p === activeRule.value ? 'bg-gray-100' : 'border-gray-100'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <Button variant="default" className="w-full" onClick={() => setSheetOpen(false)}>
              {t.confirm}
            </Button>
          </div>
        )}
      </BottomSheet>
    </main>
  );
}
