
import React, { useState, useEffect } from "react";
import { Analysis } from "@/entities/Analysis";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  RefreshCw, 
  Activity, 
  Volume2,
  Clock,
  Target
} from "lucide-react";

import MoversGrid from "../../components/movers/MoversGrid";
import MoversStats from "../../components/movers/MoversStats";

export default function TopMovers() {
  const [user, setUser] = useState(null);
  const [movers, setMovers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("stocks");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      // Auto-load top movers
      loadTopMovers("stocks");
    } catch (error) {
      setUser(null);
    }
  };

  const loadTopMovers = async (assetType = activeTab) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const moversPrompt = `
        Identify today's top 10 ${assetType === 'stocks' ? 'NSE stock' : 'cryptocurrency'} movers with high volume and liquidity.
        
        CRITICAL: Use REAL current market prices and actual trading data from today.
        
        Focus on:
        1. Assets with significant price movement (>3% change)
        2. High trading volume (above average)
        3. Strong liquidity and market depth
        4. Clear technical setups for swing trading
        5. Momentum continuation potential
        6. ACTUAL current market prices (not estimates)
        
        For each asset provide:
        - Real current market price
        - Actual % change from previous day
        - Volume analysis (above/below average)
        - Entry price for swing trade based on technical analysis
        - Take profit and stop loss levels
        - Swing potential rating
        - Confidence score based on setup quality
        - Risk-reward ratio
        
        Prioritize assets with clean breakouts, strong volume, and favorable risk-reward setups.
        All prices must be realistic and reflect current market conditions.
      `;

      const moversSchema = {
        type: "object",
        properties: {
          top_movers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                asset_symbol: { type: "string" },
                asset_name: { type: "string" },
                current_price: { type: "number", description: "Real current market price" },
                price_change_percent: { type: "number", description: "Actual % change today" },
                direction: { type: "string", enum: ["BUY", "SELL"] },
                entry_price: { type: "number" },
                take_profit: { type: "number" },
                stop_loss: { type: "number" },
                risk_reward_ratio: { type: "number" },
                confidence_score: { type: "number", minimum: 0, maximum: 100 },
                swing_potential: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
                volume_status: { type: "string", enum: ["HIGH", "VERY_HIGH", "AVERAGE"] },
                volume_change_percent: { type: "number", description: "Volume change vs average" },
                technical_indicators: {
                  type: "object",
                  properties: {
                    rsi: { type: "number" },
                    volume: { type: "string" },
                    sentiment: { type: "string" }
                  }
                }
              },
              required: ["asset_symbol", "current_price", "price_change_percent", "direction"]
            }
          }
        },
        required: ["top_movers"]
      };

      const result = await InvokeLLM({
        prompt: moversPrompt,
        add_context_from_internet: true,
        response_json_schema: moversSchema
      });

      // Save to database and update state
      const savedMovers = [];
      for (const mover of result.top_movers) {
        const analysisData = {
          type: "asset_screening",
          asset_symbol: mover.asset_symbol,
          asset_name: mover.asset_name,
          direction: mover.direction,
          entry_price: mover.entry_price,
          take_profit: mover.take_profit,
          stop_loss: mover.stop_loss,
          risk_reward_ratio: mover.risk_reward_ratio || 2.5,
          confidence_score: mover.confidence_score || 75,
          swing_potential: mover.swing_potential || "MEDIUM",
          technical_indicators: mover.technical_indicators || {},
          chart_patterns: ["High Volume", "Momentum"]
        };

        const saved = await Analysis.create(analysisData);
        savedMovers.push({
          ...saved,
          current_price: mover.current_price,
          price_change_percent: mover.price_change_percent,
          volume_status: mover.volume_status || "HIGH",
          volume_change_percent: mover.volume_change_percent || 0
        });
      }

      setMovers(savedMovers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading top movers:", error);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Top Movers
            </h1>
            <p className="text-slate-600 text-lg">
              Please log in to access today's high-volume trading opportunities
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            Login to View Movers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Top Movers Today
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              High-volume opportunities with strong momentum signals
            </p>
            {lastUpdated && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          <Button
            onClick={() => loadTopMovers()}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Refresh Movers
              </>
            )}
          </Button>
        </div>

        <MoversStats movers={movers} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="stocks" className="text-lg py-3" onClick={() => loadTopMovers("stocks")}>
              NSE Stocks
            </TabsTrigger>
            <TabsTrigger value="crypto" className="text-lg py-3" onClick={() => loadTopMovers("crypto")}>
              Cryptocurrencies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="space-y-6">
            <MoversGrid 
              movers={movers.filter(m => !m.asset_symbol.includes('/'))} 
              isLoading={isLoading}
              assetType="stocks"
            />
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <MoversGrid 
              movers={movers.filter(m => m.asset_symbol.includes('/') || m.asset_symbol.length <= 5)} 
              isLoading={isLoading}
              assetType="crypto"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
