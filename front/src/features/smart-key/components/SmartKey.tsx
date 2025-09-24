'use client';

import { useEffect, useState } from 'react';
import { SmartKeyEmpty, SmartKeyList } from '@/features/smart-key';
import { fetchSmartKeyList } from '@/services/smartKey.api';
import type { KeyResponseDto } from '@/services/smartKey.types';

export function SmartKey() {
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
      <div className="flex justify-center items-center h-full text-gray-500 text-sm">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="w-full">
      {keys.length > 0 ? <SmartKeyList keys={keys} /> : <SmartKeyEmpty />}
    </div>
  );
}
