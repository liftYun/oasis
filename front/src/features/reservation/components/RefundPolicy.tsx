import { useEffect, useState } from 'react';
import { subDays, format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/stores/useResversionStores';
import { fetchCancellationPolicy } from '@/services/reservation.api';
import type { CancellationPolicyResponseVo } from '@/services/reservation.types';

export function RefundPolicy({ stayId, totalPrice }: { stayId: number; totalPrice: number }) {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { checkinDate } = useReservationStore();

  const [policy, setPolicy] = useState<CancellationPolicyResponseVo | null>(null);

  useEffect(() => {
    if (!stayId) return;
    fetchCancellationPolicy(stayId)
      .then((res) => setPolicy(res.result))
      .catch((e) => console.error('취소 정책 조회 실패:', e));
  }, [stayId]);

  if (!checkinDate || !policy) return null;

  const base = new Date(checkinDate);

  const refundPolicies = [
    {
      sub: t.step3.sub1,
      date: subDays(base, 2),
      percent: policy.policy1,
    },
    {
      sub: t.step3.sub2,
      date: subDays(base, 5),
      percent: policy.policy2,
    },
    {
      sub: t.step3.sub3,
      date: subDays(base, 6),
      percent: policy.policy3,
    },
    {
      sub: t.step3.sub4,
      date: subDays(base, 7),
      percent: policy.policy4,
    },
  ];

  const formatString = lang === 'kor' ? 'M월 d일 (EEE) a h시' : 'MMM d (EEE) h a';
  const locale = lang === 'kor' ? ko : enUS;

  return (
    <section className="w-full mt-12 max-w-sm">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-primary rounded-sm" />
        {t.refund.title}
      </h2>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <colgroup>
            <col className="w-[60%]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="pl-4 py-4 text-left">{t.refund.table.date}</th>
              <th className=" py-4 text-center">{t.refund.table.rate}</th>
              <th className="pr-4 py-4 text-right">{t.refund.table.amount}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {refundPolicies.map((p, idx) => {
              const refundAmount = Math.round((totalPrice * p.percent) / 100);

              return (
                <tr key={idx}>
                  <td className="pl-4 py-4 text-gray-600">
                    <div>
                      <p>{format(p.date, formatString, { locale })}</p>
                      <p className="text-xs text-gray-400 mt-1">({p.sub})</p>
                    </div>
                  </td>
                  <td className="py-4 text-center text-primary font-semibold">{p.percent}%</td>
                  <td className="pr-4 py-4 text-right font-bold text-gray-600">
                    {refundAmount.toLocaleString()} USDC
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-xs text-gray-600 leading-relaxed space-y-1">
        {t.refund.description.map((line, i) => {
          if (line.includes('{highlight}')) {
            const parts = line.split('{highlight}');
            return (
              <p key={i}>
                {parts[0]}
                <span className="font-semibold text-primary">{t.refund.highlight}</span>
                {parts[1]}
              </p>
            );
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    </section>
  );
}
