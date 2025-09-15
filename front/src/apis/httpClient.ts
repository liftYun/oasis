'use client';

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
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

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
const waiters: Array<() => void> = [];

async function doRefresh(client: AxiosInstance): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const res = await client.post('/auth/refresh', null, { withCredentials: true });
      const newToken = res.headers['authorization']?.split(' ')[1];
      if (newToken) localStorage.setItem('accessToken', newToken);
      else throw new Error('No accessToken from refresh');
    } catch (e) {
      if (isBrowser()) {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
      throw e;
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
    return this.client.post<ApiEnvelope<T>>(url, data, config).then(getResult);
  }
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.put<ApiEnvelope<T>>(url, data, config).then(getResult);
  }
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.patch<ApiEnvelope<T>>(url, data, config).then(getResult);
  }
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<ApiEnvelope<T>>(url, config).then(getResult);
  }

  private setInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (isBrowser()) {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        if (!isAxiosError(error) || !error.response) {
          return Promise.reject(new ApiError(error.message));
        }

        const status = error.response.status;
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
            return Promise.reject(new ApiError('인증이 만료되었습니다.', 401));
          }
        }

        const data: any = error.response.data;
        const message = data?.message || error.message || '요청 처리 중 오류가 발생했습니다.';
        return Promise.reject(new ApiError(message, status, data));
      }
    );
  }
}

export const http = new HttpClient();
export default HttpClient;
