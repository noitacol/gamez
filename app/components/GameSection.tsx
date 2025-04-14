"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GameBasic } from "../types";
import DiscountTimer from "./DiscountTimer";

interface GameSectionProps {
  title: string;
  subtitle: string;
  games: GameBasic[];
  viewAllLink?: string;
  showDiscountTimer?: boolean;
  filterPlatforms?: string[]; // Gösterilecek olan platformlar
}

export default function GameSection({ 
  title, 
  subtitle, 
  games, 
  viewAllLink,
  showDiscountTimer = false,
  filterPlatforms
}: GameSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Platform filtreleme
  const filteredGames = filterPlatforms 
    ? games.filter(game => filterPlatforms.includes(game.originPlatform || 'Steam'))
    : games;

  // Demo için her oyuna geçici fiyatlar ekliyoruz
  const getPrice = (game: GameBasic) => {
    if (!game.discountPercent) return { original: null, current: null };

    // Eğer oyunun fiyatları API'den gelmişse, doğrudan kullan
    if (game.originalPrice && game.currentPrice) {
      return {
        original: `$${game.originalPrice.toFixed(2)}`,
        current: `$${game.currentPrice.toFixed(2)}`
      };
    }
    
    // Yoksa varsayılan fiyatlar üzerinden hesapla
    const originalPrice = 59.99;
    const currentPrice = originalPrice * (1 - game.discountPercent / 100);
    
    return {
      original: `$${originalPrice.toFixed(2)}`,
      current: `$${currentPrice.toFixed(2)}`
    };
  };

  // Platform renk ve ikon atamaları
  const getPlatformStyleByName = (platformName?: string) => {
    const defaultStyle = { bg: 'bg-gray-600/80', text: 'text-white' };
    
    if (!platformName) return defaultStyle;
    
    switch (platformName.toLowerCase()) {
      case 'steam':
        return { bg: 'bg-blue-600/80', text: 'text-white' };
      case 'epic games':
        return { bg: 'bg-purple-600/80', text: 'text-white' };
      case 'gog':
        return { bg: 'bg-rose-600/80', text: 'text-white' };
      case 'humble bundle':
        return { bg: 'bg-orange-600/80', text: 'text-white' };
      case 'greenmangeming':
        return { bg: 'bg-green-600/80', text: 'text-white' };
      case 'fanatical':
        return { bg: 'bg-yellow-600/80', text: 'text-black' };
      case 'origin':
        return { bg: 'bg-orange-500/80', text: 'text-white' };
      case 'battle.net':
        return { bg: 'bg-sky-600/80', text: 'text-white' };
      default:
        return defaultStyle;
    }
  };

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 max-w-2xl">{subtitle}</p>
        </div>
        
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="mt-4 md:mt-0 text-accent hover:text-accent/80 font-medium flex items-center transition-colors"
            tabIndex={0}
          >
            Tümünü Gör
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredGames.map((game, index) => {
          const prices = getPrice(game);
          const originPlatformStyle = getPlatformStyleByName(game.originPlatform);
          const discountPlatformStyle = getPlatformStyleByName(game.discountPlatform);
          
          return (
            <Link 
              key={game.id}
              href={`/game/${game.id}`}
              className="group relative block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={0}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-secondary/50 mb-3">
                <Image
                  src={game.image || 'https://placehold.co/400x600?text=No+Image'}
                  alt={game.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className={`rounded-lg transform transition-transform duration-500 ${
                    hoveredIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
                
                {game.discountPercent && (
                  <div className="absolute top-3 left-3 bg-accent text-secondary text-sm font-bold px-2 py-1 rounded">
                    -%{Math.round(game.discountPercent)}
                  </div>
                )}
                
                {/* Oyunun ana platform göstergesi */}
                <div className="absolute top-3 right-3">
                  <div className={`py-1 px-2 rounded text-xs font-medium ${originPlatformStyle.bg} ${originPlatformStyle.text}`}>
                    {game.originPlatform || 'Steam'}
                  </div>
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="w-full">
                    {prices.original && prices.current && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 line-through text-sm">{prices.original}</span>
                        <span className="text-white font-bold text-lg">{prices.current}</span>
                      </div>
                    )}
                    
                    {/* İndirim platformu göstergesi */}
                    {game.discountPlatform && game.discountPlatform !== game.originPlatform && (
                      <div className="flex items-center mb-2">
                        <span className="text-xs text-white mr-2">En iyi fiyat:</span>
                        <span className={`text-xs font-medium py-1 px-2 rounded ${discountPlatformStyle.bg} ${discountPlatformStyle.text}`}>
                          {game.discountPlatform}
                        </span>
                      </div>
                    )}
                    
                    {/* İndirim sayacı */}
                    {showDiscountTimer && game.discountEndDate && (
                      <DiscountTimer endDate={game.discountEndDate} className="mt-2" />
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="text-white font-medium line-clamp-2 group-hover:text-accent transition-colors">
                {game.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}