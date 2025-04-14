"use client";

import { GameBasic, GamePrice } from "../types";
import Link from "next/link";
import Image from "next/image";
import DiscountTimer from "./DiscountTimer";

interface GameCardProps {
  game: GameBasic;
  price?: GamePrice;
}

export default function GameCard({ game, price }: GameCardProps) {
  return (
    <Link 
      href={`/game/${game.id}`}
      tabIndex={0}
      className="card block transition-transform hover:scale-[1.02] focus:scale-[1.02] outline-none focus:ring-2 focus:ring-accent"
      aria-label={`${game.title} oyununu görüntüle`}
    >
      <div className="relative w-full h-[160px] rounded-t-xl overflow-hidden">
        <Image
          src={game.image || 'https://placehold.co/400x600?text=No+Image'}
          alt={game.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {game.discountPercent && game.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -%{game.discountPercent}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col space-y-2">
        <h3 className="font-semibold text-white line-clamp-1">{game.title}</h3>
        
        {game.discountEndDate && (
          <DiscountTimer endDate={game.discountEndDate} className="mt-1" compactView={true} />
        )}
        
        {price ? (
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-white font-bold">{price.price.amount} {price.price.currency}</span>
                {price.cut > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -%{price.cut}
                  </span>
                )}
              </div>
              <span className="text-gray-400 line-through text-sm">
                {price.regular.amount} {price.regular.currency}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-400">
              {price.shop.name}
            </div>
          </div>
        ) : (
          game.originalPrice && game.currentPrice ? (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">${game.currentPrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">${game.originalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-xs">
                {game.discountPlatform && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    game.discountPlatform === 'Steam' ? 'bg-blue-600/80' : 
                    game.discountPlatform === 'Epic Games' ? 'bg-purple-600/80' : 
                    game.discountPlatform === 'GOG' ? 'bg-rose-600/80' : 
                    'bg-gray-600/80'
                  }`}>
                    {game.discountPlatform}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mt-4">Fiyat bilgisi bulunamadı</p>
          )
        )}
      </div>
    </Link>
  );
} 