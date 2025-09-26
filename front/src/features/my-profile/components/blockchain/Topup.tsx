'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/features/language';
import { useRouter } from 'next/navigation';
import { ChevronDown, Clock3 } from 'lucide-react';
import BackHeader from '@/components/molecules/BackHeader';
import { profileMessages } from '../../locale';

import KRW from '@/assets/images/flags/flag-krw.png';
import EUR from '@/assets/images/flags/flag-eur.png';
import USD from '@/assets/images/flags/flag-usd.png';
import JPY from '@/assets/images/flags/flag-jpy.png';
import Polygon from '@/assets/logos/polygon-logo.png';
import ETH from '@/assets/logos/eth-logo.png';

export function Topup() {
  const { lang } = useLanguage();
  const router = useRouter();
  const t = profileMessages[lang];

  const currencies = [
    { code: 'KRW', label: 'Korean Won', flag: KRW },
    { code: 'USD', label: 'US Dollar', flag: USD },
    { code: 'EUR', label: 'Euro', flag: EUR },
    { code: 'JPY', label: 'Japanese Yen', flag: JPY },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState(1000); // 입력 금액
  const [usdcAmount, setUsdcAmount] = useState(39.27); // 예상 수령
  const [secondsLeft, setSecondsLeft] = useState(15); // ⏱️ 카운트다운

  // 1초 단위 카운트다운 + 0초 시 환율 갱신(예시)
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // 0초 → 갱신 후 리셋
        setUsdcAmount((prev) => {
          const fluctuation = prev * (Math.random() * 0.02 - 0.01); // -1% ~ +1% 예시
          return parseFloat((prev + fluctuation).toFixed(2));
        });
        return 15;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSelect = (currency: (typeof currencies)[number]) => {
    setSelectedCurrency(currency);
    setOpen(false);
  };

  return (
    <main className="relative flex flex-col w-full max-w-md mx-auto min-h-screen pt-6 pb-10 px-4">
      <BackHeader title={t.blockchain.title} />

      <div className="mt-12 bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <label className="text-base font-medium text-gray-500">{t.blockchain.youPay}</label>
        <div className="flex items-center justify-between relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            placeholder="금액을 입력하세요"
            className="w-full text-xl font-semibold text-gray-800 outline-none border-b-2 border-gray-200 focus:border-primary"
          />

          <button
            onClick={() => setOpen(!open)}
            className="ml-6 flex items-center gap-2 rounded-lg px-3 bg-gray-100 hover:bg-gray-200 transition"
          >
            <Image src={selectedCurrency.flag} alt={selectedCurrency.code} width={20} height={20} />
            <span className="text-gray-700 font-medium text-sm">{selectedCurrency.code}</span>
            <ChevronDown size={40} className="text-gray-500" />
          </button>

          {open && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleSelect(c)}
                  className="flex items-center gap-2 w-full px-3 py-4 hover:bg-gray-100 text-sm text-gray-700"
                >
                  <Image src={c.flag} alt={c.code} width={18} height={18} />
                  <span>{c.code}</span>
                  <span className="ml-auto text-xs text-gray-400">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 space-y-2 relative">
        <div className="flex items-center justify-between">
          <label className="text-base font-medium text-gray-500">{t.blockchain.youReceive}</label>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-semibold text-gray-800">{usdcAmount}</span>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-indigo-100">
            <Image src={Polygon} alt="Polygon" width={20} height={20} />
            <span className="text-sm font-medium text-indigo-700">Polygon</span>
          </div>
        </div>

        {/* <div className="flex items-end gap-2 mt-3 mr-2">
          <Image src={ETH} alt="ETH" width={18} height={18} className="ml-auto" />
          <span className="text-sm font-medium text-gray-400">ETH</span>
        </div> */}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <p className="text-base text-gray-500">{t.blockchain.order}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock3 size={14} className="shrink-0" />
            <span>{secondsLeft}s 후 갱신</span>
          </div>
        </div>

        <p className="mt-3 text-sm font-medium text-gray-700">
          {usdcAmount} USDC for {amount} {selectedCurrency.code}
        </p>
      </div>

      <button
        onClick={() => console.log('충전 진행하기')}
        className="mt-auto w-full py-3 rounded-full bg-gradient-to-r from-primary to-green text-white font-medium text-base shadow hover:opacity-90 active:scale-95 transition"
      >
        {t.blockchain.proceed}
      </button>

      <div className="flex justify-center items-center gap-6 mt-6 text-gray-400 text-xs">
        <span>VISA</span>
        <span>Master</span>
        <span>Apple Pay</span>
        <span>Google Pay</span>
      </div>
    </main>
  );
}
