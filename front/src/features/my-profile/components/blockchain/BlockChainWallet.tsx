'use client';

import { useState } from 'react';
import Image from 'next/image';
import Usdc from '@/assets/icons/usd-circle.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { SdkInitData } from './types';
import ConnectWallet from './ConnectWallet';

export function BlockChainWallet() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [address, setAddress] = useState<string | null>(null);
  const [sdkInitData, setSdkInitData] = useState<SdkInitData | null>(null);

  const handleConnectSuccess = (addr: string, initData: SdkInitData) => {
    setAddress(addr);
    setSdkInitData(initData);
  };

  return (
    <>
      <ConnectWallet onConnectSuccess={handleConnectSuccess} />
      <div
        className="w-full max-w-sm rounded-md p-5 mb-8"
        style={{ background: 'linear-gradient(to right, #dbeafe, #e0f2f1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Image src={Usdc} alt="USDC Icon" width={15} height={15} />
          <span className="text-sm text-gray-800 font-medium">{t.usdc}</span>
        </div>

        <div className="flex items-center justify-between">
          {/* <p className="text-2xl font-bold text-gray-900">{balance.toFixed(1)}</p> */}
          <button className="px-4 py-1.5 rounded-full bg-white font-semibold flex items-center justify-center">
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#3B87F4] to-[#88D4AF]">
              {t.balance}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
