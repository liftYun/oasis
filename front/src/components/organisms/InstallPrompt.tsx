'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AppIcon from '@/assets/logos/oasis-logo-512.png';
import { BottomSheet } from '@/components/organisms/BottomSheet';

export default function InstallPrompt() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    const isStandalone = (window.navigator as any).standalone === true;
    setIsIOS(isiOS);

    const saved = localStorage.getItem('pwaPromptShown');
    if (saved) return;

    if (!isiOS && !isStandalone) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setOpen(true);
      };
      window.addEventListener('beforeinstallprompt', handler as any, { once: true });
      return () => window.removeEventListener('beforeinstallprompt', handler as any);
    }

    if (isiOS && !isStandalone) {
      setOpen(true);
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setOpen(false);
      router.push('/install-ios' as any);
      return;
    }

    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwaPromptShown', 'true');
      setOpen(false);
    }
  };

  return (
    <BottomSheet open={open} title="앱 설치하기 / Install App" onClose={() => setOpen(false)}>
      <div className="z-50 flex flex-col items-center text-center">
        <div className="mb-6">
          <Image src={AppIcon} alt="app" width={70} height={70} />
        </div>

        <div className="w-full mb-8 space-y-2">
          <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-800 leading-relaxed">
            홈 화면에 <span className="text-primary font-medium">Oasis 앱</span>을 추가하고
            <br />더 빠르고 편리하게 이용해보세요.
          </div>
          <div className="p-4 bg-gray-100 rounded-xl text-sm text-gray-500 leading-relaxed">
            Add <span className="text-primary font-medium">Oasis App</span> to your home screen
            <br />
            for faster and easier access.
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="w-full py-3 rounded-full bg-primary text-white font-medium text-sm hover:opacity-90 transition"
        >
          앱 설치하기 / Install App
        </button>
      </div>
    </BottomSheet>
  );
}
