'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/stores/useResversionStores';
import { RefundPolicy } from '@/features/reservation/components/RefundPolicy';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { BlockChainWallet } from '@/features/my-profile/components/blockchain/BlockChainWallet';

export function Step3_Dummy() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const store = useReservationStore();
  const router = useRouter();

  const [agreed, setAgreed] = useState(false);

  const handleBack = () => {
    if (store.currentStep > 1) {
      store.setStep(store.currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) return;
    try {
      const result = await store.submit();

      if (result) {
        toast.success(
          lang === 'kor' ? '예약 요청이 완료되었습니다.' : 'Reservation requested successfully.'
        );
        // store.reset();
        router.push('/main');
      } else {
        toast.error(lang === 'kor' ? '예약 요청에 실패했습니다.' : 'Reservation request failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(
        lang === 'kor'
          ? '예약 요청 중 오류가 발생했습니다.'
          : 'An error occurred while requesting reservation.'
      );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col min-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-[70]">
        <header className="relative h-14 bg-white px-2 flex items-center justify-between">
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

      <div className="w-full flex flex-col flex-1">
        <h1 className="text-xl font-bold mb-2 pt-2">{t.step3.title}</h1>
      </div>

      <BlockChainWallet />

      <section className="w-full mt-12 max-w-sm">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="inline-block w-1.5 h-5 bg-primary rounded-sm" />
          {t.step3.summaryTitle}
        </h2>

        <div className="rounded-md border border-gray-100 overflow-hidden font-bold">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
            <span className="text-base text-gray-600">{t.step3.labels.nights}</span>
            <span className="text-base text-gray-600">
              {store.night}박 x ${(store.payment ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
            <span className="text-base text-gray-600">{t.step3.labels.fee}</span>
            <span className="text-base text-gray-900">$ 0</span>
          </div>
          <div className="flex items-center justify-end px-4 py-3 bg-gray-600 text-white">
            <span className="text-base font-medium">
              $ {((store.night ?? 0) * (store.payment ?? 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full mt-12 max-w-sm">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="inline-block w-1.5 h-5 bg-primary rounded-sm" />
          {t.step3.notesTitle}
        </h2>
        <div className="rounded-md bg-gray-100 p-4 text-[13px] leading-6 text-gray-600 font-medium">
          <ol className="list-decimal pl-5 space-y-1">
            {t.step3.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ol>
        </div>
      </section>

      {store.stayId !== undefined && (
        <RefundPolicy
          stayId={store.stayId}
          totalPrice={(store.night ?? 0) * (store.payment ?? 0)}
        />
      )}

      <div className="mt-12">
        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 mb-12 accent-primary"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            {lang === 'kor'
              ? '숙소 예약 및 결제 규정을 확인했으며 동의합니다'
              : 'I have reviewed and agree to the reservation and payment policy.'}
          </span>
        </label>
      </div>

      <div className="mt-auto pb-2">
        <Button variant={agreed ? 'blue' : 'blueLight'} disabled={!agreed} onClick={handleSubmit}>
          {t.step3.submit}
        </Button>
      </div>
    </div>
  );
}
