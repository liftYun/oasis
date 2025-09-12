import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import GuestProfile from '@/features/profile/GuestProfile';
import HostProfile from '@/features/profile/HostProfile';

export default async function Page() {
  // 1. 로그인 세션 가져오기
  const session = await getServerSession(authOptions);

  if (!session) {
    // 로그인 안 되어 있으면 로그인 페이지로 보내기
    redirect('/login');
  }

  // 2. 역할 가져오기 (예: session.user.role)
  const role = session.user.role;

  // 3. 역할에 따라 분기 렌더링
  if (role === 'host') {
    return <HostProfile />;
  } else {
    return <GuestProfile />;
  }
}
