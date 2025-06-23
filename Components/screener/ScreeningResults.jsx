
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Plus,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
  Clock
} from "lucide-react";
import { Watchlist } from "@/entities/Watchlist";

export default function ScreeningResults({ results, isLoading, assetType, timeframe }) {
  const addToWatchlist = async (asset) => {
    try {
      await Watchlist.create({
        asset_symbol: asset.asset_symbol,
        asset_name: asset.asset_name,
        asset_type: assetType === 'stocks' ? 'stock' : 'crypto',
        target_price: asset.take_profit,
        alert_enabled: true,
        notes: `${asset.category} - ${asset.opportunity_type} at ${assetType === 'stocks' ? '₹' : '$'}${asset.current_price?.toFixed(2)} for ${timeframe} timeframe.`
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Analyzing {timeframe} Timeframe Assets...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No {timeframe} Opportunities Found</h3>
          <p className="text-slate-500">
            Try different timeframe or run a new scan to find opportunities
          </p>
        </CardContent>
      </Card>
    );
  }

  // Separate assets by category
  const underpriced = results.filter(r => r.category === 'UNDERPRICED');
  const overpriced = results.filter(r => r.category === 'OVERPRICED');

  return (
    <div className="space-y-8">
      {/* Timeframe Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-indigo-800 mb-1">
                {timeframe} Timeframe Analysis
              </h3>
              <p className="text-indigo-600 text-sm">
                {getTimeframeDescription(timeframe)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-900">{results.length}</div>
              <div className="text-sm text-indigo-600">Opportunities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-green-800">{underpriced.length}</h3>
            <p className="text-green-600 font-medium">Underpriced Assets</p>
            <p className="text-green-500 text-sm">{timeframe} Buy Setups</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-red-800">{overpriced.length}</h3>
            <p className="text-red-600 font-medium">Overpriced Assets</p>
            <p className="text-red-500 text-sm">{timeframe} Sell Setups</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-blue-800">{timeframe}</h3>
            <p className="text-blue-600 font-medium">Selected Timeframe</p>
            <p className="text-blue-500 text-sm">Analysis Period</p>
          </CardContent>
        </Card>
      </div>

      {/* UNDERPRICED ASSETS - Buy Opportunities */}
      {underpriced.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-3 text-green-800">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Underpriced Assets - {timeframe} Buy Opportunities</h2>
                <p className="text-green-600 text-sm font-normal">Assets with strong {timeframe} buy setups</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {underpriced.map((asset) => (
                <UnderPricedCard 
                  key={asset.id} 
                  asset={asset} 
                  assetType={assetType} 
                  timeframe={timeframe}
                  onAddToWatchlist={addToWatchlist}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* OVERPRICED ASSETS - Sell Opportunities */}
      {overpriced.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200">
            <CardTitle className="flex items-center gap-3 text-red-800">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Overpriced Assets - {timeframe} Sell Opportunities</h2>
                <p className="text-red-600 text-sm font-normal">Assets with strong {timeframe} sell setups</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overpriced.map((asset) => (
                <OverPricedCard 
                  key={asset.id} 
                  asset={asset} 
                  assetType={assetType} 
                  timeframe={timeframe}
                  onAddToWatchlist={addToWatchlist}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Underpriced Asset Card
function UnderPricedCard({ asset, assetType, timeframe, onAddToWatchlist }) {
  return (
    <div className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{asset.asset_symbol}</h3>
          <p className="text-sm text-slate-600 truncate">{asset.asset_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {timeframe}
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              BUY
            </Badge>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="space-y-3 mb-4">
        <div className="p-3 rounded-lg bg-white border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Current Price</span>
            <span className="text-lg font-bold text-slate-900">
              {assetType === 'stocks' ? '₹' : '$'}{asset.current_price?.toFixed(2)}
            </span>
          </div>
          {asset.fair_value && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fair Value</span>
              <span className="text-sm font-semibold text-green-700">
                {assetType === 'stocks' ? '₹' : '$'}{asset.fair_value?.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {asset.valuation_gap && (
          <div className="p-3 rounded-lg bg-green-100 border border-green-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Discount</span>
              </div>
              <span className="text-xl font-bold text-green-800">
                {asset.valuation_gap?.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trading Levels */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Entry
          </span>
          <span className="font-semibold text-green-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.entry_price?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Target
          </span>
          <span className="font-semibold text-green-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.take_profit?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Stop Loss
          </span>
          <span className="font-semibold text-slate-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.stop_loss?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Timeframe Setup */}
      {asset.timeframe_setup && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
          <p className="text-xs text-blue-800">
            <strong>{timeframe} Setup:</strong> {asset.timeframe_setup}
          </p>
          {asset.expected_duration && (
            <p className="text-xs text-blue-600 mt-1">
              <strong>Duration:</strong> {asset.expected_duration}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="text-center">
          <p className="text-slate-500">Upside</p>
          <p className="font-bold text-green-600">
            +{asset.potential_return?.toFixed(1) || '0'}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500">Confidence</p>
          <p className="font-bold text-slate-900">{asset.confidence_score || 75}%</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500">Risk</p>
          <Badge variant="outline" className="text-xs text-green-700 border-green-300">
            {asset.risk_level || 'MED'}
          </Badge>
        </div>
      </div>

      {/* Reason */}
      <div className="p-3 rounded-lg bg-white border border-green-200 mb-4">
        <p className="text-xs text-slate-700">
          <strong>Why underpriced:</strong> {asset.valuation_reason}
        </p>
      </div>

      <Button
        onClick={() => onAddToWatchlist(asset)}
        className="w-full bg-green-500 hover:bg-green-600 text-white"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {timeframe} Buy Setup
      </Button>
    </div>
  );
}

// Overpriced Asset Card
function OverPricedCard({ asset, assetType, timeframe, onAddToWatchlist }) {
  return (
    <div className="group p-6 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{asset.asset_symbol}</h3>
          <p className="text-sm text-slate-600 truncate">{asset.asset_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {timeframe}
            </Badge>
            <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              SELL
            </Badge>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="space-y-3 mb-4">
        <div className="p-3 rounded-lg bg-white border border-red-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Current Price</span>
            <span className="text-lg font-bold text-slate-900">
              {assetType === 'stocks' ? '₹' : '$'}{asset.current_price?.toFixed(2)}
            </span>
          </div>
          {asset.fair_value && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fair Value</span>
              <span className="text-sm font-semibold text-red-700">
                {assetType === 'stocks' ? '₹' : '$'}{asset.fair_value?.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {asset.valuation_gap && (
          <div className="p-3 rounded-lg bg-red-100 border border-red-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Premium</span>
              </div>
              <span className="text-xl font-bold text-red-800">
                {asset.valuation_gap?.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trading Levels */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Entry
          </span>
          <span className="font-semibold text-red-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.entry_price?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-red-600 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Target
          </span>
          <span className="font-semibold text-red-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.take_profit?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Stop Loss
          </span>
          <span className="font-semibold text-slate-700">
            {assetType === 'stocks' ? '₹' : '$'}{asset.stop_loss?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Timeframe Setup */}
      {asset.timeframe_setup && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
          <p className="text-xs text-blue-800">
            <strong>{timeframe} Setup:</strong> {asset.timeframe_setup}
          </p>
          {asset.expected_duration && (
            <p className="text-xs text-blue-600 mt-1">
              <strong>Duration:</strong> {asset.expected_duration}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="text-center">
          <p className="text-slate-500">Downside</p>
          <p className="font-bold text-red-600">
            {asset.potential_return?.toFixed(1) || '0'}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500">Confidence</p>
          <p className="font-bold text-slate-900">{asset.confidence_score || 75}%</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500">Risk</p>
          <Badge variant="outline" className="text-xs text-red-700 border-red-300">
            {asset.risk_level || 'HIGH'}
          </Badge>
        </div>
      </div>

      {/* Reason */}
      <div className="p-3 rounded-lg bg-white border border-red-200 mb-4">
        <p className="text-xs text-slate-700">
          <strong>Why overpriced:</strong> {asset.valuation_reason}
        </p>
      </div>

      <Button
        onClick={() => onAddToWatchlist(asset)}
        variant="outline"
        className="w-full border-red-300 text-red-700 hover:bg-red-50"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {timeframe} Sell Setup
      </Button>
    </div>
  );
}

function getTimeframeDescription(timeframe) {
  const descriptions = {
    "1M": "Ultra-fast scalping and tick analysis",
    "3M": "Rapid scalping opportunities", 
    "5M": "Fast scalping setups",
    "15M": "Short-term momentum plays",
    "30M": "Intraday swing opportunities",
    "1H": "Scalping and intraday opportunities",
    "4H": "Short-term swing trades", 
    "1D": "Daily momentum and swing setups",
    "1W": "Weekly trend and position trades",
    "1MO": "Monthly breakouts and trends",
    "3MO": "Quarterly investment opportunities",
    "6MO": "Semi-annual position building",
    "1Y": "Annual investment analysis"
  };
  return descriptions[timeframe] || "Market analysis";
}
