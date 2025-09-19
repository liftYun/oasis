'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { SegmentedTabs } from '@/components/molecules/SegmentedTabs';
import { MultiSelectChips } from '@/components/molecules/MultiSelectChips';
import { useAmenitiesQuery } from '@/features/create-stay/hooks/useAmenitiesQuery';
import type {
  AmenityCategoryKey,
  AmenityOptionKey,
} from '@/features/create-stay/constants/amenities';
import { useStayStores } from '@/stores/useStayStores';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import BackHeader from '@/components/molecules/BackHeader';

export function Step3_Amenities() {
  const store = useStayStores();
  const { data } = useAmenitiesQuery();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const initialCategory: AmenityCategoryKey = 'bathroom';
  const [category, setCategory] = useState<AmenityCategoryKey>(initialCategory);
  const tabs = !data
    ? ([] as { key: AmenityCategoryKey; label: string }[])
    : (Object.keys(data.categoryLabels) as AmenityCategoryKey[]).map((key) => ({
        key,
        label: data.categoryLabels[key],
      }));

  // 기존 store 값 복원
  const [selected, setSelected] = useState<Record<AmenityCategoryKey, AmenityOptionKey[]>>(() => {
    return (
      (store.facilities as any) ?? {
        bathroom: [],
        bedroom: [],
        kitchen: [],
        convenience: [],
        around: [],
      }
    );
  });

  // 선택 변경 시마다 store에 즉시 반영
  const handleChangeValues = (values: AmenityOptionKey[]) => {
    const newSelected = { ...selected, [category]: values };
    setSelected(newSelected);
    store.setField('facilities', newSelected as any);
    console.log('[DEBUG] store.facilities 저장됨:', newSelected);
  };

  const currentOptions: { key: AmenityOptionKey; label: string }[] = !data
    ? []
    : (data.amenityIdsByCategory[category] ?? []).map((id) => ({
        key: id,
        label: data.amenityLabels[id],
      }));

  // Step2와 동일: 저장 후 다음 step
  const handleNext = () => {
    console.log('[DEBUG] handleNext 실행');
    store.setField('facilities', selected as any);
    console.log('[DEBUG] 최종 store.facilities 저장됨');
    console.log('[DEBUG] currentStep ->', store.currentStep, '→', store.currentStep + 1);
    store.setStep(store.currentStep + 1);
  };

  if (!data) {
    return <div className="text-sm text-gray-400">{t.step3.loading}</div>;
  }

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col p-4 min-h-[calc(100vh-116px)] overflow-y-auto">
      <BackHeader title={t.createStay} />
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2 pt-2">{t.step3.title}</h1>
        <p className="text-gray-400 text-base">{t.step3.subtitle}</p>
      </div>

      <SegmentedTabs tabs={tabs} value={category} onChange={setCategory} className="mt-2" />

      <MultiSelectChips
        options={currentOptions}
        values={(selected[category] ?? []) as string[]}
        onChange={(vals) => handleChangeValues(vals as AmenityOptionKey[])}
      />

      <div className="mt-auto pt-4">
        <Button type="button" onClick={handleNext} variant="blue">
          {t.common.next}
        </Button>
      </div>
    </div>
  );
}
