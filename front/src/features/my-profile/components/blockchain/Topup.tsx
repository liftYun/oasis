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
import VISA from '@/assets/logos/visa-logo.png';
import MasterCard from '@/assets/logos/mastercard-logo.png';
import GooglePay from '@/assets/logos/googlepay-logo.png';

export function Topup() {
  const { lang } = useLanguage();
  const router = useRouter();
  const t = profileMessages[lang];

  const currencies = [
    { code: 'USD', label: 'US Dollar', flag: USD },
    { code: 'KRW', label: 'Korean Won', flag: KRW },
    { code: 'EUR', label: 'Euro', flag: EUR },
    { code: 'JPY', label: 'Japanese Yen', flag: JPY },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState(5);
  const [usdcAmount, setUsdcAmount] = useState(amount);
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setUsdcAmount(amount);
        return 5;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [amount]);

  const handleSelect = (currency: (typeof currencies)[number]) => {
    setSelectedCurrency(currency);
    setOpen(false);
  };

  return (
    <main className="relative flex flex-col w-full max-w-md mx-auto min-h-screen pt-6 pb-10 px-4">
      <BackHeader title={t.blockchain.title} />

      <div className="mt-12 bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <label className="text-base font-medium text-gray-500">{t.blockchain.youPay}</label>

        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setAmount('' as any);
                return;
              }
              const num = Number(value);
              setAmount(num);
            }}
            placeholder="금액을 입력하세요"
            className={`w-full text-xl font-semibold text-gray-800 outline-none border-b-2
        ${amount > 10 ? 'border-red focus:border-red' : 'border-gray-200 focus:border-primary'}`}
          />

          <button
            onClick={() => setOpen(!open)}
            className="ml-6 flex items-center gap-2 rounded-lg px-3 bg-gray-100 hover:bg-gray-200 transition"
          >
            <Image src={selectedCurrency.flag} alt={selectedCurrency.code} width={20} height={20} />
            <span className="text-gray-700 font-medium text-sm">{selectedCurrency.code}</span>
            <ChevronDown size={40} className="text-gray-500" />
          </button>
        </div>

        {open && (
          <div className="mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 ml-auto">
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

        {amount > 10 && <p className="text-xs text-red">최대 10 USD까지 입력할 수 있습니다.</p>}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <label className="text-base font-medium text-gray-500">{t.blockchain.youReceive}</label>
        </div>

        <p className="mt-2 text-xs text-gray-500">{t.blockchain.stableCoin}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold text-gray-800">{usdcAmount} USDC</span>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-indigo-100">
            <Image src={Polygon} alt="Polygon" width={20} height={20} />
            <span className="text-sm font-medium text-indigo-700">Polygon</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <p className="text-base text-gray-500">{t.blockchain.order}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock3 size={14} className="shrink-0" />
            <span>{secondsLeft}s 후 갱신</span>
          </div>
        </div>
        <p className="mt-3 text-base font-semibold text-gray-600">
          {amount} {selectedCurrency.code} = {usdcAmount} USDC
        </p>
      </div>

      <div className="mt-auto w-full">
        <div className="flex justify-center items-center gap-6 mb-6">
          <Image src={VISA} alt="VISA" width={40} height={24} />
          <Image src={MasterCard} alt="MasterCard" width={40} height={24} />
          <Image src={GooglePay} alt="Google Pay" width={40} height={24} />
        </div>
        <button
          onClick={() => {
            if (amount > 10 || amount <= 0) {
              alert('최대 100까지 입력할 수 있습니다.');
              return;
            }
            router.push(
              `/my-profile/blockchain/topup?amount=${amount}&currency=${selectedCurrency.code}`
            );
          }}
          disabled={amount > 10 || amount <= 0}
          className={`w-full py-3 rounded-full font-medium text-base shadow transition
    ${
      amount > 10 || amount <= 0
        ? 'bg-gradient-to-r from-primary to-green text-white opacity-50 cursor-not-allowed'
        : 'bg-gradient-to-r from-primary to-green text-white hover:opacity-90 active:scale-95'
    }`}
        >
          {t.blockchain.proceed}
        </button>
      </div>
    </main>
  );
}
