import type { Metadata } from 'next';
import './globals.scss';
import Navbar from '@/components/Navbar';
import { Comfortaa } from 'next/font/google';
import Footer from '@/components/Footer';
import GlobalToast from '@/components/GlobalToast';
import { getMessages } from 'next-intl/server';
import IntlProvider from '@/components/IntlProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-comfortaa',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WearIt',
  description: 'Urban clothing e-commerce site',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={comfortaa.className}>
        <script dangerouslySetInnerHTML={{ __html: `if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');` }} />
        <ThemeProvider>
          <IntlProvider initialLocale="en" initialMessages={messages}>
            <AuthProvider>
              <main className="h-full flex flex-col">
                <Navbar />
                <div className="flex-grow">{children}</div>
                <Footer />
                <GlobalToast />
              </main>
            </AuthProvider>
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
