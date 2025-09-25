'use client';

// Circle SDK 최소 인터페이스 (정적 import 방지용)
export type CircleSdk = {
  execute: (challengeId: string, cb: (error?: unknown) => void) => void;
  setAppSettings: (args: { appId: string }) => void;
  setAuthentication: (args: { userToken: string; encryptionKey: string }) => void;
};

type W3SSdkCtor = new () => CircleSdk;

let sdkClassPromise: Promise<W3SSdkCtor> | null = null;
let sdkInstance: CircleSdk | null = null;

function loadW3SSdkClass(): Promise<W3SSdkCtor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('W3SSdk는 브라우저 환경에서만 사용 가능합니다.'));
  }
  if (!sdkClassPromise) {
    sdkClassPromise = import('@circle-fin/w3s-pw-web-sdk')
      .then((m) => m.W3SSdk as unknown as W3SSdkCtor)
      .catch((err) => {
        // 로드 실패 시 재시도 가능하도록 캐시 해제
        sdkClassPromise = null;
        throw err;
      });
  }
  return sdkClassPromise;
}

// 사전 로드: 호출 시점에 비동기 로드를 시작만 함
export function preloadW3SSdk(): void {
  void loadW3SSdkClass();
}

// SDK 클래스 취득 (로드 완료까지 대기)
export async function getW3SSdkClass(): Promise<W3SSdkCtor> {
  return await loadW3SSdkClass();
}

// 싱글턴 인스턴스 반환 (없으면 생성)
export async function getW3SSdk(): Promise<CircleSdk> {
  const Ctor = await loadW3SSdkClass();
  if (!sdkInstance) {
    sdkInstance = new Ctor();
  }
  return sdkInstance;
}

// 인스턴스 구성까지 한 번에 수행
export async function initW3SSdk(args: {
  appId: string;
  userToken: string;
  encryptionKey: string;
}): Promise<CircleSdk> {
  const sdk = await getW3SSdk();
  sdk.setAppSettings({ appId: args.appId });
  sdk.setAuthentication({ userToken: args.userToken, encryptionKey: args.encryptionKey });
  return sdk;
}

// 로드 시작 여부(완료 여부 아님) 확인용
export function isW3SSdkLoadStarted(): boolean {
  return sdkClassPromise !== null;
}

// 테스트/디버깅용 리셋
export function __resetW3SSdkForTest(): void {
  sdkClassPromise = null;
  sdkInstance = null;
}
