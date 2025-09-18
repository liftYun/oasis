import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  buildReservationSchema,
  type ReservationInput,
  type ReservationValidated,
} from '@/features/reservation/schema';
import { useLanguage } from '@/features/language';
import type { Resolver } from 'react-hook-form';

interface UseReservationFormProps {
  defaultValues?: Partial<ReservationInput>;
  onSubmit: (data: ReservationValidated) => Promise<void> | void;
}

export function useReservationForm({ defaultValues, onSubmit }: UseReservationFormProps) {
  const { lang } = useLanguage();

  const form = useForm<ReservationInput>({
    resolver: zodResolver(buildReservationSchema(lang)) as Resolver<ReservationInput>,
    defaultValues,
    mode: 'onChange',
  });

  return {
    form,
    handleSubmit: form.handleSubmit(async (data) => {
      await onSubmit(data as ReservationValidated);
    }),
  };
}
