'use client';

import { useState } from 'react';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { SdkInitData } from './types';
import dynamic from 'next/dynamic';

function WalletLoading() {
  const { lang } = useLanguage();
  return (
    <div className="w-full max-w-sm rounded-2xl p-6 mt-6 bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1]">
      <div className="text-center text-sm text-gray-500">
        {lang === 'kor' ? '지갑 연결 모듈 로딩 중...' : 'Loading wallet module...'}
      </div>
    </div>
  );
}

// ConnectWallet을 동적 임포트 (클라이언트 전용)
const ConnectWallet = dynamic(() => import('./ConnectWallet'), {
  ssr: false,
  loading: () => <WalletLoading />,
});

export function BlockChainWallet() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [address, setAddress] = useState<string | null>(null);
  const [sdkInitData, setSdkInitData] = useState<SdkInitData | null>(null);

  const handleConnectSuccess = (addr: string, initData: SdkInitData) => {
    setAddress(addr);
    setSdkInitData(initData);
  };

  return <ConnectWallet onConnectSuccess={handleConnectSuccess} />;
}
