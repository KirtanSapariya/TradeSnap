import React, { useState, useEffect } from "react";
import { Analysis } from "@/entities/Analysis";
import { Watchlist } from "@/entities/Watchlist";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Eye, 
  Zap, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Camera,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MarketOverview from "../components/dashboard/MarketOverview";
import RecentAnalyses from "../components/dashboard/RecentAnalyses";
import QuickActions from "../components/dashboard/QuickActions";
import TradingStats from "../components/dashboard/TradingStats";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const recentAnalyses = await Analysis.filter(
        { created_by: currentUser.email }, 
        '-created_date', 
        10
      );
      setAnalyses(recentAnalyses);

      const watchlistItems = await Watchlist.filter(
        { created_by: currentUser.email }
      );
      setWatchlistCount(watchlistItems.length);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome to TradeSnap
            </h1>
            <p className="text-slate-600 text-lg">
              AI-powered trading signals and market analysis at your fingertips
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            <Eye className="w-5 h-5 mr-2" />
            Start Trading with AI
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome back, {user.full_name?.split(' ')[0] || 'Trader'}
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Your AI trading assistant is ready. Let's analyze the markets.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to={createPageUrl("ChartAnalyzer")}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Analyze Chart
                </Button>
              </Link>
              <Link to={createPageUrl("AssetScreener")}>
                <Button variant="outline" className="bg-white/50 hover:bg-white/70 border-white/20">
                  <Search className="w-4 h-4 mr-2" />
                  Screen Assets
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <MarketOverview />

        {/* Quick Stats */}
        <TradingStats 
          analysesCount={analyses.length}
          watchlistCount={watchlistCount}
          isLoading={isLoading}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Analyses */}
        <RecentAnalyses 
          analyses={analyses}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}