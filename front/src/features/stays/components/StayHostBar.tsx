'use client';

import { useState } from 'react';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';
import { deleteStay } from '@/services/stay.api';
import { CenterModal } from '@/components/organisms/CenterModel';
import { toast } from 'react-hot-toast';

interface Props {
  stay: {
    stayId: number;
  };
}

export default function StayHostBar({ stay }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 수정 버튼
  const handleEdit = () => {
    router.push(`/edit-stay/${encodeURIComponent(stay.stayId)}`);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await deleteStay(stay.stayId);
      toast.success(t.common.deleteSuccess);
      router.push('/my-profile/manage-stay');
    } catch (error) {
      toast.error(t.common.deleteError);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-200">
        <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
          <button
            onClick={handleDeleteClick}
            className="flex-1 bg-gray-100 text-gray-600 rounded-md px-4 py-3 text-base font-medium hover:bg-gray-200 transition"
          >
            {t.common.delete}
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
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t.common.deleteStay}
        description={t.common.deleteConfirm}
      >
        <button
          className="h-11 flex-1 rounded-md bg-gray-100 font-normal text-sm text-gray-600 hover:bg-gray-200"
          onClick={() => setConfirmOpen(false)}
        >
          {t.common.back}
        </button>

        <button
          className="h-11 flex-1 rounded-md bg-gray-600 font-normal text-sm text-white disabled:opacity-50"
          disabled={submitting}
          onClick={handleConfirmDelete}
        >
          {submitting ? t.common.loading : t.common.delete}
        </button>
      </CenterModal>
    </>
  );
}
