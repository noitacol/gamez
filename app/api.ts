import axios from "axios";
import type { GameBasic, GameHistory, GameInfo, GamePrice, Shop, PlatformPrice } from "./types";

// IsThereAnyDeal API için yapılandırma
const ITAD_API_KEY = process.env.NEXT_PUBLIC_ITAD_API_KEY || '';
const ITAD_API_BASE_URL = 'https://api.isthereanydeal.com/v02/';

// Next.js API Routes üzerinden yerel API çağrıları
const api = axios.create({
  baseURL: "/api",
});

// IsThereAnyDeal API için doğrudan istek
const itadApi = axios.create({
  baseURL: ITAD_API_BASE_URL,
  params: {
    key: ITAD_API_KEY,
    region: 'tr',
    country: 'TR',
    shops: 'steam,epic,gog,humblestore,origin'
  }
});

export async function getShops(): Promise<Shop[]> {
  try {
    // Önce Next.js API Routes üzerinden dene
    const response = await api.get("/shops");
    return response.data.value;
  } catch (error) {
    console.error("Error fetching shops from local API, trying ITAD API directly:", error);
    
    try {
      // ITAD API'ye doğrudan istek
      const itadResponse = await itadApi.get("service/stores/all");
      
      if (itadResponse.data && itadResponse.data.data) {
        // ITAD API'den gelen veriyi Shop formatına dönüştür
        return Object.keys(itadResponse.data.data).map(key => ({
          id: itadResponse.data.data[key].id || 0,
          title: itadResponse.data.data[key].title || key,
          deals: 0,
          games: 0,
          update: null
        }));
      }
      
      throw new Error("Invalid ITAD API response");
    } catch (itadError) {
      console.error("Error fetching shops from ITAD API, returning mock data:", itadError);
      // Hata durumunda örnek veri döndür
      return [
        { id: 1, title: "Steam", deals: 1500, games: 50000, update: null },
        { id: 2, title: "Epic Games Store", deals: 350, games: 1200, update: null },
        { id: 3, title: "GOG", deals: 800, games: 4500, update: null },
        { id: 4, title: "Humble Bundle", deals: 600, games: 3000, update: null },
        { id: 5, title: "Origin", deals: 200, games: 1000, update: null },
        { id: 6, title: "Ubisoft Connect", deals: 150, games: 800, update: null },
        { id: 7, title: "Fanatical", deals: 700, games: 5000, update: null },
        { id: 8, title: "GreenManGaming", deals: 500, games: 3500, update: null }
      ];
    }
  }
}

