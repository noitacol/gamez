import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Client components'i dinamik olarak import ediyoruz
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer'), { ssr: true });
const ShopsList = dynamic(() => import('../components/ShopsList'), { ssr: false });

export default function ShopsPage() {
  return (
    <main>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Header />
      </Suspense>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          Mağazalar
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-400 max-w-3xl">
            Aşağıdaki mağazalardaki fiyatları karşılaştırabilir ve en uygun fiyatlı oyunları bulabilirsiniz.
            Geniş mağaza ağı sayesinde farklı platformlardaki indirimleri takip edebilirsiniz.
          </p>
        </div>
        
        <ShopsList />
      </div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
} 