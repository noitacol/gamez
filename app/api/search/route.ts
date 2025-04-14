import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// IsThereAnyDeal API için yapılandırma
const ITAD_API_KEY = process.env.NEXT_PUBLIC_ITAD_API_KEY || '';
const ITAD_API_BASE_URL = 'https://api.isthereanydeal.com/v01/';

export async function GET(request: NextRequest) {
  // URL'den sorgu parametresini al
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Arama sorgusu belirtilmedi' }, 
      { status: 400 }
    );
  }
  
  try {
    // IsThereAnyDeal API'ye istek gönder
    const response = await axios.get(`${ITAD_API_BASE_URL}search/search/`, {
      params: {
        key: ITAD_API_KEY,
        q: query,
        limit: 20
      }
    });
    
    // API yanıtını dönüştür
    if (response.data && response.data.data && response.data.data.results) {
      const games = response.data.data.results.map((game: any) => ({
        id: game.plain || `game-${Math.random().toString(36).substr(2, 9)}`,
        slug: game.slug || '',
        title: game.title || 'Unknown Game',
        type: game.type || 'game',
        mature: game.mature || false,
        image: game.image || `https://placehold.co/400x600?text=${encodeURIComponent(game.title || 'No Image')}`,
      }));
      
      return NextResponse.json({ value: games });
    }
    
    // API yanıtı beklenen formatta değilse örnek veri döndür
    return NextResponse.json({ 
      value: getExampleSearchResults(query) 
    });
    
  } catch (error) {
    console.error('IsThereAnyDeal API hatası:', error);
    
    // Hata durumunda örnek veri döndür
    return NextResponse.json({ 
      value: getExampleSearchResults(query) 
    });
  }
}

// Örnek arama sonuçları oluşturan yardımcı fonksiyon
function getExampleSearchResults(query: string) {
  const exampleGames = [
    {
      id: "018d937f-07fc-72ed-8517-d8e24cb1eb22",
      slug: "europa-universalis-iv",
      title: "Europa Universalis IV",
      type: "game",
      mature: false,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
    },
    {
      id: "01846e7e-7e96-71fb-bf16-6979fa211638",
      slug: "ghost-master",
      title: "Ghost Master",
      type: "game",
      mature: false,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/6200/header.jpg",
    },
    {
      id: "01846e7e-84f8-7314-94eb-6bff48d886f8",
      slug: "the-ship-single-player",
      title: "The Ship: Single Player",
      type: "game",
      mature: false,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2400/header.jpg",
    },
    {
      id: "01849782-1017-7389-8de4-c97c587fd7e3",
      slug: "the-witcher-3-wild-hunt",
      title: "The Witcher 3: Wild Hunt",
      type: "game",
      mature: true,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
    },
    {
      id: "01849783-6a26-7147-ab32-71804ca47e8e",
      slug: "cyberpunk-2077",
      title: "Cyberpunk 2077",
      type: "game",
      mature: true,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    }
  ];
  
  // Sorguya göre filtreleme yap
  return exampleGames.filter(game => 
    game.title.toLowerCase().includes(query.toLowerCase())
  );
} 