import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketOverview() {
  const marketData = [
    {
      name: "NIFTY 50",
      value: "22,500.45",
      change: "+1.2%",
      trend: "up",
      color: "text-green-600"
    },
    {
      name: "SENSEX",
      value: "74,205.30",
      change: "+0.8%", 
      trend: "up",
      color: "text-green-600"
    },
    {
      name: "BTC/USD",
      value: "$43,250",
      change: "-2.1%",
      trend: "down", 
      color: "text-red-600"
    },
    {
      name: "USD/INR",
      value: "83.25",
      change: "+0.3%",
      trend: "up",
      color: "text-green-600"
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Activity className="w-6 h-6 text-blue-500" />
          Live Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketData.map((market) => (
            <div key={market.name} className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <h3 className="font-semibold text-slate-700 text-sm mb-1">{market.name}</h3>
              <p className="text-xl font-bold text-slate-900 mb-1">{market.value}</p>
              <div className="flex items-center justify-center gap-1">
                {market.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${market.color}`}>
                  {market.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}