import { http } from '@/apis/httpClient';
import type {
  BaseResponse,
  ListOfKeyResponseVO,
  IssueSmartKeyRequest,
  IssueSmartKeyResponse,
  OpenKeyResponse,
} from './smartKey.types';

// 스마트키 발급 API
export const issueSmartKey = (body: IssueSmartKeyRequest) =>
  http.post<IssueSmartKeyResponse>('/api/v1/key/issue', body);

// 디지털 키 리스트 조회 API
export const fetchSmartKeyList = () =>
  http.get<BaseResponse<ListOfKeyResponseVO>>('/api/v1/key/list');

// 키 개방(OPEN) 명령 전송
export const openSmartKey = (keyId: number) =>
  http.post<OpenKeyResponse>(`/api/v1/key/${keyId}/open`);
