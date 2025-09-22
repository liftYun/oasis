import { useAuthStore } from '@/stores/useAuthStores';
import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  const token = useAuthStore.getState().accessToken;
  return token ?? null;
};

export const hasValidToken = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = decodeToken(token);
    if (payload?.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const decodeToken = (token: string) => {
  return jwtDecode(token);
  // try {
  //   return JSON.parse(atob(token.split('.')[1]));
  // } catch {
  //   return null;
  // }
};
