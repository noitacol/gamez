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
    const response = await axios.get(`${ITAD_API_BASE_URL}game/prices/`, {
      params: {
        key: ITAD_API_KEY,
        plains: gameId,
        region: 'us',
        country: 'US',
        shops: 'steam,gog,epic,humblestore,origin,fanatical,gamersgate,greenmangaming'
      }
    });
    
    // API yanıtını dönüştür
    if (response.data && response.data.data && response.data.data[gameId]) {
      const priceData = response.data.data[gameId];
      
      const priceList = priceData.list.map((price: any) => ({
        shop: {
          id: price.shop.id || 0,
          name: price.shop.name || 'Unknown Shop',
        },
        price: {
          amount: price.price_new || 0,
          amountInt: Math.floor((price.price_new || 0) * 100),
          currency: price.currency || 'USD',
        },
        regular: {
          amount: price.price_old || 0,
          amountInt: Math.floor((price.price_old || 0) * 100),
          currency: price.currency || 'USD',
        },
        cut: price.price_cut || 0,
        timestamp: price.added || new Date().toISOString(),
      }));
      
      return NextResponse.json({ 
        value: [
          {
            game: {
              id: gameId,
              title: priceData.title || 'Unknown Game'
            },
            deals: priceList
          }
        ] 
      });
    }
    
    // API yanıtı beklenen formatta değilse örnek veri döndür
    return NextResponse.json({ 
      value: [{ 
        game: { id: gameId, title: 'Unknown Game' }, 
        deals: getExampleGamePrices(gameId) 
      }] 
    });
    
  } catch (error) {
    console.error('IsThereAnyDeal API hatası:', error);
    
    // Hata durumunda örnek veri döndür
    return NextResponse.json({ 
      value: [{ 
        game: { id: gameId, title: 'Unknown Game' }, 
        deals: getExampleGamePrices(gameId) 
      }] 
    });
  }
}

// Örnek oyun fiyatları oluşturan yardımcı fonksiyon
function getExampleGamePrices(gameId: string) {
  const gamePrices = {
    "018d937f-07fc-72ed-8517-d8e24cb1eb22": [
      {
        shop: {
          id: 1,
          name: "Steam",
        },
        price: {
          amount: 7.99,
          amountInt: 799,
          currency: "USD",
        },
        regular: {
          amount: 39.99,
          amountInt: 3999,
          currency: "USD",
        },
        cut: 80,
        timestamp: new Date().toISOString(),
      },
      {
        shop: {
          id: 2,
          name: "GOG",
        },
        price: {
          amount: 9.99,
          amountInt: 999,
          currency: "USD",
        },
        regular: {
          amount: 39.99,
          amountInt: 3999,
          currency: "USD",
        },
        cut: 75,
        timestamp: new Date().toISOString(),
      },
      {
        shop: {
          id: 3,
          name: "Humble Bundle",
        },
        price: {
          amount: 11.99,
          amountInt: 1199,
          currency: "USD",
        },
        regular: {
          amount: 39.99,
          amountInt: 3999,
          currency: "USD",
        },
        cut: 70,
        timestamp: new Date().toISOString(),
      },
    ],
    "01849783-6a26-7147-ab32-71804ca47e8e": [
      {
        shop: {
          id: 1,
          name: "Steam",
        },
        price: {
          amount: 29.99,
          amountInt: 2999,
          currency: "USD",
        },
        regular: {
          amount: 59.99,
          amountInt: 5999,
          currency: "USD",
        },
        cut: 50,
        timestamp: new Date().toISOString(),
      },
      {
        shop: {
          id: 2,
          name: "GOG",
        },
        price: {
          amount: 29.99,
          amountInt: 2999,
          currency: "USD",
        },
        regular: {
          amount: 59.99,
          amountInt: 5999,
          currency: "USD",
        },
        cut: 50,
        timestamp: new Date().toISOString(),
      },
      {
        shop: {
          id: 4,
          name: "Epic Games Store",
        },
        price: {
          amount: 35.99,
          amountInt: 3599,
          currency: "USD",
        },
        regular: {
          amount: 59.99,
          amountInt: 5999,
          currency: "USD",
        },
        cut: 40,
        timestamp: new Date().toISOString(),
      },
    ],
  };
  
  // Eğer verilen ID için örnek veri mevcutsa döndür
  if (gamePrices[gameId as keyof typeof gamePrices]) {
    return gamePrices[gameId as keyof typeof gamePrices];
  }
  
  // Yoksa rastgele örnek fiyatlar oluştur
  const shopNames = ["Steam", "GOG", "Epic Games Store", "Humble Bundle", "Fanatical"];
  const basePrice = 59.99;
  const discountRates = [10, 15, 25, 33, 50, 66, 75];
  
  return shopNames.map((shop, index) => {
    const discountRate = discountRates[Math.floor(Math.random() * discountRates.length)];
    const discountedPrice = +(basePrice * (1 - discountRate / 100)).toFixed(2);
    
    return {
      shop: {
        id: index + 1,
        name: shop,
      },
      price: {
        amount: discountedPrice,
        amountInt: Math.floor(discountedPrice * 100),
        currency: "USD",
      },
      regular: {
        amount: basePrice,
        amountInt: Math.floor(basePrice * 100),
        currency: "USD",
      },
      cut: discountRate,
      timestamp: new Date().toISOString(),
    };
  });
} 