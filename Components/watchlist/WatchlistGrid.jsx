import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Bell, BellOff, Target } from "lucide-react";

export default function WatchlistGrid({ items, isLoading, onRemove }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Assets in Watchlist</h3>
          <p className="text-slate-500">
            Start adding your favorite stocks and crypto to track them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card 
          key={item.id}
          className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{item.asset_symbol}</h3>
                <p className="text-sm text-slate-600 truncate">{item.asset_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${
                  item.asset_type === 'stock' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {item.asset_type === 'stock' ? 'Stock' : 'Crypto'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {item.target_price && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Target Price
                  </span>
                  <span className="font-semibold">
                    {item.asset_type === 'stock' ? '₹' : '$'}{item.target_price.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  {item.alert_enabled ? (
                    <Bell className="w-3 h-3 text-green-500" />
                  ) : (
                    <BellOff className="w-3 h-3 text-slate-400" />
                  )}
                  Alerts
                </span>
                <span className={`font-medium ${item.alert_enabled ? 'text-green-600' : 'text-slate-400'}`}>
                  {item.alert_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {item.notes && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-700">{item.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white/50 hover:bg-white/70 border-white/20"
              >
                View Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}