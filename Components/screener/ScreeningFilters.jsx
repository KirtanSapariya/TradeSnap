import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Clock } from "lucide-react";

export default function ScreeningFilters({ filters, setFilters, assetType }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-500" />
          Screening Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          {/* Timeframe Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Timeframe
            </label>
            <Select 
              value={filters.timeframe || "1D"} 
              onValueChange={(value) => updateFilter('timeframe', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Minute</SelectItem>
                <SelectItem value="3M">3 Minutes</SelectItem>
                <SelectItem value="5M">5 Minutes</SelectItem>
                <SelectItem value="15M">15 Minutes</SelectItem>
                <SelectItem value="30M">30 Minutes</SelectItem>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1MO">1 Month</SelectItem>
                <SelectItem value="3MO">3 Months</SelectItem>
                <SelectItem value="6MO">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {assetType === 'stocks' ? (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Market Cap</label>
                <Select value={filters.market_cap} onValueChange={(value) => updateFilter('market_cap', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market cap" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Caps</SelectItem>
                    <SelectItem value="large">Large Cap (₹20,000+ Cr)</SelectItem>
                    <SelectItem value="mid">Mid Cap (₹5,000-20,000 Cr)</SelectItem>
                    <SelectItem value="small">Small Cap (₹500-5,000 Cr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Sector</label>
                <Select value={filters.sector} onValueChange={(value) => updateFilter('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="banking">Banking & Financial</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                    <SelectItem value="auto">Automotive</SelectItem>
                    <SelectItem value="fmcg">FMCG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Market Cap</label>
                <Select value={filters.market_cap} onValueChange={(value) => updateFilter('market_cap', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market cap" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Caps</SelectItem>
                    <SelectItem value="large">Large Cap ($10B+)</SelectItem>
                    <SelectItem value="mid">Mid Cap ($1B-10B)</SelectItem>
                    <SelectItem value="small">Small Cap (&lt;$1B)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                <Select value={filters.sector} onValueChange={(value) => updateFilter('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="defi">DeFi Tokens</SelectItem>
                    <SelectItem value="layer1">Layer 1 Blockchains</SelectItem>
                    <SelectItem value="gaming">Gaming & NFT</SelectItem>
                    <SelectItem value="stablecoin">Stablecoins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Price Range</label>
            <Select value={filters.price_range} onValueChange={(value) => updateFilter('price_range', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100">Under {assetType === 'stocks' ? '₹100' : '$100'}</SelectItem>
                <SelectItem value="100to1000">{assetType === 'stocks' ? '₹100-1000' : '$100-1000'}</SelectItem>
                <SelectItem value="above1000">Above {assetType === 'stocks' ? '₹1000' : '$1000'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timeframe Description */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Selected Timeframe:</strong> {getTimeframeDescription(filters.timeframe || "1D")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeframeDescription(timeframe) {
  const descriptions = {
    "1M": "Ultra-fast scalping - Quick entries and exits within minutes",
    "3M": "Rapid scalping opportunities - Very short-term momentum plays",
    "5M": "Fast scalping setups - Quick profit opportunities",
    "15M": "Short-term scalping - Multiple trades per hour",
    "30M": "Intraday momentum - Hold for 30 minutes to few hours",
    "1H": "Intraday scalping opportunities - Very short-term trades",
    "4H": "Short-term swing trades - Hold for few hours to days", 
    "1D": "Daily momentum plays - Hold for days to weeks",
    "1W": "Weekly trend following - Medium-term positions",
    "1MO": "Monthly breakouts - Position trading opportunities",
    "3MO": "Quarterly trends - Long-term position building",
    "6MO": "Semi-annual analysis - Investment grade opportunities",
    "1Y": "Annual trends - Long-term investment picks"
  };
  return descriptions[timeframe] || "Daily analysis for swing trading";
}