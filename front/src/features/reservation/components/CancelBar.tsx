'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';
// import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'; // 제거 - dynamic import에서 로드
import type {
  SdkInitData,
  BaseResponse,
  ChallengeResp,
} from '@/features/my-profile/components/blockchain/types';
import { getToken } from '@/features/my-profile/components/blockchain/jwt';
import { useSdkStore } from '@/stores/useSdkStores';
import { ReservationDetailApiResponse } from '@/services/reservation.types';
import { toast } from 'react-hot-toast';
import { CenterModal } from '@/components/organisms/CenterModel';

interface Props {
  reservation: ReservationDetailApiResponse | null;
}

export function CancelBar({ reservation }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();

  const sdkRef = useRef<any>(null); // W3SSdk 타입 대신 any 사용 (dynamic import이므로)
  const [busy, setBusy] = useState(false);
  const { sdkInitData } = useSdkStore();
  const [W3SSdk, setW3SSdk] = useState<any>(null); // SDK 클래스 상태 관리

  // 클라이언트에서만 SDK 로드
  useEffect(() => {
    const loadSDK = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { W3SSdk: SDKClass } = await import('@circle-fin/w3s-pw-web-sdk');
          setW3SSdk(SDKClass);
        } catch (error) {
          console.error('Failed to load W3SSdk:', error);
        }
      }
    };
    loadSDK();
  }, []);

  // 모달 상태
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const handleCancel = async () => {
    if (!sdkInitData) {
      setWalletModalOpen(true);
      return;
    }

    if (!W3SSdk) {
      toast.error('지갑 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setBusy(true);
    try {
      if (!sdkRef.current) {
        sdkRef.current = new W3SSdk();
      }
      const sdk = sdkRef.current;
      sdk.setAppSettings({ appId: sdkInitData.appId });
      sdk.setAuthentication({
        userToken: sdkInitData.userToken,
        encryptionKey: sdkInitData.encryptionKey,
      });

      const token = getToken();
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reservation/cancel/${reservation?.reservationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`cancel 생성 실패: HTTP ${resp.status} - ${text}`);
      }

      const baseResp: BaseResponse<ChallengeResp> = await resp.json();
      const data = baseResp.result;

      const runOne = (id: string, label?: string) =>
        new Promise<void>((resolve, reject) => {
          sdk.execute(id, (error: unknown) => {
            if (error) {
              return reject(error instanceof Error ? error : new Error(String(error)));
            }
            resolve();
          });
        });

      if ('challengeId' in data && data.challengeId) {
        await runOne(data.challengeId);
      } else if ('challengeIds' in data && Array.isArray(data.challengeIds)) {
        for (const cid of data.challengeIds) {
          await runOne(cid);
        }
      } else if ('steps' in data && Array.isArray(data.steps)) {
        for (const step of data.steps) {
          await runOne(step.challengeId, step.label);
        }
      } else {
        throw new Error('알 수 없는 응답 형식');
      }

      toast.success(t.common.cancelSuccess ?? '예약 취소가 완료되었습니다.');
      router.push('/my-profile/reservations');
    } catch (e: any) {
      toast.error(e.message ?? '예약 취소 중 오류가 발생했습니다.');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  // SDK가 로드되지 않았으면 로딩 표시
  if (!W3SSdk) {
    return (
      <div className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100">
        <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
          <button
            disabled
            className="flex-1 bg-gray-300 text-gray-500 rounded-md px-4 py-3 text-base font-medium cursor-not-allowed"
          >
            SDK 로딩 중...
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100">
        <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
          <button
            onClick={handleCancel}
            disabled={busy}
            className="flex-1 bg-gray-600 text-white rounded-md px-4 py-3 text-base font-medium transition disabled:opacity-50"
          >
            {busy ? t.common.loading : t.common.cancel}
          </button>
        </div>
      </div>

      <CenterModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title={t.common.cancel}
        description={t.common.walletRequired}
      >
        <button
          className="h-11 rounded-md bg-gray-100 font-normal text-sm text-gray-600 hover:bg-gray-50 px-4"
          onClick={() => setWalletModalOpen(false)}
        >
          {t.common.back}
        </button>
        <button
          className="h-11 rounded-md bg-gray-600 font-normal text-sm text-white hover:opacity-90 px-4"
          onClick={async () => {
            setWalletModalOpen(false);
            router.push('/my-profile');
          }}
        >
          {t.common.walletButton}
        </button>
      </CenterModal>
    </>
  );
}
