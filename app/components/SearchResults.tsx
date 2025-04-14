"use client";

import { GameBasic } from "../types";
import GameCard from "./GameCard";
import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../api";
import LoadingSpinner from "./LoadingSpinner";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchGames(query),
    enabled: !!query,
    refetchInterval: 60 * 1000, // 1 dakikada bir yenile
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Arama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">"{query}" için sonuç bulunamadı.</p>
        <p className="text-gray-400 mt-2">Farklı anahtar kelimeler kullanarak tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">"{query}" için <span className="text-accent">{data.length}</span> sonuç bulundu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
} 