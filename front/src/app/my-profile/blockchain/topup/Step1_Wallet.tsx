'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';
import Polygon from '@/assets/logos/polygon-logo.png';

export default function Step1_Wallet({
  onNext,
}: {
  onNext: (data: { network: string; address: string }) => void;
}) {
  const [network, setNetwork] = useState('Polygon (POS)');
  const [address, setAddress] = useState('');
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  const handleNext = () => {
    if (!address) return;
    onNext({ network, address });
  };

  return (
    <>
      <BackHeader title={t.blockchain.title} />

      <div className="mt-12">
        <h2 className="text-lg font-semibold">{t.blockchain.step1Title}</h2>
        <p className="text-sm text-gray-500 mt-2">{t.blockchain.step1Desc}</p>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <label className="text-base font-medium text-gray-500">{t.blockchain.network}</label>

        <button className="flex items-center justify-between w-full mt-5 px-3 py-2 rounded-lg bg-gray-100">
          <div className="flex items-center gap-4">
            <Image src={Polygon} alt="Polygon" width={24} height={24} />
            <span>{network}</span>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <label className="text-base font-medium text-gray-600">{t.blockchain.walletAddress}</label>
        <input
          type="text"
          // placeholder={t.blockchain.walletPlaceholder}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full text-xl font-semibold text-gray-800 outline-none border-b-2 mt-3
            ${
              !address
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-primary'
            }`}
        />
        {!address && <p className="mt-3 text-xs text-red-500">{t.blockchain.walletError}</p>}
      </div>

      <div className="mt-auto w-full">
        <button
          onClick={handleNext}
          disabled={!address}
          className={`w-full py-3 rounded-full font-medium text-base shadow transition
          ${
            !address
              ? 'bg-gradient-to-r from-primary to-green text-white opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-green text-white hover:opacity-90 active:scale-95'
          }`}
        >
          {t.blockchain.proceed}
        </button>
      </div>
    </>
  );
}
