'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Step1_Wallet from './Step1_Wallet';
import Step2_Payment from './Step2_Payment';
import Step3_Confirm from './Step3_Confirm';

export default function TopupPage() {
  const [step, setStep] = useState(1);

  const [walletInfo, setWalletInfo] = useState({ network: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const searchParams = useSearchParams();

  const amount = searchParams.get('amount') || '0';
  const currency = searchParams.get('currency') || 'USD';

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <main className="relative flex flex-col w-full max-w-md mx-auto min-h-screen pt-6 pb-10 px-4">
      {step === 1 && (
        <Step1_Wallet
          onNext={(data) => {
            setWalletInfo(data);
            next();
          }}
        />
      )}

      {step === 2 && (
        <Step2_Payment
          onNext={(selectedMethod) => {
            setPaymentMethod(selectedMethod);
            next();
          }}
          onBack={back}
        />
      )}

      {step === 3 && (
        <Step3_Confirm
          onBack={back}
          data={{
            network: walletInfo.network,
            address: walletInfo.address,
            method: paymentMethod,
            amount: parseFloat(amount),
          }}
        />
      )}
    </main>
  );
}
