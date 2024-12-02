// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #27272a'
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#18181b'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#18181b'
                }
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}