'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { HostInfoResponseDto } from '@/services/stay.types';

interface Host {
  nickname: string;
  uuid: string;
  url?: string;
}

interface StayHostProps {
  host: Host;
  onChatStart: (host: HostInfoResponseDto) => void;
}

export default function StayHost({ host, onChatStart }: StayHostProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  return (
    <section className="my-12">
      <h2 className="text-lg font-semibold mb-3">{t.detail.hostTitle}</h2>

      <div className="flex items-center gap-6 rounded-md bg-gray-100 p-4">
        {host.url ? (
          <img src={host.url} alt={host.nickname} className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        <div className="flex flex-col">
          <div className="mb-1">
            <span className="inline-block text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">
              {t.host.hostName}
            </span>
          </div>
          <span className="text-gray-600 font-medium">{host.nickname}</span>
        </div>
      </div>
      <button
        onClick={() => onChatStart(host)}
        className="mt-4 w-full rounded-md py-3 text-sm font-medium text-gray-600 transition"
        style={{
          background: 'linear-gradient(to right, #dbeafe, #fef9c3)',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #bfdbfe, #fef08a)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #dbeafe, #fef9c3)')
        }
        onMouseDown={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #bfdbfe, #fef08a)')
        }
        onMouseUp={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #dbeafe, #fef9c3)')
        }
      >
        {t.host.chatStart}
      </button>
    </section>
  );
}
