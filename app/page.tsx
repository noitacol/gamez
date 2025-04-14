import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Client components'i dinamik olarak import ediyoruz
const Header = dynamic(() => import('./components/Header'), { ssr: true });
const Footer = dynamic(() => import('./components/Footer'), { ssr: true });
const Slider = dynamic(() => import('./components/Slider'), { ssr: false });
const HomeSections = dynamic(() => import('./components/HomeSections'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 bg-secondary">Yükleniyor...</div>}>
        <Header />
      </Suspense>
      
      <Suspense fallback={<div className="h-[50vh] bg-background flex items-center justify-center">Slider Yükleniyor...</div>}>
        <Slider />
      </Suspense>
      
      <div className="flex-grow py-4">
        <Suspense fallback={<div className="container py-12">Oyun Bölümleri Yükleniyor...</div>}>
          <HomeSections />
        </Suspense>
      </div>
      
      <Suspense fallback={<div className="h-64 bg-secondary">Yükleniyor...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
} 