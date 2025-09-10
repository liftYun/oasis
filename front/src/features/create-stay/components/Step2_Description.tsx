'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { useCreateStayStore } from '@/features/create-stay/store';

export function Step2_Description() {
  const { formData, setFormData, currentStep, setStep } = useCreateStayStore();
  const [description, setDescription] = useState<string>(formData.description ?? '');

  const MAX_LEN = 1000;
  const length = description.length;
  const isValid = useMemo(
    () => description.trim().length > 0 && length <= MAX_LEN,
    [description, length]
  );

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
      <h1 className="text-xl font-bold">숙소 소개글을 작성해주세요.</h1>

      <div className="bg-primary/10 text-primary text-xs p-2 me-auto mb-6 rounded-md">
        <span className="text-primary font-bold">TIP</span> 숙소만의 장점이나 특별한 포인트를
        강조해보세요!
      </div>

      <TextAreaField
        label="숙소 소개글"
        id="description"
        value={description}
        onChange={handleChange}
        placeholder="숙소 소개글을 적어주세요."
        maxLength={MAX_LEN}
        length={length}
      />

      <div className="mt-auto pt-4">
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full font-bold mb-10 ${
            isValid
              ? 'bg-black text-white hover:bg-black active:bg-black'
              : 'bg-gray-200 text-gray-400 hover:bg-gray-200 active:bg-gray-200 disabled:opacity-100'
          }`}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
