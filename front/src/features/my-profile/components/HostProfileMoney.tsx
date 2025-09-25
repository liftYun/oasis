'use client';

import { useMemo, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { registerMessages } from '@/features/register';
import { Button } from '@/components/atoms/Button';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { DonutPercentPicker } from '@/features/register/components/DonutPercentPicker';
import { CenterModal } from '@/components/organisms/CenterModal';
import { useRouter } from 'next/navigation';
import { updateCancellationPolicy, getCancellationPolicy } from '@/services/user.api';
import { CancellationPolicyRequest, CancellationPolicyQueryResponse } from '@/services/user.types';
import { toast } from 'react-hot-toast';
import BackHeader from '@/components/molecules/BackHeader';

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
  { id: 'd7', daysBefore: 7, value: 80, label: { kor: '7일 전', eng: '7 days before' } },
  { id: 'd5', daysBefore: 5, value: 60, label: { kor: '5~6일 전', eng: '5~6 days before' } },
  { id: 'd3', daysBefore: 3, value: 40, label: { kor: '3~5일 전', eng: '3~5 days before' } },
  { id: 'd1', daysBefore: 1, value: 20, label: { kor: '1~2일 전', eng: '1~2 days before' } },
];

export function HostProfileMoney({
  defaultRules = DEFAULT_RULES,
  onConfirm,
  loading,
}: HostMoneyProps) {
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

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await getCancellationPolicy();
        const data: CancellationPolicyQueryResponse = res.result;

        if (data) {
          const mappedRules: Rule[] = [
            { ...DEFAULT_RULES.find((r) => r.id === 'd1')!, value: data.policy1 },
            { ...DEFAULT_RULES.find((r) => r.id === 'd3')!, value: data.policy2 },
            { ...DEFAULT_RULES.find((r) => r.id === 'd5')!, value: data.policy3 },
            { ...DEFAULT_RULES.find((r) => r.id === 'd7')!, value: data.policy4 },
          ];
          setRules(mappedRules);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          return;
        }
        console.error('취소 정책 조회 실패:', err);
        toast.error(langKey === 'kor' ? '정책 조회 실패' : 'Failed to load policy');
      }
    };
    fetchPolicy();
  }, []);

  const percentOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => i * 10)
        .filter((v) => v <= 95)
        .reverse(),
    []
  );

  const getRule = (id: string) => rules.find((r) => r.id === id)!;

  const setValue = (id: string, next: number) => {
    const clamp95 = (v: number) => Math.max(0, Math.min(95, v));
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, value: clamp95(next) } : r)));
  };

  const validate = (arr: Rule[]) => {
    const sorted = [...arr].sort((a, b) => b.daysBefore - a.daysBefore);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].value > sorted[i - 1].value) {
        const korMsg = `${sorted[i].label.kor} 환불률이 이전 단계보다 높아요.`;
        const engMsg = `${sorted[i].label.eng} must be lower than previous.`;
        toast.error(langKey === 'kor' ? korMsg : engMsg);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    const ok = validate(rules);
    if (!ok) return;

    const body: CancellationPolicyRequest = {
      policy1: rules.find((r) => r.id === 'd1')?.value ?? 0,
      policy2: rules.find((r) => r.id === 'd3')?.value ?? 0,
      policy3: rules.find((r) => r.id === 'd5')?.value ?? 0,
      policy4: rules.find((r) => r.id === 'd7')?.value ?? 0,
    };

    try {
      await updateCancellationPolicy(body);
      setConfirmOpen(true);
    } catch (err) {
      toast.error(langKey === 'kor' ? '등록 중 오류가 발생했어요.' : 'Failed to save policy.');
    }
  };

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader />
      <h1 className="mt-10 text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
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
                {r.value}% <ChevronDown />
              </button>
            </li>
          ))}
      </ul>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="fixed bottom-[calc(90px+var(--safe-bottom,20px))] left-0 w-full px-6">
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
            router.push('/my-profile');
          }}
        >
          {t.confirm}
        </button>
      </CenterModal>

      <BottomSheet
        open={sheetOpen && !!activeId}
        onClose={() => setSheetOpen(false)}
        title={activeId ? getRule(activeId).label[langKey] : ''}
      >
        {activeId && (
          <div className="flex flex-col items-center gap-6">
            <DonutPercentPicker
              value={getRule(activeId).value}
              onChange={(v) => setValue(activeId, v)}
              step={5}
              size={200}
            />

            <p className="text-sm text-gray-400 -mt-2">
              {langKey === 'kor' ? '최대 95%까지 설정할 수 있어요.' : 'Up to 95% allowed.'}
            </p>

            <div className="grid grid-cols-5 gap-2 w-full pb-5">
              {percentOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setValue(activeId, p)}
                  className={`rounded-lg border px-2 py-1.5 text-sm font-medium text-gray-600 ${
                    p === getRule(activeId).value ? 'bg-gray-100' : 'border-gray-100'
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
