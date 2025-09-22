'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { useStayStores } from '@/stores/useStayEditStroes';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { translateStay } from '@/services/stay.api';
import { useStayTranslateSSE } from '@/features/create-stay/hooks/useStayTranslateSSE';
import { ChevronLeft, Minus, Plus } from 'lucide-react';

export function Step2_Description_Edit() {
  const store = useStayStores();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  useStayTranslateSSE();

  const [description, setDescription] = useState(store.description ?? '');
  const [maxGuest, setMaxGuest] = useState(store.maxGuest ?? 1);

  const MAX_LEN = 1000;
  const length = description.length;
  const isValid = description.trim().length > 0 && length <= MAX_LEN && maxGuest > 0;

  useEffect(() => {
    if (store.description && store.description !== description) {
      setDescription(store.description);
    }
  }, [store.description]);

  useEffect(() => {
    if (store.maxGuest) {
      setMaxGuest(store.maxGuest);
    }
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const isComposing = (e.nativeEvent as any)?.isComposing;
    const val = e.target.value;
    if (isComposing) return setDescription(val);

    const trimmed = val.length > MAX_LEN ? val.slice(0, MAX_LEN) : val;
    setDescription(trimmed);
    store.setField('description', trimmed);
  };

  const handleNext = async () => {
    if (!isValid) return;

    store.setField('description', description.trim());
    store.setField('maxGuest', maxGuest);

    await translateStay({
      detailAddress: store.addressDetail,
      title: store.title,
      content: description.trim(),
      language: lang.toUpperCase() as 'KOR' | 'ENG',
    });

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
            {t.editStay ?? '숙소 수정'}
          </h1>

          <div className="w-7" />
        </header>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2 pt-2">{t.step2.title}</h1>
          <div className="bg-primary/10 text-primary text-xs p-2 px-4 mx-auto mb-6 rounded-md">
            <span className="text-primary font-bold">{t.step2.tipTitle}</span> {t.step2.tipText}
          </div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {t.step2.maxGuestLabel}
          </label>
          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <button
              type="button"
              onClick={() => setMaxGuest((prev) => Math.max(1, prev - 1))}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
              disabled={maxGuest <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>

            <span className="text-base font-bold text-gray-600">
              {maxGuest} {t.step2.peolple}
            </span>

            <button
              type="button"
              onClick={() => setMaxGuest((prev) => Math.min(6, prev + 1))}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
              disabled={maxGuest >= 6}
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <TextAreaField
            label={t.step2.descriptionLabel}
            id="description"
            value={description}
            onChange={handleChange}
            placeholder={t.step2.descriptionPlaceholder}
            maxLength={MAX_LEN}
            length={length}
          />
        </div>

        <div className="mt-auto pt-4">
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            variant={isValid ? 'blue' : 'blueLight'}
          >
            {t.common.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
