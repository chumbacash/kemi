import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopGainer {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap_rank: number;
  usd: number;
  usd_24h_vol: number;
  usd_24h_change: number;
}

interface TopGainersCardProps {
  isLoading?: boolean;
}

const TopGainersCard: FC<TopGainersCardProps> = ({ isLoading = false }) => {
  const navigate = useNavigate();
  const [gainers, setGainers] = useState<TopGainer[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out stablecoins and low-change coins
  const filterValidGainers = (coins: TopGainer[]): TopGainer[] => {
    const stablecoinSymbols = ['USDT', 'USDC', 'BUSD', 'DAI', 'FRAX', 'TUSD', 'USDP', 'USDE', 'FDUSD'];
    const stablecoinNames = ['Tether', 'USD Coin', 'Binance USD', 'Dai', 'Frax', 'TrueUSD', 'Pax Dollar', 'Ethena USDe', 'First Digital USD'];
    
    return coins.filter(coin => {
      // Filter out stablecoins by symbol
      if (stablecoinSymbols.includes(coin.symbol.toUpperCase())) {
        return false;
      }
      
      // Filter out stablecoins by name
      if (stablecoinNames.some(name => coin.name.toLowerCase().includes(name.toLowerCase()))) {
        return false;
      }
      
      // Filter out coins with very low change (likely stablecoins or errors)
      if (coin.usd_24h_change < 5) { // Only show coins with >5% gain
        return false;
      }
      
      // Filter out coins with suspicious price patterns
      if (coin.usd === 1.0 || (coin.usd > 0.999 && coin.usd < 1.001)) {
        return false;
      }
      
      return true;
    });
  };

  const fetchTopGainers = async () => {
    try {
      setIsLoadingData(true);
      setError(null);

      // Try to use MCP directly if available
      if (window.mcpCoingecko?.getTopGainersLosers) {
        const mcpData = await window.mcpCoingecko.getTopGainersLosers({
          duration: '24h',
          vs_currency: 'usd',
          top_coins: '1000'
        });
        
        if (mcpData?.top_gainers) {
          const filtered = filterValidGainers(mcpData.top_gainers);
          setGainers(filtered.slice(0, 5));
          console.log('🚀 MCP Top Gainers:', filtered.slice(0, 3).map(c => `${c.name}: +${c.usd_24h_change.toFixed(2)}%`));
          return;
        }
      }

      // Fallback to API endpoint
      const response = await fetch('/api/mcp/coingecko/top-gainers-losers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'mcp_coingecko_mcp_get_coins_top_gainers_losers',
          arguments: {
            duration: '24h',
            vs_currency: 'usd',
            top_coins: '1000'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const filtered = filterValidGainers(data.top_gainers || []);
        setGainers(filtered.slice(0, 5));
      } else {
        throw new Error('Failed to fetch gainers data');
      }
    } catch (err) {
      console.error('Error fetching top gainers:', err);
      setError('Failed to load top gainers');
      
      // Fallback to mock data for demo
      setGainers([
        {
          id: 'zora',
          symbol: 'ZORA',
          name: 'Zora',
          image: 'https://coin-images.coingecko.com/coins/images/54693/small/zora.jpg',
          market_cap_rank: 358,
          usd: 0.0516,
          usd_24h_vol: 409715292,
          usd_24h_change: 137.08
        },
        {
          id: 'spark-2',
          symbol: 'SPK',
          name: 'Spark',
          image: 'https://coin-images.coingecko.com/coins/images/38637/small/Spark-Logomark-RGB.png',
          market_cap_rank: 369,
          usd: 0.1473,
          usd_24h_vol: 2488273338,
          usd_24h_change: 100.04
        },
        {
          id: 'sahara-ai',
          symbol: 'SAHARA',
          name: 'Sahara AI',
          image: 'https://coin-images.coingecko.com/coins/images/66681/small/Token_Logo_3x.png',
          market_cap_rank: 258,
          usd: 0.1491,
          usd_24h_vol: 1573888229,
          usd_24h_change: 76.13
        }
      ]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchTopGainers();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchTopGainers, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCoinClick = (coinId: string) => {
    navigate(`/coins/${coinId}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(price);
    } else if (price >= 0.01) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }).format(price);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const formatPercentage = (change: number) => {
    return `+${change.toFixed(2)}%`;
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 last:border-0">
          <div className="flex items-center min-w-0 flex-1">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          <div className="flex flex-col items-end ml-2 flex-shrink-0">
            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-gray-900">🚀 Top Gainers (24h)</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {(isLoading || isLoadingData) ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="p-4 text-center">
            <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
            <button 
              onClick={fetchTopGainers}
              className="text-blue-600 text-sm hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : gainers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No gainers data available
          </div>
        ) : (
          gainers.map((coin, index) => (
            <div
              key={coin.id}
              onClick={() => handleCoinClick(coin.id)}
              className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex items-center mr-3">
                  <span className="text-xs font-medium text-gray-400 w-4">
                    {index + 1}
                  </span>
                </div>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                  }}
                />
                <div className="ml-3 truncate">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {coin.name}
                    </p>
                    <span className="ml-2 text-xs text-gray-400">
                      #{coin.market_cap_rank}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">
                      Vol: {formatVolume(coin.usd_24h_vol)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-2 flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {formatPrice(coin.usd)}
                </p>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-green-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {formatPercentage(coin.usd_24h_change)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Data refreshed every 2 minutes • Powered by CoinGecko MCP
        </p>
      </div>
    </div>
  );
};

export default TopGainersCard;

// Type declarations are now centralized in mcpCoingeckoService.ts