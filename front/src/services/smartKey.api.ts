import { http } from '@/apis/httpClient';
import type { IssueSmartKeyRequest, IssueSmartKeyResponse } from './smartKey.types';

// 스마트키 발급 API
export const issueSmartKey = (body: IssueSmartKeyRequest) =>
  http.post<IssueSmartKeyResponse>('/api/v1/key/issue', body);
