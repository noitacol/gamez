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
  developers: {
    id: number;
    name: string;
  }[];
  publishers: {
    id: number;
    name: string;
  }[];
  assets?: {
    boxart: string;
    banner145: string;
    banner300: string;
    banner400: string;
    banner600: string;
  };
  releaseDate?: string;
  earlyAccess?: boolean;
  achievements?: boolean;
  tradingCards?: boolean;
  appid?: number;
  tags?: string[];
  reviews?: {
    score: number | null;
    source: string;
    count: number | null;
    url: string;
  }[];
  stats?: {
    rank: number;
    waitlisted: number;
    collected: number;
  };
  players?: {
    recent: number;
    day: number;
    week: number;
    peak: number;
  };
  urls?: {
    game: string;
  };
} 