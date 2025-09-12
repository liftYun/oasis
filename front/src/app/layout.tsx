import type { Metadata, Viewport } from 'next';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import AppToaster from '@/components/molecules/AppToaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'oasis',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.ico' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'oasis',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-dvh flex flex-col">
        <AppToaster />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
