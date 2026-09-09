import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { Navbar } from '../components/Navbar';
import { GlobalCartDrawer } from '../components/GlobalCartDrawer';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Boost D2C Store | High Converting Modern Streetwear',
  description: 'Built with BoostEngine 15 micro-packages, Next.js 15, and tailored Indian GST calculations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-black selection:text-white bg-white text-gray-900">
        <StoreProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <GlobalCartDrawer />
          <Footer />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
