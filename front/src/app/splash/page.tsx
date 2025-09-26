import { Splash } from '@/features/splash';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const lang = sp.lang === 'en' ? 'en' : 'ko';
  return <Splash lang={lang} />;
}
