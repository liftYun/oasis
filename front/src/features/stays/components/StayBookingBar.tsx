'use client';

export function StayBookingBar({ price }: { price: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex items-center justify-between">
      <p className="font-semibold text-lg">${price} / 박</p>
      <button className="px-5 py-3 rounded-lg bg-black text-white font-medium">예약하기</button>
    </div>
  );
}
