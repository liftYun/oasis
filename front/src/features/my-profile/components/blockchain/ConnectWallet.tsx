'use client';

import { useRef, useState } from 'react';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import type { SdkInitData, WalletSnapshot, BackendInitData } from './types';
import { getToken, hasValidToken, decodeToken } from './jwt';
import { toast } from 'react-hot-toast';
import { useSdkStore } from '@/stores/useSdkStores';

interface ConnectWalletProps {
  onConnectSuccess: (address: string, sdkInitData: SdkInitData) => void;
}

interface JwtPayload {
  user_uuid?: string;
  userUuid?: string;
  sub?: string;
  uuid?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

const getUserUuidFromToken = (): string | null => {
  // if (!hasValidToken()) return null;
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const payload = decoded as JwtPayload;
  return payload.user_uuid || payload.userUuid || payload.sub || payload.uuid || null;
};

export default function ConnectWallet({ onConnectSuccess }: ConnectWalletProps) {
  const [status, setStatus] = useState<string>('연결되지 않음');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<WalletSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sdkRef = useRef<W3SSdk | null>(null);
  const lastInitRef = useRef<SdkInitData | null>(null);

  const shorten = (addr?: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '-');
  const { setSdkInitData } = useSdkStore();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('주소가 클립보드에 복사되었습니다.');
      //   setStatus('주소가 클립보드에 복사되었습니다.');
    } catch {
      toast.error('복사 실패: 브라우저 권한을 확인하세요.');
      //   setStatus('복사 실패: 브라우저 권한을 확인하세요.');
    }
  };

  async function handleConnect() {
    setIsLoading(true);
    setError(null);
    // setStatus('사용자 세션 초기화 중...');

    try {
      const userUuid = getUserUuidFromToken();
      if (!userUuid) {
        throw new Error('유효한 JWT 토큰이 없습니다. 먼저 로그인해 주세요.');
      }

      const token = getToken();
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wallet/init-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`init-session 실패: HTTP ${resp.status} - ${text}`);
      }

      const raw = await resp.json();
      const backendData: BackendInitData = raw.result;
      setSdkInitData(backendData);

      if (!backendData.appId || !backendData.userToken || !backendData.encryptionKey) {
        throw new Error('init-session 응답에 필수값(appId/userToken/encryptionKey)이 없습니다.');
      }

      lastInitRef.current = backendData;

      if (!sdkRef.current) sdkRef.current = new W3SSdk();
      const sdk = sdkRef.current;

      sdk.setAppSettings({ appId: backendData.appId });
      sdk.setAuthentication({
        userToken: backendData.userToken,
        encryptionKey: backendData.encryptionKey,
      });

      // 신규/기존 분기
      if (backendData.challengeId) {
        // 신규 사용자: PIN 설정 필요
        // setStatus('최초 사용자입니다. PIN 설정 화면을 실행합니다...');
        toast.success('최초 사용자입니다. PIN 설정 화면을 실행하겠습니다.');
        sdk.execute(backendData.challengeId, async (error, result) => {
          if (error) {
            setError(error.message);
            // setStatus('PIN 설정 중 오류가 발생했습니다.');
            toast.error('PIN 설정 중 오류가 발생했습니다.');
            setIsLoading(false);
            return;
          }
          if (result) {
            // setStatus('PIN 설정 완료! 지갑 정보를 불러옵니다...');
            toast.success('PIN 설정 완료! 지갑 정보를 불러옵니다.');
            // PIN 설정 후 최신 스냅샷 조회
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wallet/snapshot`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            });
            await refreshSnapshotAndNotify(backendData);
          }
        });
      } else {
        // 기존 사용자: init-session 응답의 스냅샷을 즉시 활용
        const snap: WalletSnapshot = {
          primaryWallet: backendData.primaryWallet ?? null,
          wallets: backendData.wallets ?? [],
          balances: backendData.balances ?? {},
        };
        setSnapshot(snap);

        const addr = snap.primaryWallet?.address;
        if (addr) {
          onConnectSuccess(addr, backendData);
          setStatus('지갑이 성공적으로 준비되었습니다.');
        } else {
          await refreshSnapshotAndNotify(backendData);
        }
        setIsLoading(false);
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus('연결 실패');
      setIsLoading(false);
    }
  }

  async function reloadSnapshot() {
    const initData = lastInitRef.current;
    if (!initData) {
      await handleConnect();
      return;
    }
    try {
      setIsLoading(true);
      setStatus('스냅샷 새로고침 중...');
      await refreshSnapshotAndNotify(initData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  // 최신 스냅샷을 가져와 UI/부모상태를 갱신
  async function refreshSnapshotAndNotify(initData: SdkInitData) {
    try {
      const token = getToken();

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/wallet/init-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`GET /wallets 실패: HTTP ${resp.status} - ${text}`);
      }
      const raw = await resp.json();
      const data: WalletSnapshot = raw.result ?? raw;
      setSnapshot(data);

      const address = data?.primaryWallet?.address;
      if (!address) {
        setStatus('지갑이 아직 없습니다. 먼저 지갑을 생성해 주세요.');
        setIsLoading(false);
        return;
      }

      onConnectSuccess(address, initData);
      setStatus('지갑이 성공적으로 준비되었습니다.');
      setIsLoading(false);
    } catch (e) {
      setError((e as Error).message);
      setStatus('지갑 정보를 가져오는 데 실패했습니다.');
      setIsLoading(false);
    }
  }

  const primary = snapshot?.primaryWallet;
  const usdc = snapshot?.balances?.USDC;

  return (
    <div
      className="w-full max-w-sm rounded-md p-5 mb-8"
      style={{ background: 'linear-gradient(to right, #dbeafe, #e0f2f1)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">지갑 연결</h2>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isLoading
              ? 'bg-gray-100 text-gray-600'
              : error
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
          }`}
          title={status}
        >
          {isLoading ? '로딩 중' : error ? '에러' : '정상'}
        </span>
      </div>

      {/* 상태 메시지 */}
      <p className={`mt-2 text-sm ${error ? 'text-red-700' : 'text-gray-700'}`}>
        <b>상태:</b> {status} {error && <span>— {error}</span>}
      </p>

      {/* 버튼 */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-blue-700 bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? '준비 중...' : '지갑 준비'}
        </button>
        <button
          onClick={reloadSnapshot}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium disabled:opacity-50"
        >
          새로고침
        </button>
      </div>

      {/* Snapshot */}
      {primary && (
        <div className="mt-4 p-3 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          {/* 대표 지갑 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-600 w-24">대표 지갑</span>
            <div className="flex items-center gap-2 font-mono text-sm text-gray-800">
              <code>{shorten(primary.address)}</code>
              <button
                onClick={() => copy(primary.address)}
                className="text-blue-600 hover:underline text-xs"
              >
                복사
              </button>
              <a
                href={`https://amoy.polygonscan.com/address/${primary.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-xs"
              >
                Polygonscan
              </a>
            </div>
          </div>

          {/* 체인 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-600 w-24">체인</span>
            <span className="text-xs">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {primary.blockchain ?? 'N/A'}
              </span>
            </span>
          </div>

          {/* USDC 잔액 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-600 w-24">USDC 잔액</span>
            <span className="text-sm text-gray-800">
              {usdc !== undefined ? `${usdc} USDC` : '조회 불가'}
            </span>
          </div>

          {/* 지갑 수 */}
          {snapshot?.wallets?.length ? (
            <div className="mt-2 text-xs text-gray-500">지갑 수: {snapshot.wallets.length}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
