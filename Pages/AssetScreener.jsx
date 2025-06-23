import React, { useState, useEffect } from "react";
import { Analysis } from "@/entities/Analysis";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Target,
  DollarSign,
  BarChart3
} from "lucide-react";

import ScreeningResults from "../components/screener/ScreeningResults";
import ScreeningFilters from "../components/screener/ScreeningFilters";

export default function AssetScreener() {
  const [user, setUser] = useState(null);
  const [screeningResults, setScreeningResults] = useState([]);
  const [isScreening, setIsScreening] = useState(false);
  const [activeTab, setActiveTab] = useState("stocks");
  const [filters, setFilters] = useState({
    market_cap: "all",
    sector: "all",
    price_range: "all",
    timeframe: "1D"
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      runScreening("stocks");
    } catch (error) {
      setUser(null);
    }
  };

  const runScreening = async (assetType = activeTab) => {
    if (!user) return;

    setIsScreening(true);
    setError(null);
    try {
      const timeframeContext = getTimeframeAnalysisContext(filters.timeframe);

      const screeningPrompt = `
        You are a professional market analyst. Analyze ${assetType === 'stocks' ? 'Indian NSE stocks' : 'cryptocurrencies'} for valuation opportunities based on ${filters.timeframe} timeframe.

        TIMEFRAME ANALYSIS: ${timeframeContext}

        CRITICAL REQUIREMENTS:
        1. Use real current market prices
        2. Analyze price action on ${filters.timeframe} charts
        3. Apply timeframe-appropriate technical indicators
        4. Identify assets with clear setups for the selected timeframe
        5. Provide entry/exit strategies suitable for ${filters.timeframe} trading

        ${assetType === 'stocks' ? `
        FOCUS ON NSE STOCKS with real current prices:
        - Large Cap: RELIANCE, TCS, INFY, HDFC, ICICIBANK, SBIN, LT, HCLTECH, WIPRO, ITC
        - Mid Cap: BAJFINANCE, ASIANPAINT, MARUTI, SUNPHARMA, NESTLEIND
        ` : `
        FOCUS ON MAJOR CRYPTOCURRENCIES with real current prices:
        - Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Cardano (ADA)
        - Solana (SOL), Polygon (MATIC), Chainlink (LINK), Polkadot (DOT)
        `}

        TIMEFRAME-SPECIFIC ANALYSIS:
        - ${filters.timeframe} chart patterns and setups
        - Appropriate stop-loss and take-profit levels for ${filters.timeframe}
        - Volume analysis on ${filters.timeframe} basis
        - Support/resistance levels relevant to ${filters.timeframe}
        - Risk-reward ratios suitable for ${filters.timeframe} holds

        Find 5-6 UNDERPRICED and 5-6 OVERPRICED assets with:
        - Real current market prices
        - Clear ${filters.timeframe} setups
        - Timeframe-appropriate trade durations
        - Proper risk management for ${filters.timeframe}
      `;
      
      const screeningSchema = {
        type: "object",
        properties: {
          timeframe_analysis: {
            type: "string",
            description: "Summary of timeframe-specific market conditions"
          },
          underpriced_opportunities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                asset_symbol: { type: "string" },
                asset_name: { type: "string" },
                current_price: { type: "number", description: "Real current market price" },
                fair_value_estimate: { type: "number" },
                discount_percentage: { type: "number" },
                direction: { type: "string", enum: ["BUY"] },
                entry_price: { type: "number" },
                target_price: { type: "number" },
                stop_loss: { type: "number" },
                confidence_score: { type: "number", minimum: 0, maximum: 100 },
                upside_potential: { type: "number" },
                underpriced_reason: { type: "string" },
                timeframe_setup: { type: "string", description: "Why this setup works for the selected timeframe" },
                expected_duration: { type: "string", description: "Expected trade duration for this timeframe" },
                risk_level: { type: "string", enum: ["LOW", "MEDIUM"] },
                technical_analysis: {
                  type: "object",
                  properties: {
                    rsi: { type: "number" },
                    support_level: { type: "number" },
                    resistance_level: { type: "number" },
                    volume_trend: { type: "string" },
                    pattern: { type: "string", description: "Chart pattern on selected timeframe" }
                  }
                }
              },
              required: ["asset_symbol", "current_price", "underpriced_reason", "timeframe_setup"]
            }
          },
          overpriced_warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                asset_symbol: { type: "string" },
                asset_name: { type: "string" },
                current_price: { type: "number", description: "Real current market price" },
                fair_value_estimate: { type: "number" },
                premium_percentage: { type: "number" },
                direction: { type: "string", enum: ["SELL"] },
                entry_price: { type: "number" },
                target_price: { type: "number" },
                stop_loss: { type: "number" },
                confidence_score: { type: "number", minimum: 0, maximum: 100 },
                downside_risk: { type: "number" },
                overpriced_reason: { type: "string" },
                timeframe_setup: { type: "string", description: "Why this setup works for the selected timeframe" },
                expected_duration: { type: "string", description: "Expected trade duration for this timeframe" },
                risk_level: { type: "string", enum: ["MEDIUM", "HIGH"] },
                technical_analysis: {
                  type: "object",
                  properties: {
                    rsi: { type: "number" },
                    support_level: { type: "number" },
                    resistance_level: { type: "number" },
                    volume_trend: { type: "string" },
                    pattern: { type: "string", description: "Chart pattern on selected timeframe" }
                  }
                }
              },
              required: ["asset_symbol", "current_price", "overpriced_reason", "timeframe_setup"]
            }
          }
        },
        required: ["underpriced_opportunities", "overpriced_warnings"]
      };

      const result = await InvokeLLM({
        prompt: screeningPrompt,
        add_context_from_internet: true,
        response_json_schema: screeningSchema
      });

      console.log("Market screening result:", result);

      const processedResults = [];

      // Process UNDERPRICED assets
      if (result.underpriced_opportunities) {
        for (const asset of result.underpriced_opportunities) {
          const analysisData = {
            type: "value_screening",
            asset_symbol: asset.asset_symbol,
            asset_name: asset.asset_name,
            direction: "BUY",
            entry_price: asset.entry_price,
            take_profit: asset.target_price,
            stop_loss: asset.stop_loss,
            confidence_score: asset.confidence_score || 75,
            forecast_return: asset.upside_potential,
            swing_potential: "HIGH",
            technical_indicators: asset.technical_analysis || {},
            chart_patterns: ["UNDERVALUED", filters.timeframe + "_SETUP"]
          };

          const saved = await Analysis.create(analysisData);
          processedResults.push({
            ...saved,
            category: "UNDERPRICED",
            current_price: asset.current_price,
            fair_value: asset.fair_value_estimate,
            valuation_gap: asset.discount_percentage,
            valuation_reason: asset.underpriced_reason,
            timeframe_setup: asset.timeframe_setup,
            expected_duration: asset.expected_duration,
            opportunity_type: "BUY_OPPORTUNITY",
            risk_level: asset.risk_level || "MEDIUM",
            potential_return: asset.upside_potential,
            timeframe: filters.timeframe
          });
        }
      }

      // Process OVERPRICED assets
      if (result.overpriced_warnings) {
        for (const asset of result.overpriced_warnings) {
          const analysisData = {
            type: "value_screening",
            asset_symbol: asset.asset_symbol,
            asset_name: asset.asset_name,
            direction: "SELL",
            entry_price: asset.entry_price,
            take_profit: asset.target_price,
            stop_loss: asset.stop_loss,
            confidence_score: asset.confidence_score || 75,
            forecast_return: -Math.abs(asset.downside_risk || 0),
            swing_potential: "HIGH",
            technical_indicators: asset.technical_analysis || {},
            chart_patterns: ["OVERVALUED", filters.timeframe + "_SETUP"]
          };

          const saved = await Analysis.create(analysisData);
          processedResults.push({
            ...saved,
            category: "OVERPRICED",
            current_price: asset.current_price,
            fair_value: asset.fair_value_estimate,
            valuation_gap: asset.premium_percentage,
            valuation_reason: asset.overpriced_reason,
            timeframe_setup: asset.timeframe_setup,
            expected_duration: asset.expected_duration,
            opportunity_type: "SELL_OPPORTUNITY",
            risk_level: asset.risk_level || "HIGH",
            potential_return: -Math.abs(asset.downside_risk || 0),
            timeframe: filters.timeframe
          });
        }
      }

      setScreeningResults(processedResults);

      console.log(`Market screening complete: ${processedResults.filter(r => r.category === 'UNDERPRICED').length} underpriced, ${processedResults.filter(r => r.category === 'OVERPRICED').length} overpriced assets found`);

    } catch (error) {
      console.error("Market screening error:", error);
      setError("Failed to fetch market data. Please try again.");
    }
    setIsScreening(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Search className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Asset Screener
            </h1>
            <p className="text-slate-600 text-lg">
              Please log in to access AI-powered asset screening
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            Login to Screen
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI Asset Screener
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Discover underpriced and overpriced opportunities across different timeframes
            </p>
          </div>
          <Button
            onClick={() => runScreening()}
            disabled={isScreening}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
          >
            {isScreening ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Scanning {filters.timeframe}...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5 mr-2" />
                Scan {filters.timeframe} Timeframe
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="stocks" className="text-lg py-3">
              NSE Stocks
            </TabsTrigger>
            <TabsTrigger value="crypto" className="text-lg py-3">
              Cryptocurrencies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="space-y-6">
            <ScreeningFilters filters={filters} setFilters={setFilters} assetType="stocks" />
            <ScreeningResults
              results={screeningResults.filter(r => r.asset_symbol && !r.asset_symbol.includes('/'))}
              isLoading={isScreening}
              assetType="stocks"
              timeframe={filters.timeframe}
            />
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <ScreeningFilters filters={filters} setFilters={setFilters} assetType="crypto" />
            <ScreeningResults
              results={screeningResults.filter(r => r.asset_symbol && (r.asset_symbol.includes('/') || r.asset_symbol.length <= 5))}
              isLoading={isScreening}
              assetType="crypto"
              timeframe={filters.timeframe}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper function for timeframe context
function getTimeframeAnalysisContext(timeframe) {
  const contexts = {
    "1M": "Ultra-high frequency analysis - Focus on instant momentum, tick-by-tick price action, and very tight stops. Best for experienced scalpers with fast execution.",
    "3M": "Rapid scalping analysis - Quick momentum plays, breakout patterns, and immediate reversals. Requires constant monitoring and fast decision making.",
    "5M": "Fast scalping setups - Short-term momentum bursts, quick support/resistance breaks, and rapid profit-taking opportunities.",
    "15M": "Short-term momentum analysis - Intraday patterns, quick trend changes, and scalping opportunities with slightly wider stops.",
    "30M": "Intraday swing analysis - 30-minute chart patterns, momentum shifts good for holding few hours within the trading day.",
    "1H": "Focus on scalping opportunities, quick momentum plays, and intraday volatility. Look for breakouts and reversals with tight stops.",
    "4H": "Analyze short-term swing setups, 4-hour chart patterns, and momentum shifts. Good for day to multi-day holds.",
    "1D": "Daily momentum analysis, swing trading setups, and trend continuation patterns. Suitable for multi-day to weekly holds.",
    "1W": "Weekly trend analysis, major support/resistance levels, and position trading opportunities. Focus on weekly chart patterns.",
    "1MO": "Monthly breakouts, long-term trend analysis, and investment-grade opportunities. Look for major trend changes.",
    "3MO": "Quarterly trend analysis, earnings impact, and medium-term position building opportunities.",
    "6MO": "Semi-annual analysis, seasonal patterns, and long-term investment opportunities with fundamental backing.",
    "1Y": "Annual trend analysis, long-term investment picks, and major cycle analysis. Focus on fundamental value."
  };
  return contexts[timeframe] || "Daily analysis for swing trading opportunities";
}