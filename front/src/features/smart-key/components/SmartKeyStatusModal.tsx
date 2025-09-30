'use client';

import { Lottie } from '@/components/atoms/Lottie';

interface Props {
  status: 'idle' | 'loading' | 'success' | 'error';
  t: any;
}

export function SmartKeyStatusModal({ status, t }: Props) {
  if (status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative flex items-center justify-center w-150 h-150">
        {status === 'success' && (
          <>
            <Lottie src="/lotties/card-success.json" loop={false} autoplay />
            <p className="absolute bottom-1 text-white text-xl font-medium">{t.card.doorOpened}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <Lottie src="/lotties/card-fail.json" loop={false} autoplay />
            <p className="absolute bottom-3 text-white text-2xl font-medium">
              {t.card.doorOpenFailed}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
