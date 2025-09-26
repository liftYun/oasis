export interface SdkInitData {
  appId: string;
  userToken: string;
  encryptionKey: string;
  walletId: string;
}

export interface WalletInfo {
  id: string;
  address: string;
  blockchain: string;
}

export interface WalletSnapshot {
  primaryWallet: WalletInfo | null;
  wallets: WalletInfo[];
  balances: Record<string, string>;
}

export interface BackendInitData {
  challengeId?: string | null;
  primaryWallet?: WalletInfo | null;
  wallets?: WalletInfo[];
  balances?: Record<string, string>;
}

export interface BackendInitData extends SdkInitData {
  challengeId?: string | null;
  primaryWallet?: WalletInfo | null;
  wallets?: WalletInfo[];
  balances?: Record<string, string>;
}

export type ChallengeResp =
  | { challengeId: string }
  | { challengeIds: string[] }
  | { steps: Array<{ challengeId: string; label?: string }> };

export type BaseResponse<T> = {
  httpStatus: number;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
};
