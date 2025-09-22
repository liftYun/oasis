'use client';

import { useRef, useState } from 'react';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import type { SdkInitData } from './types';
import { getToken, hasValidToken, decodeToken } from './jwt';

type WalletInfo = { id: string; address: string; blockchain: string };
type WalletSnapshot = {
  primaryWallet: WalletInfo | null;
  wallets: WalletInfo[];
  balances: Record<string, string>;
};

interface ConnectWalletProps {
  onConnectSuccess: (address: string, sdkInitData: SdkInitData) => void;
}

interface BackendInitData extends SdkInitData {
  challengeId?: string | null;
  primaryWallet?: WalletInfo | null;
  wallets?: WalletInfo[];
  balances?: Record<string, string>;
}

const getUserUuidFromToken = (): string | null => {
  if (!hasValidToken()) return null;
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.user_uuid || decoded?.userUuid || decoded?.sub || decoded?.uuid || null;
};

export default function ConnectWallet({ onConnectSuccess }: ConnectWalletProps) {
  const [status, setStatus] = useState<string>('연결되지 않음');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<WalletSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sdkRef = useRef<W3SSdk | null>(null);
  const lastInitRef = useRef<SdkInitData | null>(null);

  const shorten = (addr?: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '-');

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('주소가 클립보드에 복사되었습니다.');
    } catch {
      setStatus('복사 실패: 브라우저 권한을 확인하세요.');
    }
  };

  // 🔹 handleConnect, reloadSnapshot, refreshSnapshotAndNotify는 그대로 유지
  // (코드 길어서 생략, 기존 로직 그대로 붙여 쓰시면 됩니다)

  const primary = snapshot?.primaryWallet;
  const usdc = snapshot?.balances?.USDC;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      {/* Header */}
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
          //   onClick={handleConnect}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-blue-700 bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? '준비 중...' : '지갑 준비'}
        </button>
        <button
          //   onClick={reloadSnapshot}
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
