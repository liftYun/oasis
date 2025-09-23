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
    </>
  );
}
