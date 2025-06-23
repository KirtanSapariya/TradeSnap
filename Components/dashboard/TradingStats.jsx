import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Star, Target, Zap } from "lucide-react";

export default function TradingStats({ analysesCount, watchlistCount, isLoading }) {
  const stats = [
    {
      title: "Total Analyses",
      value: analysesCount,
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-500",
      description: "Charts analyzed"
    },
    {
      title: "Watchlist Items", 
      value: watchlistCount,
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      description: "Assets tracked"
    },
    {
      title: "Success Rate",
      value: "87%",
      icon: Target,
      gradient: "from-green-500 to-emerald-500", 
      description: "AI accuracy"
    },
    {
      title: "Signals Today",
      value: "12",
      icon: Zap,
      gradient: "from-purple-500 to-pink-500",
      description: "Trade opportunities"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : stat.value}
              </p>
              <p className="text-sm font-medium text-slate-700">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}