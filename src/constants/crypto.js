export const CRYPTO_KEYWORDS = [
  'crypto', 'bitcoin', 'ethereum', 'blockchain', 'web3', 'defi', 'nft',
  'cryptocurrency', 'btc', 'eth', 'token', 'dao', 'mining', 'binance',
  'coinbase', 'metamask', 'wallet', 'dex', 'exchange'
];

export const MAJOR_CRYPTOCURRENCIES = [
  { 
    id: 'bitcoin', 
    symbol: 'BTC',
    keywords: ['bitcoin', 'btc'],
    currentPrice: 95480.50,
    technicalLevels: {
      support1: 94200,
      support2: 92500,
      resistance1: 97000,
      resistance2: 98500
    }
  },
  { 
    id: 'solana', 
    symbol: 'SOL',
    keywords: ['solana', 'sol'],
    currentPrice: 192.35,
    technicalLevels: {
      support1: 188,
      support2: 182,
      resistance1: 198,
      resistance2: 205
    }
  },
  { 
    id: 'ethereum', 
    symbol: 'ETH',
    keywords: ['ethereum', 'eth'],
    currentPrice: 2280.15,
    technicalLevels: {
      support1: 2200,
      support2: 2150,
      resistance1: 2350,
      resistance2: 2400
    }
  },
  { 
    id: 'binance', 
    symbol: 'BNB',
    keywords: ['binance', 'bnb'],
    currentPrice: 312.45,
    technicalLevels: {
      support1: 305,
      support2: 298,
      resistance1: 320,
      resistance2: 328
    }
  },
  { 
    id: 'cardano', 
    symbol: 'ADA',
    keywords: ['cardano', 'ada'],
    currentPrice: 0.58,
    technicalLevels: {
      support1: 0.55,
      support2: 0.52,
      resistance1: 0.61,
      resistance2: 0.64
    }
  }
];

export const NEWS_SOURCES = [
  'https://hn.algolia.com/api/v1/search_by_date?query=crypto&tags=story&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=bitcoin&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=blockchain&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=solana&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search_by_date?query=sol token&tags=story&hitsPerPage=100'
];

export const ADDITIONAL_NEWS_SOURCES = [
  'https://api.coindesk.com/v1/news?tags=solana',
  'https://api.cointelegraph.com/v1/news?tag=solana',
  'https://api.theblock.co/v1/news?category=solana',
  'https://api.decrypt.co/v1/articles?tag=solana'
];
