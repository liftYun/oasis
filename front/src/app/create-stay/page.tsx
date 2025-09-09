import { CreateStay } from '@/features/create-stay';

export default function Page({
  searchParams,
}: {
  searchParams?: { step?: string | string[] };
}) {
  // 1. 배열일 경우 첫 번째 값을 사용하고, 아니면 그대로 사용
  const raw = Array.isArray(searchParams?.step) ? searchParams!.step[0] : searchParams?.step;
  
  // 2. 문자열을 숫자로 변환
  const parsed = Number(raw);

  // 3. 유효한 숫자인지 검증하고, 아니면 기본값(1)을 사용
  const currentStep = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;

  // 이제 currentStep을 안전하게 사용할 수 있습니다.
  return <div>Current Step: {currentStep}</div>;
}
