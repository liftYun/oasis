'use client';

import { useState } from 'react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';
import { CreditCard, Globe, Check } from 'lucide-react';

export default function Step2_Payment({
  onNext,
  onBack,
}: {
  onNext: (method: string) => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<string | null>(null);
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  const [cardInfo, setCardInfo] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const methods = [
    { key: 'card', label: 'Card', icon: CreditCard },
    { key: 'google', label: 'Google Pay', icon: Globe },
  ];

  const handleNext = () => {
    if (!method) return;
    onNext(method);
  };

  // 모든 카드 입력 필드가 채워졌는지 확인
  const isCardFilled =
    cardInfo.firstName.trim() &&
    cardInfo.lastName.trim() &&
    cardInfo.cardNumber.trim() &&
    cardInfo.expiry.trim() &&
    cardInfo.cvv.trim();

  // 버튼 활성화 조건
  const isButtonActive = method === 'google' || (method === 'card' && isCardFilled);

  const handleCardChange = (field: string, value: string) => {
    setCardInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <BackHeader title={t.blockchain.title} onBack={onBack} />

      <div className="mt-12">
        <h2 className="text-lg font-semibold">{t.blockchain.step2Title}</h2>
        <p className="text-sm text-gray-500 mt-2">{t.blockchain.step2Desc}</p>
      </div>

      <div className="mt-8 space-y-5">
        {methods.map((m) => (
          <div key={m.key}>
            <label
              className={`flex items-center justify-between w-full p-5 border rounded-lg cursor-pointer transition
                ${
                  method === m.key
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <m.icon size={20} className={method === m.key ? 'text-primary' : 'text-gray-500'} />
                <span
                  className={`text-base font-medium ${
                    method === m.key ? 'text-primary' : 'text-gray-700'
                  }`}
                >
                  {m.label}
                </span>
              </div>

              <div className="relative w-5 h-5">
                <input
                  type="radio"
                  name="payment"
                  value={m.key}
                  checked={method === m.key}
                  onChange={() => setMethod(m.key)}
                  className="appearance-none w-5 h-5 rounded-full border border-gray-400 checked:bg-primary checked:border-primary"
                />
                {method === m.key && (
                  <Check className="absolute inset-0 w-4 h-4 text-white m-auto pointer-events-none" />
                )}
              </div>
            </label>

            {m.key === 'card' && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  method === 'card' ? 'max-h-[600px] mt-4 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-600">First name</label>
                      <input
                        type="text"
                        placeholder="LEE"
                        value={cardInfo.firstName}
                        onChange={(e) => handleCardChange('firstName', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-600">Last name</label>
                      <input
                        type="text"
                        placeholder="MINHEE"
                        value={cardInfo.lastName}
                        onChange={(e) => handleCardChange('lastName', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Card number</label>
                    <input
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      value={cardInfo.cardNumber}
                      onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-600">Expiration date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => handleCardChange('expiry', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm font-medium text-gray-600">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto w-full">
        <button
          onClick={handleNext}
          disabled={!isButtonActive}
          className={`w-full py-3 rounded-full font-medium text-base shadow transition
            ${
              !isButtonActive
                ? 'bg-gradient-to-r from-primary to-green text-white opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-green text-white hover:opacity-90 active:scale-95'
            }`}
        >
          {t.blockchain.proceed}
        </button>
      </div>
    </>
  );
}
