import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import { ThemeProvider } from '../components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';

import './globals.css';

export const metadata: Metadata = {
  title: "Lo'shon",
  description: 'Just workspace',
  icons: [
    {
      media: '(prefers-color-scheme: dark)',
      url: '/favicon_light.ico',
      href: '/favicon_light.ico',
    },
    {
      media: '(prefers-color-scheme: light)',
      url: '/favicon_dark.ico',
      href: '/favicon_dark.ico',
    },
  ],
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '500',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${poppins.className}`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <Toaster position='top-center' closeButton />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
