"use client";

import { useQuery } from "@tanstack/react-query";
import { getGameInfo, getGamePrices, getGameHistoricalLow } from "../api";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

interface GameDetailProps {
  gameId: string;
}

export default function GameDetail({ gameId }: GameDetailProps) {
  // Oyun bilgilerini getir
  const { data: gameInfo, isLoading: isLoadingInfo, error: infoError } = useQuery({
    queryKey: ["gameInfo", gameId],
    queryFn: () => getGameInfo(gameId),
    refetchInterval: 5 * 60 * 1000, // 5 dakikada bir yenile
  });
  
  // Oyun fiyatlarını getir
  const { data: gamePrices, isLoading: isLoadingPrices, error: pricesError } = useQuery({
    queryKey: ["gamePrices", gameId],
    queryFn: () => getGamePrices(gameId),
    refetchInterval: 2 * 60 * 1000, // 2 dakikada bir yenile (fiyatlar daha sık güncellenmeli)
  });
  
  // Oyunun tarihi en düşük fiyatını getir
  const { data: historicalLow, isLoading: isLoadingHistorical, error: historicalError } = useQuery({
    queryKey: ["gameHistoricalLow", gameId],
    queryFn: () => getGameHistoricalLow(gameId),
    refetchInterval: 10 * 60 * 1000, // 10 dakikada bir yenile (tarihi veriler daha az sıklıkla değişir)
  });
  
  const isLoading = isLoadingInfo || isLoadingPrices || isLoadingHistorical;
  const hasError = infoError || pricesError || historicalError;
  
  if (isLoading) {
    return (
      <div className="container py-12 flex flex-col items-center">
        <LoadingSpinner />
        <p className="text-gray-400 mt-4">Oyun bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="container py-12">
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">Bir hata oluştu</h2>
          <p className="text-gray-400">
            Oyun verileri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }
  
  if (!gameInfo) {
    return (
      <div className="container py-12">
        <div className="bg-amber-500/10 border border-amber-500 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">Oyun bulunamadı</h2>
          <p className="text-gray-400">
            Aradığınız oyun mevcut değil veya kaldırılmış olabilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {gameInfo.assets?.boxart && (
          <div className="w-full md:w-1/3">
            <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={gameInfo.assets.boxart}
                alt={gameInfo.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold text-white mb-4">{gameInfo.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
            <div>
              <h2 className="text-lg font-medium text-accent mb-2">Genel Bilgiler</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Çıkış Tarihi:</span>
                  <span className="text-white">{gameInfo.releaseDate ? new Date(gameInfo.releaseDate).toLocaleDateString() : "Bilinmiyor"}</span>
                </li>
                {gameInfo.earlyAccess && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Erken Erişim:</span>
                    <span className="text-white">Evet</span>
                  </li>
                )}
                {gameInfo.achievements && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Başarımlar:</span>
                    <span className="text-white">Var</span>
                  </li>
                )}
                {gameInfo.tradingCards && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Takas Kartları:</span>
                    <span className="text-white">Var</span>
                  </li>
                )}
              </ul>
            </div>

            {(gameInfo.developers?.length > 0 || gameInfo.publishers?.length > 0) && (
              <div>
                <h2 className="text-lg font-medium text-accent mb-2">Geliştiriciler & Yayıncılar</h2>
                <ul className="space-y-2">
                  {gameInfo.developers?.length > 0 && (
                    <li>
                      <span className="text-gray-400">Geliştiriciler:</span>
                      <div className="text-white mt-1">
                        {gameInfo.developers.map(dev => dev.name).join(", ")}
                      </div>
                    </li>
                  )}
                  {gameInfo.publishers?.length > 0 && (
                    <li>
                      <span className="text-gray-400">Yayıncılar:</span>
                      <div className="text-white mt-1">
                        {gameInfo.publishers.map(pub => pub.name).join(", ")}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {gameInfo.tags && gameInfo.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-accent mb-2">Etiketler</h2>
              <div className="flex flex-wrap gap-2">
                {gameInfo.tags.map((tag, index) => (
                  <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {gameInfo.reviews && gameInfo.reviews.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-accent mb-2">İncelemeler</h2>
              <div className="space-y-2">
                {gameInfo.reviews.map((review, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400">{review.source}:</span>
                    <div className="flex items-center">
                      <span className={`font-bold ${review.score >= 75 ? 'text-green-500' : review.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {review.score}/100
                      </span>
                      <span className="text-gray-400 ml-2">({review.count} inceleme)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fiyatlar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Mevcut Fiyatlar</h2>
        {gamePrices && gamePrices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamePrices.map((price, index) => (
              <div key={index} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-white">{price.shop.name}</span>
                  {price.cut > 0 && (
                    <span className="bg-accent text-secondary px-2 py-1 rounded text-sm font-bold">
                      -{price.cut}%
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">{price.price.amount} {price.price.currency}</span>
                  <span className="text-gray-400 line-through">{price.regular.amount} {price.regular.currency}</span>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
                  Son güncelleme: {new Date(price.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Mevcut fiyat bilgisi bulunamadı.</p>
        )}
      </div>

      {/* Tarihi düşük fiyat */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Tarihi En Düşük Fiyat</h2>
        {historicalLow ? (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-white">{historicalLow.shop.name}</span>
              {historicalLow.cut > 0 && (
                <span className="bg-accent text-secondary px-2 py-1 rounded text-sm font-bold">
                  -{historicalLow.cut}%
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-white">{historicalLow.price.amount} {historicalLow.price.currency}</span>
              <span className="text-gray-400 line-through">{historicalLow.regular.amount} {historicalLow.regular.currency}</span>
            </div>
            
            <div className="text-sm text-gray-400">
              Tarihi: {new Date(historicalLow.timestamp).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Tarihi en düşük fiyat bilgisi bulunamadı.</p>
        )}
      </div>
      
      {/* Bağlantılar */}
      {gameInfo.urls && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Bağlantılar</h2>
          <div className="flex flex-wrap gap-4">
            {gameInfo.urls.game && (
              <a 
                href={gameInfo.urls.game}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                tabIndex={0}
              >
                IsThereAnyDeal&apos;de Görüntüle
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 