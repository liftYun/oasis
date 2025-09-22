'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { SegmentedTabs } from '@/components/molecules/SegmentedTabs';
import { MultiSelectChips } from '@/components/molecules/MultiSelectChips';
import { useAmenitiesQuery } from '@/features/create-stay/hooks/useAmenitiesQuery';
import type { AmenityCategoryKey } from '@/features/create-stay/constants/amenities';
import { useStayStores } from '@/stores/useStayStores';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { ChevronLeft } from 'lucide-react';

export function Step3_Amenities() {
  const store = useStayStores();
  const { data } = useAmenitiesQuery();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const initialCategory: AmenityCategoryKey = 'bathroom';
  const [category, setCategory] = useState<AmenityCategoryKey>(initialCategory);
  const [selectedIds, setSelectedIds] = useState<number[]>(store.facilities ?? []);

  if (!data) {
    return <div className="text-sm text-gray-400">{t.step3.loading}</div>;
  }

  const tabs = (Object.keys(data.categoryLabels) as AmenityCategoryKey[]).map((key) => ({
    key,
    label: data.categoryLabels[key],
  }));

  const currentIds = (data.amenityIdsByCategory[category] as unknown as number[]) ?? [];

  const currentOptions = currentIds.map((id) => ({
    key: id,
    label: data.amenityLabels[id as unknown as keyof typeof data.amenityLabels],
  }));
  const categorySelected = selectedIds.filter((id) => currentIds.includes(id));

  const handleChangeValues = (newCategoryValues: number[]) => {
    const otherIds = selectedIds.filter((id) => !currentIds.includes(id));
    const updated = [...otherIds, ...newCategoryValues];

    setSelectedIds(updated);
    store.setField('facilities', updated);
  };

  const handleNext = () => {
    store.setField('facilities', selectedIds);
    store.setStep(store.currentStep + 1);
  };

  const handleBack = () => {
    if (store.currentStep > 1) {
      store.setStep(store.currentStep - 1);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col min-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-[70]">
        <header className="relative h-14 bg-white px-2 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="back"
          >
            <ChevronLeft className="w-7 h-7 text-gray-500" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600">
            {t.createStay}
          </h1>

          <div className="w-7" />
        </header>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2 pt-2">{t.step3.title}</h1>
          <p className="text-gray-400 text-sm">{t.step3.subtitle}</p>
        </div>

        <SegmentedTabs tabs={tabs} value={category} onChange={setCategory} className="mt-2" />

        <MultiSelectChips
          options={currentOptions}
          values={categorySelected}
          onChange={handleChangeValues}
        />

        <div className="mt-auto pt-4">
          <Button type="button" onClick={handleNext} variant="blue">
            {t.common.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
