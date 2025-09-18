'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';
import Usdc from '@/assets/icons/usd-circle.png';

export function Step3_Dummy() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { reset } = useReservationStore();

  const dummy = {
    tokenSymbol: 'USDC',
    balance: 19.0,
    nights: 2,
    pricePerNight: 125,
    fee: 0,
  } as const;

  const [agreed, setAgreed] = useState(false);
  const total = dummy.nights * dummy.pricePerNight + dummy.fee;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold mb-2">{t.step3.title}</h1>
        <p className="text-sm text-gray-500">{t.step3.description}</p>
      </div>
      <div
        className="w-full max-w-sm rounded-md p-5"
        style={{ background: 'linear-gradient(to right, #dbeafe, #e0f2f1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Image src={Usdc} alt="USDC Icon" width={15} height={15} />
          <span className="text-sm text-gray-800 font-medium">{dummy.tokenSymbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">{dummy.balance.toFixed(1)}</p>
          <button className="px-4 py-1.5 rounded-full bg-white font-semibold flex items-center justify-center">
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#3B87F4] to-[#88D4AF]">
              {lang === 'kor' ? '충전하기' : 'Top up'}
            </span>
          </button>
        </div>
      </div>
      <div className="-mx-6 h-3 bg-gray-100 my-4" />
      <section className="w-full max-w-sm">
        <h3 className="text-base font-semibold mb-3">
          {lang === 'kor' ? '숙소 결제 금액' : 'Payment Summary'}
        </h3>
        <div className="rounded-md border border-gray-100 overflow-hidden font-bold">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-sm text-gray-600">{lang === 'kor' ? '숙박 일자' : 'Nights'}</span>
            <span className="text-sm text-gray-900">
              {dummy.nights}박 x ${dummy.pricePerNight.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-sm text-gray-600">{lang === 'kor' ? '수수료' : 'Fee'}</span>
            <span className="text-sm text-gray-900">$ {dummy.fee.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-end px-4 py-3 bg-gray-900 text-white">
            <span className="text-sm">$ {total.toFixed(2)}</span>
          </div>
        </div>
      </section>
      <section className="w-full mt-4 max-w-sm">
        <h3 className="text-base font-semibold mb-3">
          {lang === 'kor' ? '결제 유의사항' : 'Payment Notes'}
        </h3>
        <div className="rounded-md border border-gray-100 bg-gray-50 p-4 text-[13px] leading-6 text-gray-700 font-bold">
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              모든 결제는{' '}
              <span className="text-primary font-semibold">블록체인 스마트컨트랙트</span>로 안전하게
              처리됩니다.
            </li>
            <li>예약 및 결제 내역은 블록체인에 기록되어 위·변조가 불가능합니다.</li>
            <li>취소 및 환불은 숙소 정책 및 스마트컨트랙트 규정에 따릅니다.</li>
            <li>결제 시 네트워크 수수료(Gas Fee)가 추가로 발생할 수 있습니다.</li>
            <li>결제 전 반드시 지갑 잔액을 확인해주세요.</li>
            <li>
              결제 완료 시 예약이 <span className="text-primary font-semibold">자동 확정</span>
              되며 별도의 승인 절차가 필요하지 않습니다.
            </li>
            <li>거래 내역은 영구적으로 기록되어 언제든 조회·검증 가능합니다.</li>
            <li>네트워크 혼잡 시 결제 처리에 일시적 지연이 발생할 수 있습니다.</li>
          </ol>
        </div>
      </section>
      <div className="mt-2">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-primary"
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
      <div className="mt-2 max-w-sm">
        <Button
          variant={agreed ? 'default' : 'google'}
          disabled={!agreed}
          onClick={() => {
            if (!agreed) return;
            reset();
            alert(
              lang === 'kor'
                ? '예약 요청이 완료되었습니다. (더미)'
                : 'Reservation requested. (dummy)'
            );
          }}
        >
          {t.step3.submit}
        </Button>
      </div>
    </section>
  );
}
