'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { SegmentedTabs } from '@/components/molecules/SegmentedTabs';
import { MultiSelectChips } from '@/components/molecules/MultiSelectChips';
import { useAmenitiesQuery } from '@/features/create-stay/hooks/useAmenitiesQuery';
import type { AmenityCategoryKey } from '@/features/create-stay/constants/amenities';
import { useCreateStayStore } from '@/features/create-stay/store';

export function Step3_Amenities() {
  const { data } = useAmenitiesQuery();
  const { setStep, currentStep, setFormData, formData } = useCreateStayStore();

  const initialCategory: AmenityCategoryKey = 'bathroom';
  const [category, setCategory] = useState<AmenityCategoryKey>(initialCategory);

  const tabs = useMemo(() => {
    if (!data) return [] as { key: AmenityCategoryKey; label: string }[];
    return (Object.keys(data.categoryLabels) as AmenityCategoryKey[]).map((key) => ({
      key,
      label: data.categoryLabels[key],
    }));
  }, [data]);

  const [selected, setSelected] = useState<Record<AmenityCategoryKey, string[]>>(() => {
    // 스토어에 기존 선택이 있다면 복구
    const saved = (formData as any)?.amenities as Record<AmenityCategoryKey, string[]> | undefined;
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

  const currentOptions: string[] = useMemo(() => {
    if (!data) return [];
    return data.amenitiesByCategory[category] ?? [];
  }, [data, category]);

  const handleChangeValues = (values: string[]) => {
    setSelected((prev) => ({ ...prev, [category]: values }));
  };

  const handleNext = () => {
    // 선택이 없어도 다음으로 넘어갈 수 있음
    setFormData({ amenities: selected } as any);
    setStep(currentStep + 1);
  };

  if (!data) {
    return <div className="text-sm text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-1">숙소 편의시설을 선택해주세요.</h1>
        <p className="text-gray-400 text-sm">카테고리 별로 확인해주세요!</p>
      </div>

      <SegmentedTabs tabs={tabs} value={category} onChange={setCategory} className="mt-2" />

      <MultiSelectChips
        options={currentOptions}
        values={selected[category] ?? []}
        onChange={handleChangeValues}
      />

      <div className="mt-auto pt-4">
        <Button
          type="button"
          onClick={handleNext}
          className="w-full font-bold mb-10 bg-black text-white hover:bg-black active:bg-black"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
