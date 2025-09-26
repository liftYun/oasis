'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';

export default function Step1_Wallet({ onNext }: { onNext: () => void }) {
  const [network, setNetwork] = useState('Ethereum (ERC20)');
  const [address, setAddress] = useState('');
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  return (
    <main className="relative flex flex-col w-full max-w-md mx-auto min-h-screen pt-6 pb-10 px-4">
      <BackHeader title={t.blockchain.title} />

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Enter ACH Wallet address</h2>
        <p className="text-sm text-gray-500 mt-2">Step 1 of 3</p>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <label className="text-base font-medium text-gray-500">Network</label>
        </div>

        <button className="flex items-center justify-between w-full mt-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
          {network}
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="mt-12 bg-white border border-gray-200 rounded-xl p-5 space-y-5">
        {/* <div>
          <label className="text-sm font-medium text-gray-600">Network</label>
          <button className="flex items-center justify-between w-full mt-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
            {network}
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </div> */}

        <div>
          <label className="text-sm font-medium text-gray-600">Wallet address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full mt-1 px-3 py-2 border rounded-lg outline-none 
              ${!address ? 'border-gray-200 focus:border-primary' : 'border-primary'}
            `}
          />
          {!address && <p className="mt-1 text-xs text-red-500">지갑 주소를 입력해주세요.</p>}
        </div>

        <button
          onClick={onNext}
          disabled={!address}
          className={`w-full py-3 rounded-full font-medium transition
            ${
              !address
                ? 'bg-gradient-to-r from-primary to-green text-white opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-green text-white hover:opacity-90 active:scale-95'
            }`}
        >
          Proceed
        </button>
      </div>
    </main>
  );
}
