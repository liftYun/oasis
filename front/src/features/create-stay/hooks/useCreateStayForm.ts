// features/create-stay/hooks/useCreateStayForm.ts
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  buildCreateStayInputSchema,
  type CreateStayInput,
  type CreateStayOutput,
} from '@/features/create-stay/schema';
import { useLanguage } from '@/features/language';

interface UseCreateStayFormProps {
  onFormSubmit: (data: CreateStayOutput) => Promise<void>;
  defaultValues?: Partial<CreateStayInput>;
}

export function useCreateStayForm({ onFormSubmit, defaultValues }: UseCreateStayFormProps) {
  const { lang } = useLanguage();
  const schema = useMemo(() => buildCreateStayInputSchema(lang), [lang]);
  const resolver = useMemo(() => zodResolver(schema), [schema]);
  const form = useForm<CreateStayInput>({
    resolver,
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    // 언어 변경 시 에러 메시지/검증 결과를 최신화
    form.trigger();
  }, [resolver]);

  const onSubmit = async (data: CreateStayInput) => {
    const transformedData: CreateStayOutput = {
      ...data,
      address_line: `${data.address} ${data.addressDetail || ''}`.trim(),
    };
    await onFormSubmit(transformedData);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
