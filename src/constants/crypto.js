export const CRYPTO_KEYWORDS = [
  'crypto', 'bitcoin', 'ethereum', 'blockchain', 'web3', 'defi', 'nft',
  'cryptocurrency', 'btc', 'eth', 'token', 'dao', 'mining', 'binance',
  'coinbase', 'metamask', 'wallet', 'dex', 'exchange'
];

export const MAJOR_CRYPTOCURRENCIES = [
  { id: 'bitcoin', keywords: ['bitcoin', 'btc'] },
  { id: 'ethereum', keywords: ['ethereum', 'eth'] },
  { id: 'binance', keywords: ['binance', 'bnb'] },
  { id: 'solana', keywords: ['solana', 'sol'] },
  { id: 'cardano', keywords: ['cardano', 'ada'] }
];

export const NEWS_SOURCES = [
  'https://hn.algolia.com/api/v1/search_by_date?query=crypto&tags=story&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=bitcoin&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=blockchain&hitsPerPage=100'
];
