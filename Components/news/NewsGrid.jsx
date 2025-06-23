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
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import { Watchlist } from "@/entities/Watchlist";

export default function NewsGrid({ signals, isLoading }) {
  const addToWatchlist = async (signal) => {
    try {
      await Watchlist.create({
        asset_symbol: signal.asset_symbol,
        asset_name: signal.asset_name,
        asset_type: signal.asset_symbol.includes('/') ? 'crypto' : 'stock',
        target_price: signal.take_profit,
        alert_enabled: true,
        notes: `News signal: ${signal.news_headline.substring(0, 100)}...`
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Analyzing Market News...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (signals.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-12 text-center">
          <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No News Signals</h3>
          <p className="text-slate-500">
            Click refresh to analyze the latest market-moving news
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Market News Signals ({signals.length})</span>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {signals.map((signal) => (
            <div
              key={signal.id}
              className="group p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{signal.asset_symbol}</h3>
                  <p className="text-sm text-slate-600">{signal.asset_name}</p>
                </div>
                <div className="text-right">
                  <Badge className={`mb-2 ${
                    signal.direction === 'BUY' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {signal.direction === 'BUY' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {signal.direction}
                  </Badge>
                  <Badge variant="outline" className={`block text-xs ${
                    signal.sentiment?.includes('Positive')
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {signal.sentiment}
                  </Badge>
                </div>
              </div>

              {/* News Headline */}
              <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {signal.news_headline}
                </p>
              </div>

              {/* Trading Levels */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Entry
                  </span>
                  <span className="font-semibold">
                    ${signal.entry_price?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Target
                  </span>
                  <span className="font-semibold text-green-700">
                    ${signal.take_profit?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-red-600 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Stop Loss
                  </span>
                  <span className="font-semibold text-red-700">
                    ${signal.stop_loss?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <div className="text-center">
                  <p className="text-slate-500">Confidence</p>
                  <p className="font-bold text-slate-900">{signal.confidence_score || 75}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">R:R Ratio</p>
                  <p className="font-bold text-slate-900">1:{signal.risk_reward_ratio?.toFixed(1) || '2.5'}</p>
                </div>
                {signal.forecast_return && (
                  <div className="text-center">
                    <p className="text-slate-500">Expected</p>
                    <p className={`font-bold ${
                      signal.forecast_return > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {signal.forecast_return > 0 ? '+' : ''}{signal.forecast_return.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => addToWatchlist(signal)}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/50 hover:bg-white/70 border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}