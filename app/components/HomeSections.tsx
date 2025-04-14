"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GameSection from "./GameSection";
import DiscountTimer from "./DiscountTimer";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";
import { 
  getPopularGames, 
  getMostDiscountedGames, 
  getLimitedTimeDeals, 
  getAnticipatedGames 
} from "../api";

// Polling süreleri (milisaniye cinsinden)
const POLLING_INTERVAL = 60 * 1000; // 1 dakika
const LIMITED_DEALS_POLLING_INTERVAL = 30 * 1000; // 30 saniye

export default function HomeSections() {
  // Platform filtresi için state
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  
  // Tüm platformlar
  const allPlatforms = ["Steam", "Epic Games", "GOG", "Origin", "Battle.net", "Humble Bundle"];
  
  // Platform filtresi toggle
  const togglePlatformFilter = (platform: string) => {
    setActivePlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  // React Query ile API'den veri çekmek - polling ekleyerek
  const { 
    data: popularGames, 
    isLoading: isLoadingPopular,
    error: popularError
  } = useQuery({
    queryKey: ['popularGames'],
    queryFn: getPopularGames,
    refetchInterval: POLLING_INTERVAL,
  });

  const { 
    data: mostDiscountedGames, 
    isLoading: isLoadingDiscounted,
    error: discountedError 
  } = useQuery({
    queryKey: ['mostDiscountedGames'],
    queryFn: getMostDiscountedGames,
    refetchInterval: POLLING_INTERVAL,
  });

  const { 
    data: limitedTimeDeals, 
    isLoading: isLoadingLimited,
    error: limitedError 
  } = useQuery({
    queryKey: ['limitedTimeDeals'],
    queryFn: getLimitedTimeDeals,
    refetchInterval: LIMITED_DEALS_POLLING_INTERVAL,
  });

  const { 
    data: anticipatedGames, 
    isLoading: isLoadingAnticipated,
    error: anticipatedError
  } = useQuery({
    queryKey: ['anticipatedGames'],
    queryFn: getAnticipatedGames,
    refetchInterval: POLLING_INTERVAL,
  });

  // Yükleme durumu
  const isLoading = isLoadingPopular || isLoadingDiscounted || isLoadingLimited || isLoadingAnticipated;
  const hasError = popularError || discountedError || limitedError || anticipatedError;

  if (isLoading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
        <p className="text-gray-400 mt-4">Oyun verileri yükleniyor...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container py-12">
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">Veri yüklenirken bir hata oluştu</h2>
          <p className="text-gray-400">
            Lütfen daha sonra tekrar deneyin veya sayfayı yenileyin.
          </p>
        </div>
      </div>
    );
  }

  // Platform renk stilleri
  const getPlatformStyle = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'steam':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'epic games':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'gog':
        return 'bg-rose-600 hover:bg-rose-700';
      case 'humble bundle':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'origin':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'battle.net':
        return 'bg-sky-600 hover:bg-sky-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="container">
      {/* Platform Filtreleri */}
      <div className="mb-8 pt-8">
        <h3 className="text-white text-lg font-medium mb-3">Platformları Filtrele</h3>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatformFilter(platform)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activePlatforms.includes(platform) 
                  ? `${getPlatformStyle(platform)} text-white` 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {platform}
            </button>
          ))}
          {activePlatforms.length > 0 && (
            <button
              onClick={() => setActivePlatforms([])}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>
      
      <GameSection 
        title="Tarihin En Çok İndirime Giren Oyunları" 
        subtitle="Tüm zamanların en popüler ve en çok indirime giren oyunlarını keşfedin. Bu fırsatları kaçırmayın!" 
        games={popularGames || []}
        viewAllLink="/popular"
        showDiscountTimer={true}
        filterPlatforms={activePlatforms.length > 0 ? activePlatforms : undefined}
      />
      
      <div className="border-t border-gray-800 my-4"></div>
      
      {/* Sınırlı Süreli İndirimler Bölümü */}
      <section className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Kaçırılmayacak Sınırlı Süreli İndirimler</h2>
            <p className="text-gray-400 max-w-2xl">Bu indirimler çok yakında sona eriyor! Zamanlayıcı geri sayıma göz atın ve fırsatları kaçırmayın.</p>
          </div>
          
          <Link 
            href="/limited-time-deals" 
            className="mt-4 md:mt-0 text-accent hover:text-accent/80 font-medium flex items-center transition-colors"
            tabIndex={0}
          >
            Tümünü Gör
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(limitedTimeDeals || [])
            .filter(game => activePlatforms.length === 0 || activePlatforms.includes(game.originPlatform || 'Steam'))
            .map((game) => (
            <div key={game.id} className="card overflow-hidden transition-transform hover:scale-[1.02] focus-within:scale-[1.02]">
              <div className="relative w-full h-48">
                <Image 
                  src={game.image || 'https://placehold.co/400x600?text=No+Image'}
                  alt={game.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-xl"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded-md">
                  -%{Math.round(game.discountPercent || 0)}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white font-semibold line-clamp-1 mb-1">{game.title}</h3>
                  <DiscountTimer endDate={game.discountEndDate || new Date().toISOString()} compactView={true} />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 line-through text-sm">
                      ${game.originalPrice?.toFixed(2) || (59.99).toFixed(2)}
                    </span>
                    <span className="text-white font-bold">
                      ${game.currentPrice?.toFixed(2) || ((59.99 * (1 - (game.discountPercent || 0) / 100)).toFixed(2))}
                    </span>
                  </div>
                  
                  {/* En iyi indirim platformu göstergesini varsa */}
                  <div className="flex items-center space-x-1">
                    {/* Ana platform */}
                    <div className={`py-1 px-2 rounded text-xs font-medium ${
                      game.originPlatform === 'Steam' ? 'bg-blue-600/80' : 
                      game.originPlatform === 'Epic Games' ? 'bg-purple-600/80' : 
                      game.originPlatform === 'GOG' ? 'bg-rose-600/80' : 
                      game.originPlatform === 'Origin' ? 'bg-orange-500/80' :
                      game.originPlatform === 'Battle.net' ? 'bg-sky-600/80' :
                      'bg-gray-600/80'
                    }`}>
                      {game.originPlatform || 'Steam'}
                    </div>
                  </div>
                </div>
                
                {/* İndirim yapan platform - Ana platformdan farklı ise göster */}
                {game.discountPlatform && game.discountPlatform !== game.originPlatform && (
                  <div className="mb-2 flex items-center">
                    <span className="text-xs text-gray-400 mr-2">En iyi fiyat:</span>
                    <span className={`text-xs py-1 px-2 rounded font-medium ${
                      game.discountPlatform === 'Steam' ? 'bg-blue-600/80' : 
                      game.discountPlatform === 'Epic Games' ? 'bg-purple-600/80' : 
                      game.discountPlatform === 'GOG' ? 'bg-rose-600/80' : 
                      game.discountPlatform === 'Origin' ? 'bg-orange-500/80' :
                      game.discountPlatform === 'Battle.net' ? 'bg-sky-600/80' :
                      game.discountPlatform === 'GreenManGaming' ? 'bg-green-600/80' :
                      game.discountPlatform === 'Humble Bundle' ? 'bg-orange-600/80' :
                      game.discountPlatform === 'Fanatical' ? 'bg-yellow-600/80' :
                      'bg-gray-600/80'
                    }`}>
                      {game.discountPlatform}
                    </span>
                  </div>
                )}
                
                {/* Tüm platformların fiyatlarını göster */}
                {game.allPlatformPrices && game.allPlatformPrices.length > 0 && (
                  <div className="mt-2 mb-3">
                    <span className="text-xs text-gray-400 block mb-1">Diğer platformlarda:</span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1 scrollbar-thin">
                      {game.allPlatformPrices
                        .filter(price => price.platform !== game.discountPlatform) // En iyi fiyat platformunu filtrele
                        .sort((a, b) => a.currentPrice - b.currentPrice) // Fiyata göre sırala
                        .map((price, idx) => {
                          const discount = Math.round(((price.originalPrice - price.currentPrice) / price.originalPrice) * 100);
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className={`${
                                price.platform === 'Steam' ? 'text-blue-400' : 
                                price.platform === 'Epic Games' ? 'text-purple-400' : 
                                price.platform === 'GOG' ? 'text-rose-400' : 
                                price.platform === 'Humble Bundle' ? 'text-orange-400' :
                                price.platform === 'GreenManGaming' ? 'text-green-400' :
                                'text-gray-400'
                              }`}>
                                {price.platform}
                              </span>
                              <div className="flex items-center">
                                <span className="text-white mr-2">${price.currentPrice.toFixed(2)}</span>
                                <span className="text-gray-500 line-through mr-1">${price.originalPrice.toFixed(2)}</span>
                                <span className="text-gray-400">({discount}%)</span>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/game/${game.id}`} 
                  className="btn btn-primary w-full text-center py-2 rounded-md block"
                  tabIndex={0}
                >
                  Detaylara Git
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <div className="border-t border-gray-800 my-4"></div>
      
      <GameSection 
        title="En Büyük İndirimler" 
        subtitle="En yüksek indirim oranlarına sahip oyunlar burada. Bütçenizi zorlamadan harika oyunlara sahip olun." 
        games={mostDiscountedGames || []}
        viewAllLink="/discounts"
        showDiscountTimer={true}
        filterPlatforms={activePlatforms.length > 0 ? activePlatforms : undefined}
      />
      
      <div className="border-t border-gray-800 my-4"></div>
      
      <GameSection 
        title="En Çok Beklenen Oyunlar" 
        subtitle="Merakla beklenen yeni oyunlardaki ön sipariş indirimleri ve fırsatları yakalayın." 
        games={anticipatedGames || []}
        viewAllLink="/anticipated"
        showDiscountTimer={true}
        filterPlatforms={activePlatforms.length > 0 ? activePlatforms : undefined}
      />
    </div>
  );
} 