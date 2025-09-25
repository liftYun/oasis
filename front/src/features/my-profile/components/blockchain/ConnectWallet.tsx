'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import type { SdkInitData, WalletSnapshot, BackendInitData } from './types';
import { getToken, decodeToken } from './jwt';
import { toast } from 'react-hot-toast';
import { useSdkStore } from '@/stores/useSdkStores';
import { RefreshCw } from 'lucide-react';
import Usdc from '@/assets/icons/usd-circle.png';
import Polygon from '@/assets/logos/polygon-logo.png';
import { useLanguage } from '@/features/language/hooks/useLanguage';
import { walletMessages } from './locale';

type WalletStatusKey =
  | 'notConnected'
  | 'loading'
  | 'error'
  | 'success'
  | 'noWallet'
  | 'snapshotError';

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
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const payload = decoded as JwtPayload;
  return payload.user_uuid || payload.userUuid || payload.sub || payload.uuid || null;
};

export default function ConnectWallet({ onConnectSuccess }: ConnectWalletProps) {
  const { lang } = useLanguage();
  const t = walletMessages[lang];

  const [status, setStatus] = useState<WalletStatusKey>('notConnected');
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
      toast.success(t.copySuccess);
    } catch {
      toast.error(t.copyFailed);
    }
  };

  async function handleConnect() {
    setIsLoading(true);
    setError(null);

    try {
      const userUuid = getUserUuidFromToken();
      if (!userUuid) {
        throw new Error(t.noJwtToken);
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
        throw new Error(`${t.initSessionFailed}: HTTP ${resp.status} - ${text}`);
      }

      const raw = await resp.json();
      const backendData: BackendInitData = raw.result;
      setSdkInitData(backendData);

      if (!backendData.appId || !backendData.userToken || !backendData.encryptionKey) {
        throw new Error(t.missingRequiredValues);
      }

      lastInitRef.current = backendData;

      if (!sdkRef.current) sdkRef.current = new W3SSdk();
      const sdk = sdkRef.current;

      sdk.setAppSettings({ appId: backendData.appId });
      sdk.setAuthentication({
        userToken: backendData.userToken,
        encryptionKey: backendData.encryptionKey,
      });

      if (backendData.challengeId) {
        toast.success(t.pinSetupRequired);
        sdk.execute(backendData.challengeId, async (error, result) => {
          if (error) {
            setError(error.message);
            toast.error(t.pinSetupFailed);
            setIsLoading(false);
            return;
          }
          if (result) {
            toast.success(t.pinSetupComplete);
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
        const snap: WalletSnapshot = {
          primaryWallet: backendData.primaryWallet ?? null,
          wallets: backendData.wallets ?? [],
          balances: backendData.balances ?? {},
        };
        setSnapshot(snap);

        const addr = snap.primaryWallet?.address;
        if (addr) {
          onConnectSuccess(addr, backendData);
          setStatus('success');
        } else {
          await refreshSnapshotAndNotify(backendData);
        }
        setIsLoading(false);
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
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
      setStatus('loading');
      await refreshSnapshotAndNotify(initData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

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
        throw new Error(`${t.getWalletsFailed}: HTTP ${resp.status} - ${text}`);
      }
      const raw = await resp.json();
      const data: WalletSnapshot = raw.result ?? raw;
      setSnapshot(data);

      const address = data?.primaryWallet?.address;
      if (!address) {
        setStatus('noWallet');
        setIsLoading(false);
        return;
      }

      onConnectSuccess(address, initData);
      setStatus('success');
      setIsLoading(false);
    } catch (e) {
      setError((e as Error).message);
      setStatus('snapshotError');
      setIsLoading(false);
    }
  }

  const primary = snapshot?.primaryWallet;
  const usdc = snapshot?.balances?.USDC;

  return (
    <div className="w-full max-w-sm rounded-2xl p-6 mt-6 bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={Usdc} alt="USDC" width={18} height={18} className="rounded-full" />
          <h2 className="text-base font-bold text-gray-600">{t.title}</h2>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-3 px-2.5 py-0.5 text-xs font-medium rounded-full
  backdrop-blur-md bg-white/30 border border-white/20 shadow-sm transition-colors`}
          title={
            isLoading
              ? t.loading
              : error
                ? `${t.error} — ${error}`
                : status === 'success'
                  ? t.statusSuccess
                  : status === 'notConnected'
                    ? t.statusNotConnected
                    : status
          }
        >
          {isLoading && <span className="w-2 h-2 rounded-full bg-green animate-pulse" />}
          {error && <span className="w-2 h-2 rounded-full bg-red" />}
          {!isLoading && !error && <span className="w-2 h-2 rounded-full bg-gray-400" />}

          {isLoading
            ? t.loading
            : error
              ? t.error
              : status === 'success'
                ? t.statusSuccess
                : status === 'notConnected'
                  ? t.statusNotConnected
                  : status}
        </span>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="flex-1 py-2 rounded-full bg-white flex items-center justify-center transition hover:shadow-md disabled:opacity-50"
        >
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#3B87F4] to-[#88D4AF]">
            {isLoading ? t.loading : t.connect}
          </span>
        </button>
        <button
          onClick={reloadSnapshot}
          disabled={isLoading}
          className="h-11 w-11 rounded-full backdrop-blur-md bg-white/40 border border-white/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="새로고침"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {primary && (
        <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col gap-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 w-24">{t.primaryWallet}</span>
              <div className="flex items-center gap-2 text-xs text-gray-800">
                <code className="truncate max-w-[120px]">{shorten(primary.address)}</code>
                <button
                  onClick={() => copy(primary.address)}
                  className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700"
                >
                  {t.copy}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href={`https://amoy.polygonscan.com/address/${primary.address}`}
                target="_blank"
                rel="noreferrer"
                className="relative group inline-flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-700 transition"
              >
                <Image src={Polygon} alt="Polygonscan" width={14} height={14} />
                <span>Polygonscan</span>

                <span
                  className="absolute top-full mt-1 left-1/2 -translate-x-1/2 
           whitespace-nowrap rounded-md bg-black/70 px-3 py-1 
           text-[10px] text-white shadow-md font-light
           opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Polygonscan에서 지갑 주소 보기
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-medium text-gray-500 w-24">{t.chain}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {primary.blockchain ?? 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-medium text-gray-500 w-24">{t.usdcBalance}</span>
            <span className="text-sm font-semibold text-gray-800">
              {usdc !== undefined ? `${usdc} USDC` : '조회 불가'}
            </span>
          </div>

          {snapshot?.wallets?.length ? (
            <div className="mt-2 text-xs text-gray-500">
              {t.walletCount}: {snapshot.wallets.length}
            </div>
          ) : null}

          <div className="mt-8">
            <button
              onClick={() => console.log('지갑 충전하기')}
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-green text-white font-medium text-sm shadow hover:opacity-90 active:scale-95 transition"
            >
              {t.topupWallet ?? '지갑 충전하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
