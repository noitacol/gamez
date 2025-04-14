"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// QueryClient için global yapılandırma
const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Üssel arka plan
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));
  
  // WebSocket bağlantısı yönetimi için useEffect kullanımı
  useEffect(() => {
    // WebSocket entegrasyonu API hazır olduğunda kullanmak için altyapı
    const setupWebSocketConnection = () => {
      if (typeof window === 'undefined') return null;
      
      try {
        // WebSocket bağlantısı kur
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';
        console.log(`WebSocket bağlantısı kuruluyor: ${wsUrl}`);
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket bağlantısı kuruldu');
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Mesaj türüne göre uygun cache güncellemesi yap
            if (data.type === 'PRICE_UPDATE') {
              // Fiyat güncellemesi
              queryClient.invalidateQueries({ queryKey: ['gamePrices', data.gameId] });
            } else if (data.type === 'DISCOUNT_UPDATE') {
              // İndirim güncellemesi
              queryClient.invalidateQueries({ queryKey: ['limitedTimeDeals'] });
              queryClient.invalidateQueries({ queryKey: ['mostDiscountedGames'] });
            } else if (data.type === 'GAME_UPDATE') {
              // Oyun bilgisi güncellemesi
              queryClient.invalidateQueries({ queryKey: ['gameInfo', data.gameId] });
            }
          } catch (error) {
            console.error('WebSocket mesajı işlenirken hata oluştu:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket hatası:', error);
        };
        
        ws.onclose = () => {
          console.log('WebSocket bağlantısı kapatıldı');
        };
        
        return ws;
      } catch (error) {
        console.error('WebSocket bağlantısı kurulurken hata oluştu:', error);
        return null;
      }
    };
    
    // WebSocket API henüz hazır olmadığından şimdilik devre dışı bırakıldı
    // const ws = setupWebSocketConnection();
    
    // Component unmount olduğunda bağlantıyı kapat
    // return () => {
    //   if (ws) {
    //     ws.close();
    //   }
    // };
  }, [queryClient]);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 