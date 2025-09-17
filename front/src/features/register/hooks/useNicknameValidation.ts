import { useMemo, useState } from 'react';
import { validateNickname } from '@/services/auth.api';
import { toast } from 'react-hot-toast';
import { registerMessages } from '@/features/register/locale';

export function useNicknameValidation(initial = '', lang: 'kor' | 'eng' = 'kor') {
  const t = registerMessages[lang];

  const [nickname, setNickname] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const localError = useMemo(() => {
    const v = nickname.trim();
    if (!v) return t.errorEmpty;
    if (v.length < 2 || v.length > 10) return t.errorLength;
    if (!/^[가-힣a-zA-Z0-9]+$/.test(v)) return t.errorPattern;
    return '';
  }, [nickname, t]);

  const error = touched ? localError || serverError : '';
  const isValid = error === '' && !checking && isAvailable;

  const checkNickname = async () => {
    if (localError) {
      toast.error(localError);
      return;
    }

    setChecking(true);
    setServerError('');

    try {
      const res = await validateNickname({ nickname: nickname.trim() });
      if (res.isSuccess) {
        setIsAvailable(true);
        toast.success(t.successNickname);
      } else {
        setIsAvailable(false);
        const msg = res.message ?? t.errorDuplicate;
        setServerError(msg);
        toast.error(msg);
      }
    } catch {
      setIsAvailable(false);
      const msg = t.errorCheckFail;
      setServerError(msg);
      toast.error(msg);
    } finally {
      setChecking(false);
      setTouched(true);
    }
  };

  return {
    nickname,
    setNickname: (v: string) => {
      setNickname(v);
      setServerError('');
      setIsAvailable(false);
    },
    error,
    isValid,
    checking,
    markTouched: () => setTouched(true),
    reset: () => {
      setNickname(initial);
      setTouched(false);
      setServerError('');
      setIsAvailable(false);
    },
    checkNickname,
  };
}
