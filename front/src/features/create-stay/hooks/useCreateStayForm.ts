// features/create-stay/hooks/useCreateStayForm.ts
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
  const form = useForm<CreateStayInput>({
    resolver: zodResolver(buildCreateStayInputSchema(lang)),
    defaultValues,
    mode: 'onChange',
  });

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
