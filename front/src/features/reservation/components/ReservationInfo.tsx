import Image from 'next/image';
import { ReservationDetailApiResponse } from '@/services/reservation.types';
import Usdc from '@/assets/icons/usd-circle.png';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';

// const mockParticipants = {
//   count: 6,
//   members: Array.from({ length: 6 }).map(() => ({
//     nickname: '이민희',
//     profileImageUrl: '',
//   })),
// };

interface ReservationInfoProps {
  reservation: ReservationDetailApiResponse;
}

export function ReservationInfo({ reservation }: ReservationInfoProps) {
  const participants =
    // reservation.participants?.members?.length > 0 ? reservation.participants : mockParticipants;
    reservation.participants;
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-blue-500 rounded-sm" />
        {t.reservation.reservationDetail}
      </h2>

      <div className="flex rounded-md bg-gray-100 divide-x">
        <div className="flex-1 p-4 text-center">
          <p className="text-xs font-semibold text-gray-600">{t.reservation.checkin}</p>
          <p className="mt-1 font-semibold text-gray-600">
            {new Date(reservation.schedule.checkinDate).toLocaleDateString('ko-KR', {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              weekday: 'short',
            })}
          </p>
          <p className="text-sm text-gray-400">
            {new Date(reservation.schedule.checkinDate).toLocaleTimeString('ko-KR', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
        <div className="flex-1 p-4 text-center">
          <p className="text-xs font-semibold text-gray-600">{t.reservation.checkout}</p>
          <p className="mt-1 font-semibold text-gray-600">
            {new Date(reservation.schedule.checkoutDate).toLocaleDateString('ko-KR', {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              weekday: 'short',
            })}
          </p>
          <p className="text-sm text-gray-400">
            {new Date(reservation.schedule.checkoutDate).toLocaleTimeString('ko-KR', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div className="rounded-md bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold text-gray-600 flex items-center gap-1">
            {t.reservation.smartKey}
          </span>
          <span className="text-xs text-gray-500 rounded-full bg-gray-200 px-3 py-1">
            {participants.count} {t.reservation.participants}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {participants.members.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center w-12 text-xs">
              <Image
                src={m.profileImageUrl || '/default-avatar.png'}
                alt={m.nickname}
                width={48}
                height={48}
                className="rounded-full border border-gray-200 bg-gray-50"
              />
              <span className="truncate mt-1 text-gray-600 font-medium">{m.nickname}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 p-6 shadow-sm bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-600">{t.reservation.payment}</span>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-600">
            <Image src={Usdc} alt="usd" width={20} height={20} />
            <span>{reservation.payment.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
