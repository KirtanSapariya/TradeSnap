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
  Volume2,
  Plus,
  Zap
} from "lucide-react";
import { Watchlist } from "@/entities/Watchlist";

export default function MoversGrid({ movers, isLoading, assetType }) {
  const addToWatchlist = async (mover) => {
    try {
      await Watchlist.create({
        asset_symbol: mover.asset_symbol,
        asset_name: mover.asset_name,
        asset_type: assetType === 'stocks' ? 'stock' : 'crypto',
        target_price: mover.take_profit,
        alert_enabled: true,
        notes: `Top mover - ${mover.direction} signal with ${mover.swing_potential} potential`
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Loading Top Movers...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (movers.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-12 text-center">
          <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Movers Found</h3>
          <p className="text-slate-500">
            Click refresh to scan for today's top market movers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Today's Top Movers ({movers.length})</span>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movers.map((mover) => (
            <div
              key={mover.id}
              className="group p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{mover.asset_symbol}</h3>
                  <p className="text-sm text-slate-600 truncate">{mover.asset_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-slate-900">
                      {assetType === 'stocks' ? '₹' : '$'}{mover.current_price?.toFixed(2)}
                    </p>
                    <Badge className={`text-xs ${
                      (mover.price_change_percent || 0) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(mover.price_change_percent || 0) > 0 ? '+' : ''}
                      {mover.price_change_percent?.toFixed(1) || '0.0'}%
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`mb-2 ${
                    mover.direction === 'BUY' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mover.direction === 'BUY' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {mover.direction}
                  </Badge>
                  {mover.volume_status && (
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <Volume2 className="w-3 h-3" />
                      {mover.volume_status}
                    </div>
                  )}
                </div>
              </div>

              {/* Trading Levels */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Entry
                  </span>
                  <span className="font-semibold">
                    {assetType === 'stocks' ? '₹' : '$'}{mover.entry_price?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Target
                  </span>
                  <span className="font-semibold text-green-700">
                    {assetType === 'stocks' ? '₹' : '$'}{mover.take_profit?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-red-600 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Stop Loss
                  </span>
                  <span className="font-semibold text-red-700">
                    {assetType === 'stocks' ? '₹' : '$'}{mover.stop_loss?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <div className="text-center">
                  <p className="text-slate-500">Swing</p>
                  <Badge variant="outline" className={`text-xs ${
                    mover.swing_potential === 'HIGH' 
                      ? 'bg-red-50 text-red-700' 
                      : mover.swing_potential === 'MEDIUM'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Zap className="w-2 h-2 mr-1" />
                    {mover.swing_potential || 'MED'}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">Confidence</p>
                  <p className="font-bold text-slate-900">{mover.confidence_score || 75}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">R:R</p>
                  <p className="font-bold text-slate-900">1:{mover.risk_reward_ratio?.toFixed(1) || '2.5'}</p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => addToWatchlist(mover)}
                variant="outline"
                size="sm"
                className="w-full bg-white/50 hover:bg-white/70 border-white/20 group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}