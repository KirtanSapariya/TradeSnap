import React, { useState, useEffect } from "react";
import { Analysis } from "@/entities/Analysis";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Newspaper, TrendingUp } from "lucide-react";

import NewsGrid from "../components/news/NewsGrid";
import NewsStats from "../components/news/NewsStats";

export default function NewsSignals() {
  const [user, setUser] = useState(null);
  const [newsSignals, setNewsSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      loadNewsSignals();
    } catch (error) {
      setUser(null);
    }
  };

  const loadNewsSignals = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newsPrompt = `
        Analyze recent market-moving news and identify stocks/crypto with strong momentum based on news sentiment.
        
        Focus on:
        1. Breaking news affecting specific companies or cryptocurrencies
        2. Earnings announcements, product launches, regulatory news
        3. Major partnerships, acquisitions, or strategic moves
        4. Market sentiment analysis from news headlines
        5. Volume and price reaction to news events
        
        Identify 8-10 assets with:
        - Clear news catalyst driving price movement
        - Strong sentiment (positive or negative)
        - Actionable trading opportunities
        - Entry/exit levels based on technical analysis
        
        For each provide:
        - News headline summary
        - Sentiment analysis (Very Positive, Positive, Negative, Very Negative)
        - Trading recommendation with levels
        - Confidence based on news impact and technical setup
      `;

      const newsSchema = {
        type: "object",
        properties: {
          news_signals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                asset_symbol: { type: "string" },
                asset_name: { type: "string" },
                news_headline: { type: "string" },
                sentiment: { type: "string", enum: ["Very Positive", "Positive", "Negative", "Very Negative"] },
                direction: { type: "string", enum: ["BUY", "SELL"] },
                entry_price: { type: "number" },
                take_profit: { type: "number" },
                stop_loss: { type: "number" },
                risk_reward_ratio: { type: "number" },
                confidence_score: { type: "number", minimum: 0, maximum: 100 },
                forecast_return: { type: "number" },
                time_horizon: { type: "string", enum: ["SHORT", "MEDIUM", "LONG"] },
                technical_indicators: {
                  type: "object",
                  properties: {
                    volume: { type: "string" },
                    sentiment: { type: "string" }
                  }
                }
              },
              required: ["asset_symbol", "news_headline", "sentiment", "direction"]
            }
          }
        },
        required: ["news_signals"]
      };

      const result = await InvokeLLM({
        prompt: newsPrompt,
        add_context_from_internet: true,
        response_json_schema: newsSchema
      });

      // Save to database
      const savedSignals = [];
      for (const signal of result.news_signals) {
        const analysisData = {
          type: "news_sentiment",
          asset_symbol: signal.asset_symbol,
          asset_name: signal.asset_name,
          direction: signal.direction,
          entry_price: signal.entry_price,
          take_profit: signal.take_profit,
          stop_loss: signal.stop_loss,
          risk_reward_ratio: signal.risk_reward_ratio || 2.5,
          confidence_score: signal.confidence_score || 75,
          news_headline: signal.news_headline,
          forecast_return: signal.forecast_return,
          technical_indicators: signal.technical_indicators || {},
          chart_patterns: [signal.sentiment]
        };

        const saved = await Analysis.create(analysisData);
        savedSignals.push({
          ...saved,
          sentiment: signal.sentiment,
          time_horizon: signal.time_horizon || "MEDIUM"
        });
      }

      setNewsSignals(savedSignals);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading news signals:", error);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              News Signals
            </h1>
            <p className="text-slate-600 text-lg">
              Please log in to access AI-powered news sentiment analysis
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            Login to View Signals
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
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                News-Based Signals
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Market-moving news with AI-powered sentiment analysis and trade signals
            </p>
            {lastUpdated && (
              <p className="text-sm text-slate-500 mt-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={loadNewsSignals}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Analyzing News...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Refresh Signals
              </>
            )}
          </Button>
        </div>

        <NewsStats signals={newsSignals} />
        <NewsGrid signals={newsSignals} isLoading={isLoading} />
      </div>
    </div>
  );
}