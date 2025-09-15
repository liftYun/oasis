export default function ReservationTab() {
  // 실제로는 API로 예약 목록 불러오기
  return (
    <div className="space-y-3">
      <div className="border rounded-lg p-4 shadow-sm">
        <p className="font-medium text-sm">홍길동</p>
        <p className="text-xs text-gray-500">2025-09-21 ~ 2025-09-23</p>
      </div>
    </div>
  );
}
