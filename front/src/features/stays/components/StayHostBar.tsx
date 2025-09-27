'use client';

import { useState } from 'react';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';
import { deleteStay } from '@/services/stay.api';
import { toast } from 'react-hot-toast';
import { CenterModal } from '@/components/organisms/CenterModal';

interface Props {
  stay: {
    stayId: number;
  };
}

export function StayHostBar({ stay }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteStay(stay.stayId);
      toast.success(t.common.deleteSuccess ?? '숙소가 삭제되었습니다.');
      setOpen(false);
      router.push('/my-profile/manage-stay');
    } catch (err: any) {
      console.error(err);
      toast.error(t.common.deleteError ?? '삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    router.push(`/edit-stay/${encodeURIComponent(stay.stayId)}`);
  };

  return (
    <>
      <div className="fixed bottom-0 w-full max-w-[480px] bg-white border border-gray-100 z-[50]">
        <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 bg-gray-100 text-gray-400 rounded-md px-4 py-3 text-base font-medium transition"
          >
            {t.common.delete ?? '삭제'}
          </button>

          <button
            onClick={handleEdit}
            className="flex-1 bg-gray-600 text-white rounded-md px-4 py-3 text-base font-medium transition"
          >
            {t.common.edit}
          </button>
        </div>
      </div>

      <CenterModal
        open={open}
        onClose={() => setOpen(false)}
        title={t.common.delete ?? '삭제'}
        description={
          t.common.deleteConfirm ?? '정말 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.'
        }
      >
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 text-sm hover:bg-gray-200"
        >
          {t.common.back ?? '취소'}
        </button>

        <button
          onClick={handleDelete}
          className="px-5 py-3 rounded-md bg-gray-600 text-white text-sm font-medium"
        >
          {t.common.delete ?? '삭제'}
        </button>
      </CenterModal>
    </>
  );
}
