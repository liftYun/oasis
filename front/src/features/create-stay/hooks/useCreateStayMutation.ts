import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useStayStores } from '@/stores/useStayStores';
import { useLanguage } from '@/features/language';
import { createStay } from '@/services/stay.api';
import type { CreateStayRequest } from '@/services/stay.types';

export function useCreateStayMutation() {
  const router = useRouter();
  const stayStore = useStayStores();
  const { lang } = useLanguage();

  return useMutation({
    mutationFn: async () => {
      const thumbnail = stayStore.imageRequestList?.[0]?.key ?? null;

      const body: CreateStayRequest & { thumbnail?: string | null } = {
        subRegionId: stayStore.subRegionId,
        title: stayStore.title,
        titleEng: stayStore.titleEng,
        description: stayStore.description,
        descriptionEng: stayStore.descriptionEng,
        price: stayStore.price,
        address: stayStore.address,
        addressEng: stayStore.addressEng,
        addressDetail: stayStore.addressDetail,
        addressDetailEng: stayStore.addressDetailEng,
        postalCode: stayStore.postalCode,
        maxGuest: stayStore.maxGuest,
        imageRequestList: stayStore.imageRequestList,
        facilities: stayStore.facilities,
        blockRangeList: stayStore.blockRangeList,
        thumbnail,
      };

      console.log('숙소 생성 요청', body);
      return await createStay(body);
    },

    onSuccess: () => {
      toast.success(lang === 'kor' ? '숙소 생성에 성공했습니다.' : 'Stay created successfully!');
      router.push('/');
    },

    onError: () => {
      toast.error(
        lang === 'kor' ? '숙소 생성에 실패했습니다.' : 'Failed to create stay. Please try again.'
      );
    },
  });
}
