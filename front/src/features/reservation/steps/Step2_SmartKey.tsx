'use client';

import ReservationPromo from '../components/promo/ReservationPromo';
import { Button } from '@/components/atoms/Button';
import SearchUserBar from '../components/SearchUserBar';
import UserCard, { type UserItem } from '../components/UserCard';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const DUMMY_USERS: UserItem[] = [
  { id: '1', nickname: '이민희' },
  { id: '2', nickname: '이민희' },
  { id: '3', nickname: '이민희' },
  { id: '4', nickname: '이민희' },
  { id: '5', nickname: '이민희' },
  { id: '6', nickname: '이민희' },
  { id: '7', nickname: '이민희' },
  { id: '8', nickname: '이민희' },
  { id: '9', nickname: '이민희' },
];

export function Step2_SmartKey() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { setStep } = useReservationStore();

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!query) return DUMMY_USERS;
    return DUMMY_USERS.filter((u) => u.nickname.includes(query));
  }, [query]);

  const hasResult = results.length > 0;
  const canNext = true;

  return (
    <section className="flex flex-col flex-1 gap-5">
      <ReservationPromo />

      <div className="mt-2">
        <SearchUserBar
          placeholder={t.step2.searchPlaceholder}
          onSubmit={(kw) => {
            setQuery(kw);
            setSearched(true);
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {results.slice(0, 6).map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      <div className="mt-auto space-y-3 pb-2">
        {searched && (
          <div className="px-4 py-3 rounded-md bg-gray-200 text-gray-700 flex items-center gap-2">
            {hasResult ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <XCircle className="text-red-500" />
            )}
            <span className="text-sm">
              {hasResult ? t.step2.successMessage : t.step2.failMessage}
            </span>
          </div>
        )}

        <Button
          variant={canNext ? 'default' : 'google'}
          disabled={!canNext}
          onClick={() => setStep(3)}
        >
          {t.step2.next}
        </Button>
      </div>
    </section>
  );
}
