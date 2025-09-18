import Image from 'next/image';
import PreviewUser from '@/assets/icons/preview-user.png';

export interface UserItem {
  id: string;
  nickname: string;
}

interface Props {
  user: UserItem;
  onClick?: (user: UserItem) => void;
}

export default function UserCard({ user }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-28 w-24 rounded-2xl border border-gray-100 bg-gray-50">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
        <Image src={PreviewUser} alt="user" width={48} height={48} />
      </div>
      <span className="mt-2 text-[13px] text-gray-800 font-bold truncate max-w-[80px]">
        {user.nickname}
      </span>
    </div>
  );
}
