"use client";

import { useQuery } from "@tanstack/react-query";
import { getShops } from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function ShopsList() {
  const { data: shops, isLoading, error } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
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
        <p className="text-red-500">Mağazalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Mağaza bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {shops.map((shop) => (
        <div key={shop.id} className="card p-6">
          <h3 className="text-xl font-bold text-white mb-2">{shop.title}</h3>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">İndirimler:</span>
              <span className="text-white font-medium">{shop.deals}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Oyunlar:</span>
              <span className="text-white font-medium">{shop.games}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Son Güncelleme:</span>
              <span className="text-white font-medium">
                {shop.update ? new Date(shop.update).toLocaleDateString() : "Bilinmiyor"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 