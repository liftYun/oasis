'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { openSmartKey } from '@/services/smartKey.api';

export function useSmartKey() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleOpenDoor = async (keyId: number) => {
    setStatus('loading');
    try {
      const res = await openSmartKey(keyId);
      if (res.code === 200 && res.result) {
        setStatus('success');
      } else {
        setStatus('error');
        toast.error(res.message || '문 열기에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const resetTimer = setTimeout(() => setStatus('idle'), 2000);
      return () => clearTimeout(resetTimer);
    }
  }, [status]);

  return { status, handleOpenDoor };
}
