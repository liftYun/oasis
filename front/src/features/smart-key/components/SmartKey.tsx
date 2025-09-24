'use client';

import { useEffect, useState } from 'react';
import { SmartKeyEmpty, SmartKeyList } from '@/features/smart-key';
import { fetchSmartKeyList } from '@/services/smartKey.api';
import type { KeyResponseDto } from '@/services/smartKey.types';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';
import { Lottie } from '@/components/atoms/Lottie';

export function SmartKey() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [keys, setKeys] = useState<KeyResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKeys = async () => {
      try {
        const res = await fetchSmartKeyList();
        if (res.code === 200 && res.result) {
          setKeys(res.result.listOfKeys ?? []);
        } else {
          setKeys([]);
        }
      } catch (err) {
        console.error(err);
        setKeys([]);
      } finally {
        setLoading(false);
      }
    };

    loadKeys();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="text-gray-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {keys.length > 0 ? <SmartKeyList keys={keys} /> : <SmartKeyEmpty />}
    </div>
  );
}
