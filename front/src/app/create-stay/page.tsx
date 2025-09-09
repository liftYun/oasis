import { CreateStay } from '@/features/create-stay';

export default async function Page({ searchParams }: { searchParams: Promise<{ step?: number }> }) {
  const sp = await searchParams;
  const currentStep = sp.step ?? 1;

  return <CreateStay currentStep={currentStep} />;
}
