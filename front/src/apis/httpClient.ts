'use client';

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

type ApiEnvelope<T> = { code: number; message: string; body: T };

export class ApiError<T = unknown> extends Error {
  status?: number;
  data?: T;
  constructor(message: string, status?: number, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const isBrowser = () => typeof window !== 'undefined';
const getResult = <T>(res: AxiosResponse<ApiEnvelope<T>>) => res.data.body;

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  { retries = 2, base = 200 }: { retries?: number; base?: number } = {}
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status;
      const isNetErr = !status;
      const is5xx = status >= 500 && status < 600;
      if (attempt >= retries || (!isNetErr && !is5xx)) throw e;
      await new Promise((r) => setTimeout(r, base * Math.pow(2, attempt)));
      attempt++;
    }
  }
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
const waiters: Array<() => void> = [];

async function doRefresh(client: AxiosInstance): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      await client.post('/auth/refresh', null, { withCredentials: true });
    } finally {
      isRefreshing = false;
    }
  })();

  await refreshPromise;
  waiters.splice(0).forEach((w) => w());
}

class HttpClient {
  private client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      timeout: 8000,
      ...config,
    });
    this.setInterceptors();
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<ApiEnvelope<T>>(url, config).then(getResult);
  }
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return retryWithBackoff(() =>
      this.client.post<ApiEnvelope<T>>(url, data, config).then(getResult)
    );
  }
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return retryWithBackoff(() =>
      this.client.put<ApiEnvelope<T>>(url, data, config).then(getResult)
    );
  }
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return retryWithBackoff(() =>
      this.client.patch<ApiEnvelope<T>>(url, data, config).then(getResult)
    );
  }
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return retryWithBackoff(() => this.client.delete<ApiEnvelope<T>>(url, config).then(getResult));
  }

  private setInterceptors() {
    this.client.interceptors.response.use(
      (res) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[HTTP OK]', res.config.method?.toUpperCase(), res.config.url);
        }
        return res;
      },
      async (error: AxiosError) => {
        if (!isAxiosError(error) || !error.response) {
          return Promise.reject(new ApiError(error.message));
        }

        const { status } = error.response;
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (status === 401 && !original._retry) {
          original._retry = true;

          try {
            if (isRefreshing) {
              await new Promise<void>((resolve) => waiters.push(resolve));
            } else {
              await doRefresh(this.client);
            }
            return this.client.request(original);
          } catch {
            if (isBrowser()) window.location.href = '/';
          }
        }

        if (status === 500 && process.env.NODE_ENV !== 'development' && isBrowser()) {
          window.location.href = '/error';
        }

        const data: any = (error.response as AxiosResponse)?.data;
        const message =
          data?.message || data?.error || error.message || '요청 처리 중 오류가 발생했습니다.';
        return Promise.reject(new ApiError(message, status, data));
      }
    );
  }
}

export const http = new HttpClient();
export default HttpClient;
