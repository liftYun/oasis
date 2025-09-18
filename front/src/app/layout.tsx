import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import AppToaster from '@/components/molecules/AppToaster';
import { ClientLayout } from './ClientLayout';
import InstallPrompt from '@/components/organisms/InstallPrompt';
import AuthBootstrap from './_components/AuthBootstrap';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-dvh border-x border-gray-100 ">
        <AppToaster />
        <ReactQueryProvider>
          <InstallPrompt />
          <AuthBootstrap />
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
