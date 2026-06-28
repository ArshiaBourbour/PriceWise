import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import Providers from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'قیمت‌یار — مقایسه قیمت لحظه‌ای',
  description: 'مقایسه قیمت لحظه‌ای از ۵۰۰+ فروشگاه معتبر ایران. قیمت واقعی، بدون تبلیغ.',
  keywords: 'مقایسه قیمت, دیجی‌کالا, تکنولایف, ارزانترین قیمت, قیمت‌یار',
  openGraph: {
    title: 'قیمت‌یار',
    description: 'مقایسه قیمت لحظه‌ای از ۵۰۰+ فروشگاه ایران',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="bg-[#07070e] text-white/95 min-h-screen font-vazir antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-58px)]">{children}</main>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#181828',
                border: '1px solid rgba(255,255,255,0.16)',
                color: 'rgba(255,255,255,0.95)',
                fontFamily: 'Vazirmatn, Tahoma, sans-serif',
                direction: 'rtl',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
