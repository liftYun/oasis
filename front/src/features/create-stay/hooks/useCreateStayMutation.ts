import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useCreateStayMutation() {
  const router = useRouter();

  return useMutation({
    onSuccess: (data) => {
      console.log('숙소 생성 성공:', data);
      // 성공 시 다음 페이지로 이동하거나, 사용자에게 성공 피드백을 보여줍니다.
      // 예: router.push(`/create-stay/success?stayId=${data.stayId}`);
      alert('숙소 생성이 완료되었습니다!');
    },
    onError: (error) => {
      console.error('숙소 생성 실패:', error);
      // 실패 시 에러 메시지를 보여줍니다.
      alert('숙소 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
