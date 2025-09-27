import { http } from '@/apis/httpClient';
import type { ChargeRequest, ChargeResponse } from './blockchain.types';

// USDC 충전 요청
export const chargeUSDC = async (data: ChargeRequest) => {
  const res = await http.post<ChargeResponse>('/api/v1/charging', data);
  return res;
};
