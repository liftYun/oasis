'use client';

import { useState } from 'react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';
import { CreditCard, Globe, Loader2 } from 'lucide-react';
import { chargeUSDC } from '@/services/blockchain.api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Step3ConfirmProps {
  onBack: () => void;
  data: {
    network: string;
    address: string;
    method: string;
    amount: number;
  };
}

export default function Step3_Confirm({ onBack, data }: Step3ConfirmProps) {
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  const paymentIcon = data.method === 'card' ? CreditCard : data.method === 'google' ? Globe : null;
  const PaymentIcon = paymentIcon ?? CreditCard;

  const router = useRouter();

  const handleCharge = async () => {
    try {
      setLoading(true);
      const res = await chargeUSDC({ payment: data.amount });
      setTxHash(res.result.txHash);
      setBalance(res.result.usdc);

      if (res.code === 200) {
        toast.success(t.blockchain.success);
        router.replace('/my-profile');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(t.blockchain.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <BackHeader title={t.blockchain.title} onBack={onBack} />
        {loading && (
          <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden bg-gray-100">
            <div className="h-full bg-gradient-to-r from-primary to-green animate-progress" />
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold">{t.blockchain.step3Title}</h2>
        <p className="text-sm text-gray-500 mt-2">{t.blockchain.step3Desc}</p>
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 space-y-5 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">{t.blockchain.network}</span>
          <span className="text-gray-800">{data.network}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">{t.blockchain.walletAddress}</span>
          <span className="font-mono text-gray-800 truncate max-w-[180px]">
            {data.address || '-'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">{t.blockchain.confirmPayment}</span>
          <div className="flex items-center gap-2 text-gray-800">
            <PaymentIcon size={18} className="text-gray-600" />
            <span className="font-medium">
              {data.method === 'card'
                ? t.blockchain.methodCard
                : data.method === 'google'
                  ? t.blockchain.methodGoogle
                  : '-'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">{t.blockchain.confirmAmount}</span>
          <span className="font-semibold text-gray-800">{data.amount} USDC</span>
        </div>
      </div>

      <div className="mt-auto w-full">
        <button
          onClick={handleCharge}
          disabled={loading}
          className="w-full py-3 rounded-full font-medium text-base shadow transition bg-gradient-to-r from-primary to-green text-white hover:opacity-90 active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              {t.blockchain.loading}
            </div>
          ) : (
            t.blockchain.proceed
          )}
        </button>
      </div>
    </>
  );
}
