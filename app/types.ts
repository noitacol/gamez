export interface Shop {
  id: number;
  title: string;
  deals: number;
  games: number;
  update: string | null;
}

export interface PlatformPrice {
  platform: string;
  originalPrice: number;
  currentPrice: number;
}

export interface GameBasic {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  mature: boolean;
  image?: string;
  discountPercent?: number;
  discountEndDate?: string;
  originPlatform?: string;
  discountPlatform?: string;
  originalPrice?: number;
  currentPrice?: number;
  allPlatformPrices?: PlatformPrice[];
}

export interface GamePrice {
  shop: {
    id: number;
    name: string;
  };
  price: {
    amount: number;
    amountInt: number;
    currency: string;
  };
  regular: {
    amount: number;
    amountInt: number;
    currency: string;
  };
  cut: number;
  timestamp: string;
}

export interface GameHistory {
  id: string;
  lows: {
    shop: string;
    price: number;
    regular: number;
    cut: number;
    timestamp: string;
  }[];
}

export interface GameInfo {
  id: string;
  title: string;
  type: string;
  mature: boolean;
  image: string;
  slug: string;
  developers: string[];
  publishers: string[];
} 