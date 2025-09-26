'use client';

export default function Step3_Confirm({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h2 className="text-lg font-semibold">Confirm details</h2>
      <p className="text-sm text-gray-500">Step 3 of 3</p>

      <div className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-600">
        <p>Network: Ethereum (ERC20)</p>
        <p>Wallet: 0x1234...abcd</p>
        <p>Payment: Google Pay</p>
        <p>Amount: 50 USDC</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-full border">
          Back
        </button>
        <button
          onClick={() => console.log('최종 결제 진행')}
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-primary to-green text-white font-medium"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
