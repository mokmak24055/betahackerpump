
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('BINANCE_API_KEY');
    const apiSecret = Deno.env.get('BINANCE_SECRET_KEY');

    if (!apiKey || !apiSecret) {
      throw new Error('Binance API credentials not configured');
    }

    // Fetch BTC/USDT and SOL/USDT prices
    const symbols = ['BTCUSDT', 'SOLUSDT'];
    const responses = await Promise.all(
      symbols.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, {
          headers: {
            'X-MBX-APIKEY': apiKey
          }
        })
      )
    );

    const results = await Promise.all(responses.map(r => r.json()));

    const prices = {
      bitcoin: {
        price: parseFloat(results[0].lastPrice),
        change_24h: parseFloat(results[0].priceChangePercent),
        volume: parseFloat(results[0].volume)
      },
      solana: {
        price: parseFloat(results[1].lastPrice),
        change_24h: parseFloat(results[1].priceChangePercent),
        volume: parseFloat(results[1].volume)
      }
    };

    return new Response(JSON.stringify(prices), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch prices',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
