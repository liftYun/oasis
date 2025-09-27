export interface ChargeRequest {
  payment: number; // 충전 금액 (USDC 단위)
}

export interface ChargeResponse {
  code: number;
  message: string;
  result: {
    txHash: string;
    usdc: number;
  };
}
