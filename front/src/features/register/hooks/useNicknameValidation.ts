'use client';

import { useMemo, useState } from 'react';
import { validateNickname } from '@/services/auth.api';

export function useNicknameValidation(initial = '') {
  const [nickname, setNickname] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState('');
  const [checking, setChecking] = useState(false);

  const localError = useMemo(() => {
    const v = nickname.trim();
    if (!v) return '닉네임을 입력해주세요.';
    if (v.length < 2 || v.length > 10) return '닉네임은 2~10자 사이여야 합니다.';
    if (!/^[가-힣a-zA-Z0-9]+$/.test(v)) return '닉네임에는 한글, 영어, 숫자만 사용할 수 있습니다.';
    return '';
  }, [nickname]);

  const error = touched ? localError || serverError : '';
  const isValid = error === '' && !checking;

  const checkNickname = async () => {
    if (localError) return;
    setChecking(true);
    setServerError('');
    try {
      const res = await validateNickname({ nickname: nickname.trim() });
      console.log(res);
      // if (!res.success) {
      //   setServerError(res.message ?? '이미 사용 중인 닉네임입니다.');
      // }
    } catch {
      setServerError('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setChecking(false);
    }
  };

  return {
    nickname,
    setNickname: (v: string) => {
      setNickname(v);
      setServerError('');
    },
    error,
    isValid,
    checking,
    markTouched: () => setTouched(true),
    reset: () => {
      setNickname(initial);
      setTouched(false);
      setServerError('');
    },
    checkNickname,
  };
}
