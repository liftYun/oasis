import { http } from '@/apis/httpClient';
import { makeReservationId } from '@/utils/makeReservationId';
import { createReservation, approveReservation, lockReservation } from '@/services/reservation.api';
import type { CreateReservationRequest } from '@/services/reservation.types';
import { useRouter } from 'next/navigation';

// 최소한의 Circle SDK 인터페이스 (정적 import 방지)
type CircleSdk = {
  execute: (challengeId: string, cb: (error?: unknown) => void) => void;
  setAppSettings: (args: { appId: string }) => void;
  setAuthentication: (args: { userToken: string; encryptionKey: string }) => void;
};

// Circle SDK PIN 입력 처리
async function executeChallenge(sdk: CircleSdk, challengeId: string, label: string) {
  return new Promise<void>((resolve, reject) => {
    sdk.execute(challengeId, (error?: unknown) => {
      if (error) {
        return reject(error instanceof Error ? error : new Error(String(error)));
      }
      resolve();
    });
  });
}

async function notifyTransactionSuccess(challengeId: string, type: string) {
  await http.post(`/api/v1/reservation/${type.toLowerCase()}/confirm`, {
    challengeId,
    status: 'SUCCESS',
  });
}

async function notifyTransactionFailed(challengeId: string, type: string) {
  await http.post(`/api/v1/reservation/${type.toLowerCase()}/confirm`, {
    challengeId,
    status: 'FAILED',
  });
}

// 예약 등록 + Approve + Lock 실행
export async function submitReservation(
  state: any,
  sdkInitData: { appId: string; userToken: string; encryptionKey: string }
) {
  if (!sdkInitData) {
    throw new Error('먼저 ConnectWallet로 SDK를 준비하세요.');
  }

  // 1. SDK 준비 (클라이언트에서만 동적 로드)
  const { W3SSdk } = await import('@circle-fin/w3s-pw-web-sdk');
  const sdk = new W3SSdk() as unknown as CircleSdk;
  sdk.setAppSettings({ appId: sdkInitData.appId });
  sdk.setAuthentication({
    userToken: sdkInitData.userToken,
    encryptionKey: sdkInitData.encryptionKey,
  });

  // 2. 예약 파라미터 계산
  const nowUTC = Math.floor(Date.now() / 1000);
  const KST_OFFSET = 9 * 3600;
  const nowKST = nowUTC + KST_OFFSET;

  const checkIn = nowKST + 7 * 24 * 3600; // 7일 뒤
  const checkOut = checkIn + 1 * 24 * 3600; // 1박

  const resId = makeReservationId();

  const reservationVo: CreateReservationRequest = {
    reservationId: resId,
    stayId: state.stayId,
    checkinDate: new Date(checkIn * 1000).toISOString(),
    checkoutDate: new Date(checkOut * 1000).toISOString(),
    reservationDate: new Date().toISOString(),
    payment: state.payment,
  };

  // 3. 예약 DB 등록
  // console.log('예약 등록 요청...');
  const dbRes = await createReservation(reservationVo);
  if (!dbRes.isSuccess) {
    throw new Error(dbRes.message || '예약 DB 등록 실패');
  }
  // console.log('예약 DB 등록 완료');

  // 4. Approve
  // console.log('Approve 트랜잭션 요청...');
  const approveRes = await approveReservation(reservationVo);
  const approveResult = approveRes.result;
  if (approveResult?.challengeId) {
    // console.log('Approve PIN 입력 대기...');
    await executeChallenge(sdk, approveResult.challengeId, 'Approve');
  } else {
    throw new Error('Approve ChallengeId 없음');
  }

  // 5. Lock
  console.log('Lock 트랜잭션 요청...');
  const lockRes = await lockReservation(reservationVo);
  const lockResult = lockRes.result;
  if (lockResult?.challengeId) {
    console.log('Lock PIN 입력 대기...');
    await executeChallenge(sdk, lockResult.challengeId, 'Lock');
  } else {
    throw new Error('Lock ChallengeId 없음');
  }

  // console.log('예약 전체 완료 (DB + Approve + Lock)');

  return dbRes.result;
}
