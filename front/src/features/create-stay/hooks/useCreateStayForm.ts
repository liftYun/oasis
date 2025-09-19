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
    resolver: zodResolver(buildCreateStayInputSchema(lang)) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      titleEng: '',
      description: '',
      descriptionEng: '',
      address: '',
      addressEng: '',
      addressDetail: '',
      addressDetailEng: '',
      postalCode: '',
      subRegionId: 0,
      price: undefined,
      maxGuest: undefined,
      facilities: [],
      blockRangeList: [],
      imageRequestList: [],
      images: undefined,
      ...defaultValues,
    },
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
