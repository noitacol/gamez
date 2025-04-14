"use client";

import { useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Client components'i dinamik olarak import ediyoruz
const Header = dynamic(() => import('../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer'), { ssr: true });
const SearchResults = dynamic(() => import('../components/SearchResults'), { ssr: false });

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  return (
    <main>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Header />
      </Suspense>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          &quot;{query}&quot; için Arama Sonuçları
        </h1>
        
        <SearchResults query={query} />
      </div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
} 