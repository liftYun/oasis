'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export function Step2_Description() {
  const { formData, setFormData, currentStep, setStep } = useCreateStayStore();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const [description, setDescription] = useState<string>(formData.description ?? '');

  const MAX_LEN = 1000;
  const length = description.length;
  const isValid = description.trim().length > 0 && length <= MAX_LEN;

  useEffect(() => {
    if (formData.description && formData.description !== description) {
      setDescription(formData.description);
    }
  }, [formData.description]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ description: description.trim() } as any);
    setStep(currentStep + 1);
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const isComposing = (e.nativeEvent as any)?.isComposing;
    const val = e.target.value;
    if (isComposing) {
      setDescription(val);
      return;
    }
    setDescription(val.length > MAX_LEN ? val.slice(0, MAX_LEN) : val);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      <h1 className="text-xl font-bold">{t.step2.title}</h1>

      <div className="bg-primary/10 text-primary text-xs p-2 me-auto mb-6 rounded-md">
        <span className="text-primary font-bold">{t.step2.tipTitle}</span> {t.step2.tipText}
      </div>

      <TextAreaField
        label={t.step2.descriptionLabel}
        id="description"
        value={description}
        onChange={handleChange}
        placeholder={t.step2.descriptionPlaceholder}
        maxLength={MAX_LEN}
        length={length}
      />

      <div className="mt-auto pt-4">
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
          variant={isValid ? 'blue' : 'google'}
        >
          {t.common.next}
        </Button>
      </div>
    </div>
  );
}
