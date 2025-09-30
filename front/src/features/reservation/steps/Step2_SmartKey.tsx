'use client';

import ReservationPromo from '../components/promo/ReservationPromo';
import { Button } from '@/components/atoms/Button';
import SearchUserBar from '../components/SearchUserBar';
import UserCard from '../components/UserCard';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useAuthStore } from '@/stores/useAuthStores';
import { useReservationStore } from '@/stores/useResversionStores';
import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { searchUsers } from '@/services/reservation.api';
import type { UserSearchItem } from '@/services/reservation.types';
import { toast } from 'react-hot-toast';

export function Step2_SmartKey() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const store = useReservationStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchItem[]>([]);
  const nickname = useAuthStore((state) => state.nickname);
  const profileUrl = useAuthStore((state) => state.profileUrl);
  const uuid = useAuthStore((state) => state.uuid);

  const [selectedUsers, setSelectedUsers] = useState<UserSearchItem[]>(
    uuid && nickname
      ? [
          {
            id: Number(uuid),
            nickname,
            profileImageUrl: profileUrl,
          },
        ]
      : []
  );
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [page, setPage] = useState(0);
  const size = 6;

  const hasResult = results.length > 0;
  const canNext = selectedUsers.length > 0;

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        setSearched(true);
        const res = await searchUsers(query, page, size);
        if (res.code === 200 && res.result) {
          setResults(res.result.content);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, page]);

  const handleSelectUser = (user: UserSearchItem) => {
    if (selectedUsers.some((u) => u.id === user.id)) return;
    setSelectedUsers((prev) => [...prev, user]);
    toast.success(`${user.nickname} ${t.step2.successMessage}`);
  };

  const handleBack = () => {
    if (store.currentStep > 1) {
      store.setStep(store.currentStep - 1);
    }
  };

  const filteredResults = results.filter((u) => !selectedUsers.some((sel) => sel.id === u.id));

  const handleNext = () => {
    store.setSelectedUsers(selectedUsers);
    store.setStep(3);
  };

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col min-h-[calc(100vh-135px)] overflow-y-auto">
      <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-[70]">
        <header className="relative h-14 bg-white px-2 flex items-center justify-between border-x border-gray-100">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="back"
          >
            <ChevronLeft className="w-7 h-7 text-gray-500" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600">
            {t.header.title}
          </h1>

          <div className="w-7" />
        </header>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">{t.step2.title}</h1>
      </div>

      <ReservationPromo />

      <div className="mt-6">
        <SearchUserBar
          placeholder={t.step2.searchPlaceholder}
          onChange={(kw) => setQuery(kw)}
          onSubmit={(kw) => setQuery(kw)}
        />
      </div>

      {selectedUsers.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {selectedUsers.map((u) => (
            <div key={`selected-${u.id}`} className="relative">
              <UserCard
                user={{
                  ...u,
                  id: String(u.id),
                  profileUrl: u.profileImageUrl ?? undefined,
                }}
              />
              {u.nickname !== nickname && (
                <button
                  onClick={() => setSelectedUsers((prev) => prev.filter((sel) => sel.id !== u.id))}
                  className="absolute top-1 right-1 bg-black/30 rounded-full p-1 hover:bg-black/60"
                >
                  <X size={14} className="text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {searched && !loading && (
        <div className="mt-3 px-4 py-3 bg-primary/10 text-primary text-sm rounded-md flex items-center gap-2">
          <span className="text-sm">{hasResult ? t.step2.searchMessage : t.step2.failMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-4">
        {loading ? (
          <span className="col-span-3 text-center text-gray-400 text-sm">검색 중...</span>
        ) : (
          filteredResults.map((u) => (
            <div key={u.id} onClick={() => handleSelectUser(u)} className="cursor-pointer">
              <UserCard
                user={{
                  ...u,
                  id: String(u.id),
                  profileUrl: u.profileImageUrl ?? undefined,
                }}
              />
            </div>
          ))
        )}
      </div>

      {searched && !loading && (
        <div className="flex justify-center items-center gap-3 my-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-sm text-gray-500 disabled:text-gray-300 hover:text-gray-700 transition"
          >
            ←
          </button>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
            {page + 1}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasResult || results.length < size}
            className="px-3 py-1 text-sm text-gray-500 disabled:text-gray-300 hover:text-gray-700 transition"
          >
            →
          </button>
        </div>
      )}

      <div className="mt-auto pb-2">
        <Button variant={canNext ? 'blue' : 'blueLight'} disabled={!canNext} onClick={handleNext}>
          {t.step2.next}
        </Button>
      </div>
    </div>
  );
}
