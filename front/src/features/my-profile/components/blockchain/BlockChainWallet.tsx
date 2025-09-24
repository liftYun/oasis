'use client';

import { useState } from 'react';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { SdkInitData } from './types';
import dynamic from 'next/dynamic';

// ConnectWallet을 동적 임포트로 변경 - 클라이언트에서만 로드되도록
const ConnectWallet = dynamic(() => import('./ConnectWallet'), {
  ssr: false, // 서버사이드 렌더링 비활성화
  loading: () => (
    <div className="w-full max-w-sm rounded-2xl p-6 mt-6 bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1]">
      <div className="text-center text-sm text-gray-500">지갑 연결 모듈 로딩 중...</div>
    </div>
  ),
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

  return (
    <>
      <ConnectWallet onConnectSuccess={handleConnectSuccess} />
    </>
  );
}
