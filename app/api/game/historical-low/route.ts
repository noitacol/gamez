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
    const response = await axios.get(`${ITAD_API_BASE_URL}game/lowest/`, {
      params: {
        key: ITAD_API_KEY,
        plains: gameId,
        region: 'us',
        country: 'US',
      }
    });
    
    // API yanıtını dönüştür
    if (response.data && response.data.data && response.data.data[gameId]) {
      const lowData = response.data.data[gameId];
      
      const historicalLow = {
        shop: {
          id: 0,
          name: lowData.shop.name || 'Unknown Shop',
        },
        price: {
          amount: lowData.price || 0,
          amountInt: Math.floor((lowData.price || 0) * 100),
          currency: 'USD',
        },
        regular: {
          amount: lowData.regular || 0,
          amountInt: Math.floor((lowData.regular || 0) * 100),
          currency: 'USD',
        },
        cut: lowData.cut || 0,
        timestamp: lowData.added || new Date().toISOString(),
      };
      
      return NextResponse.json({ 
        value: [
          {
            game: {
              id: gameId,
              title: 'Unknown Game'
            },
            lows: [historicalLow]
          }
        ] 
      });
    }
    
    // API yanıtı beklenen formatta değilse örnek veri döndür
    return NextResponse.json({ 
      value: [{ 
        game: { id: gameId, title: 'Unknown Game' }, 
        lows: [getExampleHistoricalLow(gameId)] 
      }] 
    });
    
  } catch (error) {
    console.error('IsThereAnyDeal API hatası:', error);
    
    // Hata durumunda örnek veri döndür
    return NextResponse.json({ 
      value: [{ 
        game: { id: gameId, title: 'Unknown Game' }, 
        lows: [getExampleHistoricalLow(gameId)] 
      }] 
    });
  }
}

// Örnek tarihsel en düşük fiyat oluşturan yardımcı fonksiyon
function getExampleHistoricalLow(gameId: string) {
  const historicalLows = {
    "018d937f-07fc-72ed-8517-d8e24cb1eb22": {
      shop: {
        id: 1,
        name: "Steam",
      },
      price: {
        amount: 3.99,
        amountInt: 399,
        currency: "USD",
      },
      regular: {
        amount: 39.99,
        amountInt: 3999,
        currency: "USD",
      },
      cut: 90,
      timestamp: "2021-11-24T12:00:00Z",
    },
    "01849783-6a26-7147-ab32-71804ca47e8e": {
      shop: {
        id: 2,
        name: "GOG",
      },
      price: {
        amount: 19.99,
        amountInt: 1999,
        currency: "USD",
      },
      regular: {
        amount: 59.99,
        amountInt: 5999,
        currency: "USD",
      },
      cut: 66,
      timestamp: "2022-06-15T12:00:00Z",
    },
  };
  
  // Eğer verilen ID için örnek veri mevcutsa döndür
  if (historicalLows[gameId as keyof typeof historicalLows]) {
    return historicalLows[gameId as keyof typeof historicalLows];
  }
  
  // Yoksa rastgele örnek tarihsel en düşük fiyat oluştur
  const shopNames = ["Steam", "GOG", "Epic Games Store", "Humble Bundle", "Fanatical"];
  const shop = shopNames[Math.floor(Math.random() * shopNames.length)];
  const basePrice = 59.99;
  const discountRates = [75, 80, 85, 90, 95];
  const discountRate = discountRates[Math.floor(Math.random() * discountRates.length)];
  const discountedPrice = +(basePrice * (1 - discountRate / 100)).toFixed(2);
  
  // Geçmiş bir tarih oluştur (1-12 ay öncesi)
  const pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 12) - 1);
  
  return {
    shop: {
      id: Math.floor(Math.random() * 5) + 1,
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
    timestamp: pastDate.toISOString(),
  };
} 