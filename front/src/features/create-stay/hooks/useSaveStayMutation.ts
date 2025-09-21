import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useStayStores } from '@/stores/useStayStores';
import { useLanguage } from '@/features/language';
import { createStay, updateStay } from '@/services/stay.api';
import type { CreateStayRequest, UpdateStayRequest } from '@/services/stay.types';

const AMENITY_KEY_TO_ID: Record<string, number> = {
  bath_bathtub: 1,
  bath_shower_booth: 2,
  bath_hair_dryer: 3,
  bath_shampoo: 4,
  bath_rinse: 5,
  bath_bodywash: 6,
  bath_towel: 7,
  bath_toothpaste_toothbrush: 8,
  bath_razor: 9,

  bed_single: 10,
  bed_double: 11,
  bed_twin: 12,
  bed_queen_king: 13,
  bed_sofabed: 14,
  bed_extra_bed_available: 15,
  bed_blackout_curtain: 16,

  kit_fridge: 17,
  kit_microwave: 18,
  kit_coffee_machine: 19,
  kit_stove: 20,
  kit_cookware_tableware: 21,
  kit_kettle: 22,
  kit_bottled_water: 23,

  conv_wifi: 24,
  conv_tv: 25,
  conv_ott: 26,
  conv_wardrobe_hanger: 27,
  conv_styler: 28,
  conv_washer: 29,
  conv_dryer: 30,
  conv_desk: 31,

  around_store_mart: 32,
  around_public_transport: 33,
  around_parking: 34,
  around_park: 35,
};

export function useSaveStayMutation() {
  const router = useRouter();
  const stayStore = useStayStores();
  const { lang } = useLanguage();

  return useMutation({
    mutationFn: async () => {
      const thumbnail = stayStore.imageRequestList?.[0]?.key ?? null;
      const facilitiesAsIds = stayStore.facilities?.map((key) => AMENITY_KEY_TO_ID[key]) ?? [];

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
        facilities: facilitiesAsIds,
        blockRangeList: stayStore.blockRangeList,
        thumbnail,
      };

      if (stayStore.mode === 'create') {
        return await createStay(body);
      } else {
        if (!stayStore.stayId) throw new Error('수정할 숙소 ID가 없습니다.');
        return await updateStay(stayStore.stayId, {
          ...body,
          id: stayStore.stayId,
        } as UpdateStayRequest);
      }
    },

    onSuccess: () => {
      const msg =
        stayStore.mode === 'create'
          ? lang === 'kor'
            ? '숙소 생성에 성공했습니다.'
            : 'Stay created successfully!'
          : lang === 'kor'
            ? '숙소 수정에 성공했습니다.'
            : 'Stay updated successfully!';

      toast.success(msg);
      router.push('/my-profile');
    },

    onError: () => {
      const msg =
        stayStore.mode === 'create'
          ? lang === 'kor'
            ? '숙소 생성에 실패했습니다.'
            : 'Failed to create stay. Please try again.'
          : lang === 'kor'
            ? '숙소 수정에 실패했습니다.'
            : 'Failed to update stay. Please try again.';

      toast.error(msg);
    },
  });
}
