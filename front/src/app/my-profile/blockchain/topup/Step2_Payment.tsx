'use client';

import { useState } from 'react';

export default function Step2_Payment({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h2 className="text-lg font-semibold">Choose payment method</h2>
      <p className="text-sm text-gray-500">Step 2 of 3</p>

      <div className="space-y-3">
        {['Card', 'Google Pay', 'E-Wallet'].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex items-center justify-between w-full px-3 py-4 border rounded-lg ${
              method === m ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <span>{m}</span>
            <input type="radio" checked={method === m} readOnly />
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-full border">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!method}
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-primary to-green text-white font-medium disabled:opacity-50"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
