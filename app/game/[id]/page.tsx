"use client";

import { useParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Client components'i dinamik olarak import ediyoruz
const Header = dynamic(() => import('../../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../../components/Footer'), { ssr: true });
const GameDetail = dynamic(() => import('../../components/GameDetail'), { ssr: false });

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  
  return (
    <main>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Header />
      </Suspense>
      <div className="container py-12">
        <GameDetail gameId={gameId} />
      </div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
} 