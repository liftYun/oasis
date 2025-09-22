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
