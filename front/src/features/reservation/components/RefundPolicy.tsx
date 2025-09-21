import { subDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/stores/useResversionStores';

export function RefundPolicy() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { checkinDate } = useReservationStore();

  if (!checkinDate) return null;

  const base = new Date(checkinDate);

  const refundPolicies = [
    {
      sub: '체크인 1~2일 전',
      date: subDays(base, 2),
      text: '전액 환불',
    },
    {
      sub: '체크인 3~5일 전',
      date: subDays(base, 5),
      text: '총 숙박 요금의 50%와 서비스 수수료 전액 환불',
    },
    {
      sub: '체크인 5~6일 전',
      date: subDays(base, 6),
      text: '총 숙박 요금의 30% 환불',
    },
    {
      sub: '체크인 7일 전',
      date: subDays(base, 7),
      text: '총 숙박 요금의 10% 환불',
    },
  ];

  return (
    <section className="w-full mt-12 max-w-sm">
      <h2 className="text-lg font-semibold mb-6">환불 정책</h2>

      <div className="divide-y divide-gray-200 rounded-md overflow-hidden">
        {refundPolicies.map((p, idx) => (
          <div key={idx} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
            <p className="font-semibold text-base text-gray-600">
              {format(p.date, 'M월 d일 (EEE) a h시', { locale: ko })}
              <span className="text-gray-400 text-xs ml-2">({p.sub})</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
