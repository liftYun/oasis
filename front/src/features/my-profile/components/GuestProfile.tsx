'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/services/auth.api';
import { getMyProfile } from '@/services/user.api';
import type { MyProfile } from '@/services/user.types';
import Calendar from '@/assets/icons/calendar.png';
import Heart from '@/assets/icons/heart-blue.png';
import PositiveReview from '@/assets/icons/positive-review.png';
import SignOut from '@/assets/icons/sign-out.png';
import Usdc from '@/assets/icons/usd-circle.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { useAuthStore } from '@/stores/useAuthStores';
import { toast } from 'react-hot-toast';
import { CenterModal } from '@/components/organisms/CenterModel';
import { Lottie } from '@/components/atoms/Lottie';

export function GuestProfile() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (!initialized || !accessToken) return;

    (async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.result);
      } catch (err) {
        toast.error(t.profileError);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, accessToken]);

  const handleProfile = () => {
    router.push('/my-profile/detail');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t.logoutSuccess);
      window.location.href = '/';
    } catch (err) {
      toast.error(t.logoutFail);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="text-gray-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col items-center px-6 py-8 space-y-6 min-h-screen overflow-y-auto"
        style={{ paddingBottom: 'var(--safe-bottom, 110px)' }}
      >
        <section
          onClick={handleProfile}
          className="flex flex-col items-center space-y-2 cursor-pointer"
        >
          {profile?.profileUrl ? (
            <img
              src={profile.profileUrl}
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
              {profile?.role === 'host' ? t.host : t.guest}
            </span>
            <h2 className="text-xl font-semibold">{profile?.nickname ?? '...'}</h2>
          </div>
        </section>

        <div
          className="w-full max-w-sm rounded-md p-5 mb-8"
          style={{ background: 'linear-gradient(to right, #dbeafe, #e0f2f1)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Image src={Usdc} alt="USDC Icon" width={15} height={15} />
            <span className="text-sm text-gray-800 font-medium">{t.usdc}</span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">19.0</p>
            <button className="px-4 py-1.5 rounded-full bg-white font-semibold flex items-center justify-center">
              <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#3B87F4] to-[#88D4AF]">
                {t.balance}
              </span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-1">
          <p className="text-sm text-gray-500 mb-2 font-bold">{t.reservation}</p>
          <Link
            href="/my-profile/reservations"
            className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
          >
            <Image src={Calendar} alt="Calendar Icon" width={24} height={24} />
            <span className="text-gray-800 text-sm">{t.reservationHistory}</span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-1">
          <p className="text-sm text-gray-500 mb-2 font-bold">{t.activity}</p>
          <Link
            href="/my-profile/favorite"
            className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
          >
            <Image src={Heart} alt="Heart Icon" width={24} height={24} />
            <span className="text-gray-800 text-sm">{t.wishlist}</span>
          </Link>
          <Link
            href="/my-profile/reviews"
            className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
          >
            <Image src={PositiveReview} alt="Positive Review Icon" width={24} height={24} />
            <span className="text-gray-800 text-sm">{t.reviews}</span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-1">
          <p className="text-sm text-gray-500 mb-2 font-bold">{t.guide}</p>
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
          >
            <Image src={SignOut} alt="Sign Out Icon" width={24} height={24} />
            <span className="text-gray-800 text-sm">{t.logout}</span>
          </button>
        </div>
      </div>

      <CenterModal
        open={logoutOpen}
        title={t.logout}
        description={t.logoutDescription}
        onClose={() => setLogoutOpen(false)}
      >
        <button
          onClick={() => setLogoutOpen(false)}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200"
        >
          {t.secessionCancel}
        </button>
        <button
          onClick={handleLogout}
          className="px-5 py-3 rounded-md bg-gray-600 text-white text-sm font-medium"
        >
          {t.logout}
        </button>
      </CenterModal>
    </>
  );
}
