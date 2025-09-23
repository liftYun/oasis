'use client';

import { useCallback, useRef, useState, type JSX } from 'react';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import type { SdkInitData } from './types';
import { getToken } from './jwt';
import { makeReservationId } from '@/utils/makeReservationId';

interface Props {
  sdkInitData: SdkInitData | null;
  stayId?: number;
  amountUSDC?: number;
  feeUSDC?: number;
  checkInOffsetSec?: number;
  stayNights?: number;
  onBooked?: (resId: string) => void;
}

export default function LockWithCircle({
  sdkInitData,
  stayId = 36,
  amountUSDC = 1,
  feeUSDC = 0,
  checkInOffsetSec = 7 * 24 * 3600,
  stayNights = 1,
  onBooked,
}: Props): JSX.Element {
  const [log, setLog] = useState('대기 중...');
  const [busy, setBusy] = useState(false);
  const sdkRef = useRef<W3SSdk | null>(null);

  const append = (s: string) => setLog((prev) => (prev ? prev + '\n' + s : s));

  async function apiPost(path: string, body: any) {
    const token = getToken();
    const resp = await fetch(`http://localhost:8080/api/v1/reservation${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const raw = await resp.text();
    console.log(`${path} raw body:`, raw);

    if (!resp.ok) {
      throw new Error(`API 실패: ${path} - HTTP ${resp.status} - ${raw}`);
    }
    return JSON.parse(raw);
  }

  // ------------------- SDK 실행 래퍼 ------------------- //
  async function executeChallenge(sdk: W3SSdk, challengeId: string, label: string) {
    return new Promise<void>((resolve, reject) => {
      sdk.execute(challengeId, (error, result) => {
        if (error) {
          append(`❌ ${label} 실패: ${error.message}`);
          return reject(error);
        }
        append(`✅ ${label} 완료`);
        resolve();
      });
    });
  }

  // ------------------- 예약 실행 ------------------- //
  const run = useCallback(async () => {
    if (!sdkInitData) {
      alert('먼저 지갑을 ConnectWallet로 준비하세요.');
      return;
    }
    setBusy(true);
    setLog('');

    try {
      if (!sdkRef.current) sdkRef.current = new W3SSdk();
      const sdk = sdkRef.current;
      sdk.setAppSettings({ appId: sdkInitData.appId });
      sdk.setAuthentication({
        userToken: sdkInitData.userToken,
        encryptionKey: sdkInitData.encryptionKey,
      });

      const nowUTC = Math.floor(Date.now() / 1000);
      const KST_OFFSET = 9 * 3600;
      const nowKST = nowUTC + KST_OFFSET;

      const checkIn = nowKST + 7 * 24 * 3600;
      const checkOut = checkIn + 1 * 24 * 3600;

      const resId = makeReservationId();

      const reservationVo = {
        reservationId: resId,
        stayId,
        checkinDate: new Date(checkIn * 1000).toISOString(),
        checkoutDate: new Date(checkOut * 1000).toISOString(),
        reservationDate: new Date().toISOString(),
        isSettlemented: false,
        isReviewed: false,
        payment: amountUSDC,
        isCancled: false,
        stayTitle: '테스트 숙소',
        stayTitleEng: 'Test Stay',
      };

      append('예약 등록 요청...');
      await apiPost('', reservationVo);
      append('✅ 예약 DB 등록 완료');

      append('Approve 트랜잭션 요청...');
      const approveResp = await apiPost('/approve', reservationVo);
      const approveResult = approveResp.result;
      if (approveResult?.challengeId) {
        append('Approve PIN 입력 대기...');
        await executeChallenge(sdk, approveResult.challengeId, 'Approve');
      } else {
        throw new Error('Approve ChallengeId 없음');
      }

      append('Lock 트랜잭션 요청...');
      const lockResp = await apiPost('/lock', reservationVo);
      const lockResult = lockResp.result;
      if (lockResult?.challengeId) {
        append('Lock PIN 입력 대기...');
        await executeChallenge(sdk, lockResult.challengeId, 'Lock');
      } else {
        throw new Error('Lock ChallengeId 없음');
      }

      append('🎉 예약 전체 완료 (DB + Approve + Lock)');
      onBooked?.(resId);
    } catch (e: any) {
      append(`에러: ${e.message ?? String(e)}`);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [sdkInitData, checkInOffsetSec, stayNights, stayId, amountUSDC, feeUSDC, onBooked]);

  return (
    <div className="mt-4">
      <button
        onClick={run}
        disabled={busy || !sdkInitData}
        className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium disabled:opacity-50"
      >
        {busy ? '처리 중...' : '예약 등록 실행'}
      </button>
      <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{log}</pre>
    </div>
  );
}
