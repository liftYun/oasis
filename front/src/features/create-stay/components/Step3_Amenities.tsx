'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { SegmentedTabs } from '@/components/molecules/SegmentedTabs';
import { MultiSelectChips } from '@/components/molecules/MultiSelectChips';
import { useAmenitiesQuery } from '@/features/create-stay/hooks/useAmenitiesQuery';
import type {
  AmenityCategoryKey,
  AmenityOptionKey,
} from '@/features/create-stay/constants/amenities';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export function Step3_Amenities() {
  const { data } = useAmenitiesQuery();
  const { setStep, currentStep, setFormData, formData } = useCreateStayStore();
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

  const [selected, setSelected] = useState<Record<AmenityCategoryKey, AmenityOptionKey[]>>(() => {
    // 스토어에 기존 선택이 있다면 복구
    const saved = (formData as any)?.amenities as
      | Record<AmenityCategoryKey, AmenityOptionKey[]>
      | undefined;
    return (
      saved ?? {
        bathroom: [],
        bedroom: [],
        kitchen: [],
        convenience: [],
        around: [],
      }
    );
  });

  const currentOptions: { key: AmenityOptionKey; label: string }[] = !data
    ? []
    : (data.amenityIdsByCategory[category] ?? []).map((id) => ({
        key: id,
        label: data.amenityLabels[id],
      }));

  const handleChangeValues = (values: AmenityOptionKey[]) => {
    setSelected((prev) => ({ ...prev, [category]: values }));
  };

  const handleNext = () => {
    // 선택이 없어도 다음으로 넘어갈 수 있음
    setFormData({ amenities: selected } as any);
    setStep(currentStep + 1);
  };

  if (!data) {
    return <div className="text-sm text-gray-400">{t.step3.loading}</div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-1">{t.step3.title}</h1>
        <p className="text-gray-400 text-sm">{t.step3.subtitle}</p>
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
