'use client';

export function useGoogleLogin() {
  return async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + '/oauth2/authorization/google';
    if (url) {
      window.location.assign(url);
    } else {
      alert('Sign in with Google');
    }
  };
}
