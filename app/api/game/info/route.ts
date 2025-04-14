import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// IsThereAnyDeal API için yapılandırma
const ITAD_API_KEY = process.env.NEXT_PUBLIC_ITAD_API_KEY || '';
const ITAD_API_BASE_URL = 'https://api.isthereanydeal.com/v01/';

export async function GET(request: NextRequest) {
  // URL'den oyun ID parametresini al
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('id');
  
  if (!gameId) {
    return NextResponse.json(
      { error: 'Oyun ID belirtilmedi' }, 
      { status: 400 }
    );
  }
  
  try {
    // IsThereAnyDeal API'ye istek gönder
    const response = await axios.get(`${ITAD_API_BASE_URL}game/info/`, {
      params: {
        key: ITAD_API_KEY,
        plains: gameId
      }
    });
    
    // API yanıtını dönüştür
    if (response.data && response.data.data && response.data.data[gameId]) {
      const gameData = response.data.data[gameId];
      
      const gameInfo = {
        id: gameId,
        slug: gameData.slug || '',
        title: gameData.title || 'Unknown Game',
        type: gameData.type || 'game',
        mature: gameData.is_mature || false,
        assets: {
          boxart: gameData.image || '',
          banner145: gameData.image || '',
          banner300: gameData.image || '',
          banner400: gameData.image || '',
          banner600: gameData.image || '',
        },
        earlyAccess: gameData.is_early_access || false,
        achievements: gameData.achievements || false,
        tradingCards: gameData.trading_cards || false,
        appid: gameData.steam ? parseInt(gameData.steam.id) || 0 : 0,
        tags: gameData.tags || [],
        releaseDate: gameData.release_date || null,
        developers: (gameData.developers || []).map((dev: string) => ({ id: 0, name: dev })),
        publishers: (gameData.publishers || []).map((pub: string) => ({ id: 0, name: pub })),
        reviews: gameData.reviews ? [
          {
            score: gameData.reviews.score || 0,
            source: gameData.reviews.source || '',
            count: gameData.reviews.count || 0,
            url: gameData.reviews.url || '',
          }
        ] : [],
        stats: {
          rank: gameData.rank || 0,
          waitlisted: gameData.waitlist_count || 0,
          collected: gameData.collection_count || 0,
        },
        players: gameData.players ? {
          recent: gameData.players.recent || 0,
          day: gameData.players.day || 0,
          week: gameData.players.week || 0,
          peak: gameData.players.peak || 0,
        } : null,
        urls: {
          game: gameData.urls?.game || '',
        },
      };
      
      return NextResponse.json({ value: gameInfo });
    }
    
    // API yanıtı beklenen formatta değilse örnek veri döndür
    return NextResponse.json({ 
      value: getExampleGameInfo(gameId) 
    });
    
  } catch (error) {
    console.error('IsThereAnyDeal API hatası:', error);
    
    // Hata durumunda örnek veri döndür
    return NextResponse.json({ 
      value: getExampleGameInfo(gameId) 
    });
  }
}

// Örnek oyun bilgisi oluşturan yardımcı fonksiyon
function getExampleGameInfo(gameId: string) {
  const exampleGames = {
    "018d937f-07fc-72ed-8517-d8e24cb1eb22": {
      id: "018d937f-07fc-72ed-8517-d8e24cb1eb22",
      slug: "europa-universalis-iv",
      title: "Europa Universalis IV",
      type: "game",
      mature: false,
      assets: {
        boxart: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
        banner145: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
        banner300: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
        banner400: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
        banner600: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
      },
      earlyAccess: false,
      achievements: true,
      tradingCards: true,
      appid: 236850,
      tags: ["Strategy", "Grand Strategy", "Historical", "Simulation"],
      releaseDate: "2013-08-13",
      developers: [{ id: 1, name: "Paradox Development Studio" }],
      publishers: [{ id: 1, name: "Paradox Interactive" }],
      reviews: [
        {
          score: 86,
          source: "Steam",
          count: 67812,
          url: "https://store.steampowered.com/app/236850",
        }
      ],
      stats: {
        rank: 87,
        waitlisted: 1234,
        collected: 45678,
      },
      players: {
        recent: 24567,
        day: 31254,
        week: 38741,
        peak: 46982,
      },
      urls: {
        game: "https://store.steampowered.com/app/236850",
      },
    },
    "01849783-6a26-7147-ab32-71804ca47e8e": {
      id: "01849783-6a26-7147-ab32-71804ca47e8e",
      slug: "cyberpunk-2077",
      title: "Cyberpunk 2077",
      type: "game",
      mature: true,
      assets: {
        boxart: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        banner145: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        banner300: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        banner400: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        banner600: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      },
      earlyAccess: false,
      achievements: true,
      tradingCards: false,
      appid: 1091500,
      tags: ["Cyberpunk", "Open World", "RPG", "Sci-fi"],
      releaseDate: "2020-12-10",
      developers: [{ id: 2, name: "CD PROJEKT RED" }],
      publishers: [{ id: 2, name: "CD PROJEKT RED" }],
      reviews: [
        {
          score: 76,
          source: "Steam",
          count: 434764,
          url: "https://store.steampowered.com/app/1091500",
        }
      ],
      stats: {
        rank: 24,
        waitlisted: 56734,
        collected: 157834,
      },
      players: {
        recent: 86574,
        day: 92345,
        week: 103456,
        peak: 158345,
      },
      urls: {
        game: "https://store.steampowered.com/app/1091500",
      },
    }
  };
  
  // Eğer verilen ID için örnek veri mevcutsa döndür
  if (exampleGames[gameId as keyof typeof exampleGames]) {
    return exampleGames[gameId as keyof typeof exampleGames];
  }
  
  // Yoksa varsayılan bir örnek döndür
  return {
    id: gameId,
    slug: "unknown-game",
    title: "Unknown Game",
    type: "game",
    mature: false,
    assets: {
      boxart: "https://placehold.co/600x400?text=Game+Not+Found",
      banner145: "https://placehold.co/145x80?text=Game+Not+Found",
      banner300: "https://placehold.co/300x150?text=Game+Not+Found",
      banner400: "https://placehold.co/400x200?text=Game+Not+Found",
      banner600: "https://placehold.co/600x300?text=Game+Not+Found",
    },
    earlyAccess: false,
    achievements: false,
    tradingCards: false,
    appid: 0,
    tags: [],
    releaseDate: null,
    developers: [],
    publishers: [],
    reviews: [],
    stats: {
      rank: 0,
      waitlisted: 0,
      collected: 0,
    },
    players: null,
    urls: {
      game: "",
    },
  };
} 