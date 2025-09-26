'use client';

import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      // containerStyle={{
      //   marginBottom: '5.5rem',
      // }}
      toastOptions={{
        style: {
          background: '#737373',
          color: '#fff',
          borderRadius: '8px',
          height: '50px',
          width: '100%',
          padding: '0 16px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        },
      }}
    />
  );
}
