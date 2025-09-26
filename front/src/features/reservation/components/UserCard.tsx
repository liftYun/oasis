import Image from 'next/image';
import PreviewUser from '@/assets/icons/preview-user.png';

export interface UserItem {
  id: string;
  nickname: string;
  profileUrl?: string;
}

interface Props {
  user: UserItem;
  className?: string;
  onClick?: (user: UserItem) => void;
}

export default function UserCard({ user, className = '', onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(user)}
      className={`flex flex-col items-center justify-center h-28 w-full rounded-md bg-gray-100 cursor-pointer hover:border-primary hover:bg-primary/10 transition ${className}`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
        <Image src={user.profileUrl || PreviewUser} alt={user.nickname} width={48} height={48} />
      </div>
      <span className="mt-4 text-sm text-gray-600 font-medium truncate max-w-[80px]">
        {user.nickname}
      </span>
    </div>
  );
}
