import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: "Lo'shon",
  description: 'Just workspace',
  icons: [
    {
      media: '(prefer-color-scheme: system)',
      url: '/favicon.ico',
      href: '/favicon.ico',
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
    <html lang='en'>
      <body className={`antialiased ${poppins.className}`}>
        <ThemeProvider attribute='class' defaultTheme='light'>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
