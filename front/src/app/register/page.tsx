'use client';

import {
  useRegisterStore,
  RegisterNickname,
  RegisterCheck,
  RegisterRole,
} from '@/features/register';

export default function Page() {
  const step = useRegisterStore((s) => s.step);

  return (
    <>
      {step === 'nickname' && <RegisterNickname />}
      {step === 'check' && <RegisterCheck />}
      {step === 'role' && <RegisterRole />}
    </>
  );
}