export async function searchGames(query: string): Promise<GameBasic[]> {
  try {
    const response = await itadApi.get("search/search", {
      params: {
        q: query,
        limit: 20,
        strict: 0
      }
    });
    
    if (response.data?.data?.results) {
      return response.data.data.results.map((game: any) => ({
        id: game.plain || `game-${Math.random().toString(36).substr(2, 9)}`,
        slug: game.plain || '',
        title: game.title || 'Unknown Game',
        type: game.type || null,
        mature: game.is_mature || false,
        image: game.image || `https://placehold.co/400x600?text=${encodeURIComponent(game.title || 'No Image')}`,
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error searching games:", error);
    return getExampleGames().filter(game => 
      game.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function getGameInfo(gameId: string): Promise<GameInfo | null> {
  try {
    const response = await itadApi.get("game/info", {
      params: {
        plains: gameId
      }
    });
    
    if (response.data?.data?.[gameId]) {
      const data = response.data.data[gameId];
      return {
        id: gameId,
        title: data.title,
        type: data.type,
        mature: data.is_mature || false,
        image: data.image,
        slug: data.plain,
        developers: data.developers || [],
        publishers: data.publishers || [],
        urls: data.urls || {}
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching game info:", error);
    return null;
  }
}

export async function getGamePrices(gameId: string): Promise<GamePrice[]> {
  try {
    const response = await itadApi.post("games/prices/v3", [gameId], {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        region: 'tr',
        country: 'TR',
        shops: 'steam,epic,gog,humblestore,origin'
      }
    });
    
    if (response.data?.[0]?.deals) {
      return response.data[0].deals.map((deal: any) => ({
        shop: {
          id: deal.shop.id,
          name: deal.shop.name
        },
        price: {
          amount: deal.price.amount,
          amountInt: deal.price.amountInt,
          currency: deal.price.currency
        },
        regular: {
          amount: deal.regular.amount,
          amountInt: deal.regular.amountInt,
          currency: deal.regular.currency
        },
        cut: deal.cut,
        voucher: deal.voucher,
        storeLow: deal.storeLow ? {
          amount: deal.storeLow.amount,
          amountInt: deal.storeLow.amountInt,
          currency: deal.storeLow.currency
        } : null,
        historyLow: response.data[0].historyLow ? {
          all: response.data[0].historyLow.all,
          y1: response.data[0].historyLow.y1,
          m3: response.data[0].historyLow.m3
        } : null,
        flag: deal.flag,
        drm: deal.drm,
        platforms: deal.platforms,
        timestamp: deal.timestamp,
        expiry: deal.expiry,
        url: deal.url
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching game prices:", error);
    return [];
  }
}

export async function getGameHistoricalLow(gameId: string): Promise<GameHistory | null> {
  try {
    const response = await itadApi.get("game/lowest", {
      params: {
        plains: gameId,
        since: 0
      }
    });
    
    if (response.data?.data?.[gameId]) {
      const data = response.data.data[gameId];
      return {
        id: gameId,
        lows: [{
          shop: {
            id: data.shop.id,
            name: data.shop.name
          },
          price: {
            amount: data.price,
            amountInt: Math.round(data.price * 100),
            currency: data.currency
          },
          regular: {
            amount: data.regular,
            amountInt: Math.round(data.regular * 100),
            currency: data.currency
          },
          cut: data.cut,
          timestamp: new Date(data.timestamp * 1000).toISOString()
        }]
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching game historical low:", error);
    return null;
  }
}

// Tüm platformlardaki fiyatları karşılaştırmalı olarak getir
export async function getGameAllPlatformPrices(gameId: string): Promise<PlatformPrice[]> {
  try {
    // Gerçek API entegrasyonunda burası platform karşılaştırmalı fiyatları getirecek
    const response = await api.get("/game/compare-prices", {
      params: {
        id: gameId,
      },
    });
    
    if (response.data && response.data.platforms) {
      return response.data.platforms;
    }
    
    // API yanıt vermezse örnek veri kullan - gerçek implementasyonda oyuna göre gerçek fiyat olmalı
    const prices = await getGamePrices(gameId);
    if (prices && prices.length > 0) {
      // GamePrice verisini PlatformPrice formatına dönüştür
      return prices.map(price => ({
        platform: price.shop.name,
        originalPrice: price.regular.amount,
        currentPrice: price.price.amount
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching game platform prices:", error);
    return [];
  }
}

// GameBasic verisine tüm fiyat bilgilerini ekleyen yardımcı fonksiyon
export async function enrichGameWithPrices(game: GameBasic): Promise<GameBasic> {
  try {
    // Oyun fiyatlarını getir
    const allPrices = await getGameAllPlatformPrices(game.id);
    
    if (allPrices && allPrices.length > 0) {
      // En iyi indirimi bul
      let bestDiscount = 0;
      let bestPlatform = '';
      let bestOriginalPrice = 0;
      let bestCurrentPrice = 0;
      
      allPrices.forEach(price => {
        const discountPct = ((price.originalPrice - price.currentPrice) / price.originalPrice) * 100;
        if (discountPct > bestDiscount) {
          bestDiscount = discountPct;
          bestPlatform = price.platform;
          bestOriginalPrice = price.originalPrice;
          bestCurrentPrice = price.currentPrice;
        }
      });
      
      // Oyunu fiyat bilgileriyle zenginleştir
      return {
        ...game,
        discountPercent: Math.round(bestDiscount),
        discountPlatform: bestPlatform,
        originalPrice: bestOriginalPrice,
        currentPrice: bestCurrentPrice,
        allPlatformPrices: allPrices
      };
    }
    
    return game;
  } catch (error) {
    console.error("Error enriching game with prices:", error);
    return game;
  }
}

// Gerçekçi oyun verileri
const realGamePrices = {
  'ghost-master': {
    originalPrice: 6.99,
    currentPrice: 0.69,
    discount: 90,
    platforms: [
      { platform: 'Steam', originalPrice: 6.99, currentPrice: 0.69 },
      { platform: 'GOG', originalPrice: 6.99, currentPrice: 2.99 },
      { platform: 'Humble Bundle', originalPrice: 6.99, currentPrice: 3.49 },
      { platform: 'Epic Games', originalPrice: 7.99, currentPrice: 3.99 }
    ]
  },
  'europa-universalis-iv': {
    originalPrice: 39.99,
    currentPrice: 7.99,
    discount: 80,
    platforms: [
      { platform: 'Steam', originalPrice: 39.99, currentPrice: 7.99 },
      { platform: 'Humble Bundle', originalPrice: 39.99, currentPrice: 9.99 },
      { platform: 'GOG', originalPrice: 39.99, currentPrice: 11.99 },
      { platform: 'Epic Games', originalPrice: 39.99, currentPrice: 19.99 }
    ]
  },
  'the-witcher-3': {
    originalPrice: 29.99,
    currentPrice: 8.99,
    discount: 70,
    platforms: [
      { platform: 'GOG', originalPrice: 29.99, currentPrice: 8.99 },
      { platform: 'Steam', originalPrice: 29.99, currentPrice: 9.89 },
      { platform: 'Humble Bundle', originalPrice: 29.99, currentPrice: 11.99 },
      { platform: 'Epic Games', originalPrice: 29.99, currentPrice: 14.99 }
    ]
  },
  'cyberpunk-2077': {
    originalPrice: 59.99,
    currentPrice: 26.99,
    discount: 55,
    platforms: [
      { platform: 'GreenManGaming', originalPrice: 59.99, currentPrice: 26.99 },
      { platform: 'GOG', originalPrice: 59.99, currentPrice: 29.99 },
      { platform: 'Steam', originalPrice: 59.99, currentPrice: 29.99 },
      { platform: 'Epic Games', originalPrice: 59.99, currentPrice: 35.99 }
    ]
  }
};

// Örnek veri oluştururken daha gerçekçi fiyatları kullan
function getRealisticGamePrices(gameSlug: string) {
  // Bilinen oyunlar için gerçekçi veriler
  if (gameSlug.includes('ghost-master')) {
    return realGamePrices['ghost-master'];
  } else if (gameSlug.includes('europa-universalis')) {
    return realGamePrices['europa-universalis-iv'];
  } else if (gameSlug.includes('witcher')) {
    return realGamePrices['the-witcher-3'];
  } else if (gameSlug.includes('cyberpunk')) {
    return realGamePrices['cyberpunk-2077'];
  }
  
  // Bilinmeyen oyunlar için rastgele ama gerçekçi fiyatlar üret
  const basePrice = Math.floor(Math.random() * 5) * 10 + 9.99; // 9.99, 19.99, 29.99, 39.99, 49.99
  const discountPercent = [10, 15, 20, 25, 33, 50, 60, 66, 75, 80, 90][Math.floor(Math.random() * 11)];
  const currentPrice = +(basePrice * (1 - discountPercent / 100)).toFixed(2);
  
  const steamPrice = currentPrice;
  const epicPrice = +(currentPrice * (1 + Math.random() * 0.2)).toFixed(2);
  const gogPrice = +(currentPrice * (1 + Math.random() * 0.1)).toFixed(2);
  const humblePrice = +(currentPrice * (1 - Math.random() * 0.1)).toFixed(2);
  
  return {
    originalPrice: basePrice,
    currentPrice: currentPrice,
    discount: discountPercent,
    platforms: [
      { platform: 'Steam', originalPrice: basePrice, currentPrice: steamPrice },
      { platform: 'Epic Games', originalPrice: basePrice, currentPrice: epicPrice },
      { platform: 'GOG', originalPrice: basePrice, currentPrice: gogPrice },
      { platform: 'Humble Bundle', originalPrice: basePrice, currentPrice: humblePrice }
    ]
  };
}

// Örnek veri oluştururken oyun ve indirim platformlarını düzgün bir şekilde ayarlayan yardımcı fonksiyon
const getGameWithPlatforms = (
  id: string, 
  title: string, 
  image: string, 
  slug: string,
  type: string,
  mature: boolean,
  discountPercent: number,
  discountEndDate: string,
  originalPrice?: number,
  currentPrice?: number,
  originPlatform?: string,
  discountPlatform?: string,
  allPrices?: PlatformPrice[]
) => {
  // Gerçekçi fiyat verilerini al
  const realPrices = getRealisticGamePrices(slug);
  
  // Oyunun ana platformunu belirle - eğer özel olarak belirtilmemişse
  let finalOriginPlatform = originPlatform;
  if (!finalOriginPlatform) {
    if (id.includes('3')) {
      finalOriginPlatform = 'Origin';
    } else if (id.includes('5')) {
      finalOriginPlatform = 'Battle.net';
    } else if (id.includes('9')) {
      finalOriginPlatform = 'Epic Games';
    } else {
      finalOriginPlatform = 'Steam'; // Varsayılan olarak Steam
    }
  }

  // Fiyat verilerini belirle
  let finalAllPrices = allPrices || realPrices.platforms;
  let finalOriginalPrice = originalPrice || realPrices.originalPrice;
  let finalCurrentPrice = currentPrice || realPrices.currentPrice;
  let finalDiscountPercent = discountPercent || realPrices.discount;
  
  // En iyi indirimi bul - eğer platform fiyatları verilmişse
  let bestDiscount = finalDiscountPercent;
  let bestDiscountPlatform = discountPlatform || '';
  let bestCurrentPrice = finalCurrentPrice;
  let bestOriginalPrice = finalOriginalPrice;

  if (finalAllPrices && finalAllPrices.length > 0) {
    finalAllPrices.forEach(price => {
      const discountPct = ((price.originalPrice - price.currentPrice) / price.originalPrice) * 100;
      if (discountPct > bestDiscount) {
        bestDiscount = discountPct;
        bestDiscountPlatform = price.platform;
        bestCurrentPrice = price.currentPrice;
        bestOriginalPrice = price.originalPrice;
      }
    });
  }

  // Eğer en iyi indirim platformu bulunamadıysa, origin platformunu kullan
  if (!bestDiscountPlatform) {
    bestDiscountPlatform = finalOriginPlatform;
  }

  return {
    id,
    title,
    image,
    slug,
    type,
    mature,
    discountPercent: Math.round(bestDiscount),
    discountEndDate,
    originPlatform: finalOriginPlatform,
    discountPlatform: bestDiscountPlatform,
    originalPrice: bestOriginalPrice,
    currentPrice: bestCurrentPrice,
    allPlatformPrices: finalAllPrices
  };
};

// Popüler oyunları getir
export async function getPopularGames(): Promise<GameBasic[]> {
  try {
    const response = await itadApi.get("stats/most-popular/v1");
    
    if (response.data) {
      const games = response.data;
      const gameIds = games.map((game: any) => game.id);
      
      // Fiyat bilgilerini çek
      const pricesResponse = await itadApi.post("games/prices/v3", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Tarihsel düşük fiyatları çek
      const historyResponse = await itadApi.post("games/historylow/v1", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return games.map((game: any) => {
        const priceData = pricesResponse.data?.find((p: any) => p.id === game.id);
        const historyData = historyResponse.data?.find((h: any) => h.id === game.id);
        
        return {
          id: game.id,
          slug: game.slug,
          title: game.title,
          type: game.type,
          mature: game.mature,
          image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`,
          discountPercent: priceData?.deals?.[0]?.cut || 0,
          originalPrice: priceData?.deals?.[0]?.regular?.amount || 0,
          currentPrice: priceData?.deals?.[0]?.price?.amount || 0,
          discountPlatform: priceData?.deals?.[0]?.shop?.name || null,
          discountEndDate: priceData?.deals?.[0]?.expiry || null,
          historicalLow: historyData?.low ? {
            price: historyData.low.price.amount,
            regular: historyData.low.regular.amount,
            cut: historyData.low.cut,
            shop: historyData.low.shop.name,
            timestamp: historyData.low.timestamp
          } : null
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching popular games:", error);
    return getExampleGames().slice(0, 5);
  }
}

// En büyük indirime sahip oyunları getir
export async function getMostDiscountedGames(): Promise<GameBasic[]> {
  try {
    const response = await itadApi.post("games/overview/v2", {
      region: 'tr',
      country: 'TR',
      shops: 'steam,epic,gog,humblestore,origin',
      limit: 5,
      sort: 'discount'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data?.data?.list) {
      const games = response.data.data.list;
      const gameIds = games.map((game: any) => game.plain);
      
      // Fiyat bilgilerini çek
      const pricesResponse = await itadApi.post("games/prices/v3", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Tarihsel düşük fiyatları çek
      const historyResponse = await itadApi.post("games/historylow/v1", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return games.map((game: any) => {
        const priceData = pricesResponse.data?.find((p: any) => p.id === game.plain);
        const historyData = historyResponse.data?.find((h: any) => h.id === game.plain);
        
        return {
          id: game.plain,
          slug: game.plain,
          title: game.title,
          type: game.type,
          mature: game.is_mature || false,
          image: game.image,
          discountPercent: priceData?.deals?.[0]?.cut || 0,
          originalPrice: priceData?.deals?.[0]?.regular?.amount || 0,
          currentPrice: priceData?.deals?.[0]?.price?.amount || 0,
          discountPlatform: priceData?.deals?.[0]?.shop?.name || null,
          discountEndDate: priceData?.deals?.[0]?.expiry || null,
          historicalLow: historyData?.low ? {
            price: historyData.low.price.amount,
            regular: historyData.low.regular.amount,
            cut: historyData.low.cut,
            shop: historyData.low.shop.name,
            timestamp: historyData.low.timestamp
          } : null
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching most discounted games:", error);
    return getExampleGames().slice(0, 5);
  }
}

// Yakında bitecek sınırlı süreli indirimleri getir
export async function getLimitedTimeDeals(): Promise<GameBasic[]> {
  try {
    const response = await itadApi.get("games/overview/v2", {
      params: {
        region: 'tr',
        country: 'TR',
        shops: 'steam,epic,gog,humblestore,origin',
        limit: 5,
        sort: 'expiry'
      }
    });
    
    if (response.data?.data?.list) {
      const games = response.data.data.list;
      const gameIds = games.map((game: any) => game.plain);
      
      // Fiyat bilgilerini çek
      const pricesResponse = await itadApi.post("games/prices/v3", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Tarihsel düşük fiyatları çek
      const historyResponse = await itadApi.post("games/historylow/v1", gameIds, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return games.map((game: any) => {
        const priceData = pricesResponse.data?.find((p: any) => p.id === game.plain);
        const historyData = historyResponse.data?.find((h: any) => h.id === game.plain);
        
        return {
          id: game.plain,
          slug: game.plain,
          title: game.title,
          type: game.type,
          mature: game.is_mature || false,
          image: game.image,
          discountPercent: priceData?.deals?.[0]?.cut || 0,
          originalPrice: priceData?.deals?.[0]?.regular?.amount || 0,
          currentPrice: priceData?.deals?.[0]?.price?.amount || 0,
          discountPlatform: priceData?.deals?.[0]?.shop?.name || null,
          discountEndDate: priceData?.deals?.[0]?.expiry || null,
          historicalLow: historyData?.low ? {
            price: historyData.low.price.amount,
            regular: historyData.low.regular.amount,
            cut: historyData.low.cut,
            shop: historyData.low.shop.name,
            timestamp: historyData.low.timestamp
          } : null
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching limited time deals:", error);
    return getExampleGames().slice(0, 5);
  }
}

// En çok beklenen oyunlar
export async function getAnticipatedGames(): Promise<GameBasic[]> {
  try {
    // Bu API endpointi gerçek entegrasyonda oluşturulmalıdır
    const response = await api.get("/games/anticipated");
    return response.data.value || [];
  } catch (error) {
    console.error("Error fetching anticipated games:", error);
    
    // Hata durumunda örnek veri döndürme (gerçek implementasyonda kaldırılmalı)
    return [
      getGameWithPlatforms(
        "01849783-6a26-7147-ab32-71804ca47e85", 
        "Cyberpunk 2077: Phantom Liberty",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2203680/header.jpg",
        "cyberpunk-2077-phantom-liberty",
        "dlc",
        true,
        10,
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      ),
      getGameWithPlatforms(
        "01849782-1017-7389-8de4-c97c587fd7e3", 
        "Elden Ring: Shadow of the Erdtree",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1716910/header.jpg",
        "elden-ring-shadow-of-the-erdtree",
        "dlc",
        true,
        5,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
      getGameWithPlatforms(
        "018d937f-07fc-72ed-8517-d8e24cb1eb25", 
        "Starfield",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
        "starfield",
        "game",
        false,
        15,
        new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      ),
      getGameWithPlatforms(
        "01846e7e-84f8-7314-94eb-6bff48d886f5", 
        "Diablo IV",
        "https://blz-contentstack-images.akamaized.net/v3/assets/blt77f4425de611b362/blt6d7b0fd8453e72b3/646e720a71dda17167999000/d4-open-graph.jpg",
        "diablo-iv",
        "game",
        true,
        20,
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      ),
      getGameWithPlatforms(
        "01846e7e-7e96-71fb-bf16-6979fa211635", 
        "Black Myth: Wukong",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg",
        "black-myth-wukong",
        "game",
        false,
        10,
        new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
      )
    ];
  }
}

// Örnek oyun listesi oluşturan yardımcı fonksiyon
function getExampleGames(): GameBasic[] {
  return [
    // Mevcut örnek oyun verileri
    // ... existing code ...
  ];
} 