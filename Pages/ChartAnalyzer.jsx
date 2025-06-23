import React, { useState, useRef } from "react";
import { Analysis } from "../entities/Analysis";
import { User } from "../entities/User";
import { UploadFile, InvokeLLM } from "../integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Camera, Upload, Zap, AlertCircle, TrendingUp, Target, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";

import ChartUploadZone from "../components/analyzer/ChartUploadZone";
import AnalysisResults from "../components/analyzer/AnalysisResults";
import LoadingAnalysis from "../components/analyzer/LoadingAnalysis";
export default function ChartAnalyzer() {
  const [user, setUser] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState("2");

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!user) {
      setError("Please log in to analyze charts");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log("Starting file upload...");
      const { file_url } = await UploadFile({ file });
      console.log("File uploaded successfully:", file_url);
      
      const analysisPrompt = `
        You are an expert technical analyst with 15+ years of experience analyzing trading charts. Perform a comprehensive, professional-grade analysis of this chart image.
        
        CRITICAL ANALYSIS REQUIREMENTS:
        1. ASSET IDENTIFICATION: Carefully examine the chart to identify the exact asset symbol, company name, or trading pair
        2. TIMEFRAME DETECTION: Determine the chart timeframe (1m, 5m, 15m, 1h, 4h, 1D, etc.) from visible indicators
        3. PRICE LEVEL ANALYSIS: Read exact price levels from the chart axes and price labels
        4. TECHNICAL PATTERN RECOGNITION: Identify specific chart patterns with EXACT names:
           - Reversal Patterns: Head and Shoulders, Inverse Head and Shoulders, Double Top, Double Bottom, Triple Top, Triple Bottom
           - Continuation Patterns: Bull Flag, Bear Flag, Pennant, Symmetrical Triangle, Ascending Triangle, Descending Triangle
           - Candlestick Patterns: Hammer, Doji, Engulfing, Morning Star, Evening Star, Shooting Star, Hanging Man
           - Advanced Patterns: Cup and Handle, Wedge (Rising/Falling), Rectangle, Channel (Ascending/Descending)
        5. PATTERN COMPLETION STATUS: Accurately assess whether each pattern is:
           - COMPLETE: Pattern fully formed and confirmed with breakout
           - FORMING: Pattern structure visible but not yet complete
           - EARLY_STAGE: Pattern beginning to develop
           - INVALIDATED: Pattern broken or no longer valid
        6. INDICATOR ANALYSIS: Analyze any visible technical indicators (RSI, MACD, moving averages, volume)
        7. SUPPORT/RESISTANCE: Mark precise support and resistance levels based on price action
        8. TREND ANALYSIS: Determine primary, secondary, and short-term trends
        9. VOLUME CONFIRMATION: Analyze volume patterns if visible on the chart
        10. ENTRY/EXIT STRATEGY: Provide a specific entry price, stop loss, and take profit levels. CRUCIAL: The trading plan's take profit must be set to achieve a risk-reward ratio of at least 1:${riskRewardRatio}. Calculate this based on a logical stop loss placement.
        11. RISK MANAGEMENT: The final calculated risk-reward ratio in your response MUST be 1:${riskRewardRatio} or greater.
        
        PATTERN ANALYSIS ACCURACY:
        - Use ONLY standard, recognized technical analysis pattern names
        - Accurately assess pattern completion status based on price action
        - Consider pattern reliability and historical success rates
        - Factor in volume confirmation for pattern validity
        - Identify false breakouts or pattern failures
        - Measure pattern dimensions for price targets
        
        ENHANCED ACCURACY TECHNIQUES:
        - Examine chart grid lines and price scales carefully
        - Look for candlestick patterns and price action signals
        - Identify key pivot points and swing highs/lows
        - Check for divergences between price and indicators
        - Analyze breakout or breakdown scenarios
        - Consider multiple timeframe context if visible
        - Factor in market structure and institutional levels
        
        PROFESSIONAL ASSESSMENT CRITERIA:
        - Pattern clarity and completion status
        - Volume confirmation quality
        - Risk-reward ratio (minimum ${riskRewardRatio}:1 required)
        - Probability of success based on technical factors
        - Market context and overall trend alignment
        
        OUTPUT REQUIREMENTS:
        - Provide EXACT prices visible on the chart (not estimates)
        - Give specific entry strategy with precise levels
        - Include detailed reasoning for each recommendation
        - Assign confidence score based on signal quality
        - Use precise pattern names from technical analysis literature
        - Clearly state pattern completion status with reasoning
        
        If any information is unclear from the chart, explicitly state what cannot be determined rather than guessing.
      `;

      const analysisSchema = {
        type: "object",
        properties: {
          chart_quality_assessment: {
            type: "object",
            properties: {
              image_clarity: { type: "string", enum: ["EXCELLENT", "GOOD", "FAIR", "POOR"] },
              price_labels_visible: { type: "boolean" },
              timeframe_visible: { type: "boolean" },
              indicators_present: { type: "boolean" },
              volume_visible: { type: "boolean" }
            }
          },
          asset_identification: {
            type: "object",
            properties: {
              asset_symbol: { 
                type: "string", 
                description: "Exact asset symbol from chart or 'UNKNOWN' if not visible"
              },
              asset_name: { 
                type: "string", 
                description: "Full asset name or description"
              },
              market_type: {
                type: "string",
                enum: ["STOCK", "CRYPTO", "FOREX", "COMMODITY", "INDEX", "UNKNOWN"]
              },
              detected_timeframe: {
                type: "string",
                description: "Chart timeframe if visible (1m, 5m, 1h, 1D, etc.)"
              }
            }
          },
          price_analysis: {
            type: "object",
            properties: {
              current_price: { 
                type: "number",
                description: "Current price from chart or null if not visible"
              },
              price_range_high: { type: "number" },
              price_range_low: { type: "number" },
              key_support_levels: { 
                type: "array", 
                items: { type: "number" },
                description: "Precise support levels from chart"
              },
              key_resistance_levels: { 
                type: "array", 
                items: { type: "number" },
                description: "Precise resistance levels from chart"
              }
            }
          },
          technical_patterns: {
            type: "object",
            properties: {
              primary_pattern: {
                type: "string",
                enum: [
                  "Head and Shoulders", "Inverse Head and Shoulders", "Double Top", "Double Bottom", 
                  "Triple Top", "Triple Bottom", "Bull Flag", "Bear Flag", "Pennant", 
                  "Symmetrical Triangle", "Ascending Triangle", "Descending Triangle", 
                  "Cup and Handle", "Rising Wedge", "Falling Wedge", "Rectangle", 
                  "Ascending Channel", "Descending Channel", "Hammer", "Doji", 
                  "Bullish Engulfing", "Bearish Engulfing", "Morning Star", "Evening Star", 
                  "Shooting Star", "Hanging Man", "Support Breakout", "Resistance Breakout",
                  "Trend Continuation", "Trend Reversal", "Consolidation", "NO_CLEAR_PATTERN"
                ],
                description: "Main chart pattern identified using standard technical analysis names"
              },
              pattern_completion: {
                type: "string",
                enum: ["COMPLETE", "FORMING", "EARLY_STAGE", "INVALIDATED"],
                description: "Accurate assessment of pattern completion status"
              },
              pattern_reliability: {
                type: "string",
                enum: ["HIGH", "MEDIUM", "LOW"],
                description: "Pattern reliability based on formation quality and volume confirmation"
              },
              pattern_target: {
                type: "number",
                description: "Calculated price target based on pattern measurements"
              },
              volume_confirmation: {
                type: "string",
                enum: ["STRONG", "MODERATE", "WEAK", "NOT_VISIBLE"],
                description: "Volume confirmation for the pattern"
              },
              pattern_invalidation_level: {
                type: "number",
                description: "Price level at which pattern becomes invalid"
              },
              additional_patterns: {
                type: "array",
                items: { 
                  type: "object",
                  properties: {
                    pattern_name: { type: "string" },
                    completion_status: { type: "string", enum: ["COMPLETE", "FORMING", "EARLY_STAGE", "INVALIDATED"] },
                    reliability: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] }
                  },
                  required: ["pattern_name", "completion_status"]
                },
                description: "Secondary patterns visible on the chart"
              }
            }
          },
          technical_indicators: {
            type: "object",
            properties: {
              rsi_reading: { 
                type: "number",
                description: "RSI value if visible, null otherwise"
              },
              rsi_condition: {
                type: "string",
                enum: ["OVERSOLD", "OVERSOLD_EXTREME", "NEUTRAL", "OVERBOUGHT", "OVERBOUGHT_EXTREME", "NOT_VISIBLE"],
                description: "RSI condition based on its value"
              },
              macd_signal: {
                type: "string",
                enum: ["BULLISH_CROSSOVER", "BEARISH_CROSSOVER", "BULLISH_DIVERGENCE", "BEARISH_DIVERGENCE", "NEUTRAL", "NOT_VISIBLE"],
                description: "MACD signal detected from the chart"
              },
              moving_averages: {
                type: "object",
                properties: {
                  ma20_level: { type: "number" },
                  ma50_level: { type: "number" },
                  ma200_level: { type: "number" },
                  price_vs_ma: { type: "string", enum: ["ABOVE_ALL", "BELOW_ALL", "MIXED", "NOT_VISIBLE"] },
                  ma_alignment: { type: "string", enum: ["BULLISH", "BEARISH", "MIXED", "NOT_VISIBLE"] }
                }
              },
              volume_analysis: {
                type: "object",
                properties: {
                  volume_trend: { type: "string", enum: ["INCREASING", "DECREASING", "AVERAGE", "SPIKE", "NOT_VISIBLE"] },
                  volume_confirmation: { type: "string", enum: ["CONFIRMED", "DIVERGENCE", "NEUTRAL", "NOT_VISIBLE"] }
                }
              }
            }
          },
          trading_recommendation: {
            type: "object",
            properties: {
              direction: { 
                type: "string", 
                enum: ["BUY", "SELL", "HOLD", "WAIT"],
                description: "Primary trading recommendation"
              },
              entry_price: { 
                type: "number",
                description: "Recommended entry price based on chart analysis"
              },
              stop_loss: { 
                type: "number",
                description: "Stop loss level based on chart structure and pattern invalidation"
              },
              take_profit_1: { 
                type: "number",
                description: "First take profit target based on pattern measurements"
              },
              take_profit_2: { 
                type: "number",
                description: "Second take profit target if applicable"
              },
              risk_reward_ratio: { 
                type: "number",
                description: `Calculated Risk to reward ratio, must be at least ${riskRewardRatio}`,
                minimum: parseFloat(riskRewardRatio)
              },
              position_size_recommendation: {
                type: "string",
                enum: ["SMALL", "MEDIUM", "LARGE"],
                description: "Suggested position size based on setup quality and pattern reliability"
              },
              entry_strategy: {
                type: "string",
                description: "Detailed entry strategy based on pattern completion"
              }
            },
            required: ["direction", "entry_price", "stop_loss", "take_profit_1", "risk_reward_ratio"]
          },
          confidence_assessment: {
            type: "object",
            properties: {
              overall_confidence: { 
                type: "number", 
                minimum: 0, 
                maximum: 100,
                description: "Overall confidence in analysis based on pattern quality and confirmation"
              },
              signal_strength: {
                type: "string",
                enum: ["VERY_STRONG", "STRONG", "MODERATE", "WEAK"]
              },
              pattern_confidence: {
                type: "number",
                minimum: 0,
                maximum: 100,
                description: "Confidence in pattern identification and completion"
              },
              key_risk_factors: {
                type: "array",
                items: { type: "string" },
                description: "Main risks including pattern failure scenarios"
              }
            }
          },
          detailed_analysis: {
            type: "object",
            properties: {
              market_structure: {
                type: "string",
                description: "Analysis of overall market structure and trend context"
              },
              pattern_analysis: {
                type: "string",
                description: "Detailed explanation of identified patterns, their formation, and significance"
              },
              entry_strategy: {
                type: "string",
                description: "Detailed entry strategy based on pattern completion and confirmation"
              },
              exit_strategy: {
                type: "string",
                description: "Detailed exit strategy including partial profit-taking based on pattern targets"
              },
              alternative_scenarios: {
                type: "string",
                description: "What to do if patterns fail or market structure changes"
              }
            }
          }
        },
        required: [
          "asset_identification", 
          "trading_recommendation"
        ]
      };

      console.log("Starting enhanced AI analysis...");
      const result = await InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [file_url],
        response_json_schema: analysisSchema
      });

      console.log("Enhanced AI analysis result:", result);

      // Validate and process the analysis
      if (!result || !result.asset_identification || !result.trading_recommendation) {
        throw new Error("Incomplete analysis received. The AI could not identify the asset or create a trading plan. Please try a clearer chart.");
      }

      // Build comprehensive analysis data
      const analysisData = {
        type: "chart_image",
        asset_symbol: result.asset_identification?.asset_symbol || "UNKNOWN",
        asset_name: result.asset_identification?.asset_name || "Unknown Asset",
        direction: result.trading_recommendation?.direction || "HOLD",
        entry_price: result.trading_recommendation?.entry_price || null,
        take_profit: result.trading_recommendation?.take_profit_1 || null,
        stop_loss: result.trading_recommendation?.stop_loss || null,
        risk_reward_ratio: result.trading_recommendation?.risk_reward_ratio || 2.0,
        confidence_score: result.confidence_assessment?.overall_confidence || 75,
        chart_patterns: [
          result.technical_patterns?.primary_pattern,
          ...(result.technical_patterns?.additional_patterns?.map(p => p.pattern_name) || [])
        ].filter(Boolean),
        technical_indicators: {
          rsi: result.technical_indicators?.rsi_reading || null,
          macd: result.technical_indicators?.macd_signal || "NOT_VISIBLE",
          volume: result.technical_indicators?.volume_analysis?.volume_trend || "NOT_VISIBLE", // Adjusted for new volume_analysis object
          sentiment: result.confidence_assessment?.signal_strength || "MODERATE"
        },
        image_url: file_url,
        forecast_return: calculateForecastReturn(
          result.trading_recommendation?.entry_price,
          result.trading_recommendation?.take_profit_1,
          result.trading_recommendation?.direction
        ),
        swing_potential: mapSignalStrengthToSwingPotential(result.confidence_assessment?.signal_strength)
      };

      console.log("Processed analysis data:", analysisData);
      console.log("Saving analysis to database...");
      
      const savedAnalysis = await Analysis.create(analysisData);
      console.log("Analysis saved successfully:", savedAnalysis);

      // Create comprehensive result object
      setAnalysisResult({ 
        ...savedAnalysis,
        // Enhanced analysis details
        chart_quality: result.chart_quality_assessment,
        price_analysis: result.price_analysis,
        technical_patterns: result.technical_patterns,
        detailed_analysis: result.detailed_analysis,
        timeframe: result.asset_identification?.detected_timeframe || "Unknown",
        market_type: result.asset_identification?.market_type || "UNKNOWN",
        take_profit_2: result.trading_recommendation?.take_profit_2,
        position_size: result.trading_recommendation?.position_size_recommendation,
        key_risks: result.confidence_assessment?.key_risk_factors || [],
        signal_strength: result.confidence_assessment?.signal_strength
      });

    } catch (error) {
      console.error("Enhanced analysis error:", error);
      console.error("Error stack:", error.stack);
      
      let errorMessage = "Chart analysis failed. ";
      if (error.message.includes("Incomplete analysis")) {
        errorMessage += "The AI struggled to extract key trading information. Please use a clearer chart with visible asset names and price levels.";
      } else if (error.message.includes("No analysis result")) {
        errorMessage += "The AI service couldn't process the image. Please ensure the image contains a valid trading chart.";
      } else {
        errorMessage += `${error.message}. Please try uploading a clearer chart image with visible price data and technical indicators.`;
      }
      
      setError(errorMessage);
    }

    setIsAnalyzing(false);
  };

// Helper functions
function calculateForecastReturn(entryPrice, targetPrice, direction) {
  if (!entryPrice || !targetPrice) return 0;
  if (direction === "BUY") {
    return ((targetPrice - entryPrice) / entryPrice) * 100;
  } else if (direction === "SELL") {
    // For SELL, profit is made when price goes down. So, entry - target.
    return ((entryPrice - targetPrice) / entryPrice) * 100;
  }
  return 0;
}

function mapSignalStrengthToSwingPotential(signalStrength) {
  switch (signalStrength) {
    case "VERY_STRONG": return "HIGH";
    case "STRONG": return "HIGH";
    case "MODERATE": return "MEDIUM";
    case "WEAK": return "LOW";
    default: return "MEDIUM";
  }
}

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chart Analyzer
            </h1>
            <p className="text-slate-600 text-lg">
              Please log in to analyze your trading charts
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            Login to Analyze
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Chart Analyzer
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Upload your trading chart and get AI-powered technical analysis with entry/exit signals
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAnalyzing ? (
          <LoadingAnalysis />
        ) : analysisResult ? (
          <AnalysisResults 
            analysis={analysisResult} 
            onNewAnalysis={() => setAnalysisResult(null)}
          />
        ) : (
          <>
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                        Analysis Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="risk-reward-select" className="text-slate-700 font-medium">
                            Target Risk/Reward Ratio:
                        </Label>
                        <Select value={riskRewardRatio} onValueChange={setRiskRewardRatio}>
                            <SelectTrigger id="risk-reward-select" className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">1 : 2</SelectItem>
                                <SelectItem value="3">1 : 3</SelectItem>
                                <SelectItem value="4">1 : 4</SelectItem>
                                <SelectItem value="5">1 : 5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        The AI will generate a trading plan aiming for your selected risk-to-reward ratio.
                    </p>
                </CardContent>
            </Card>
            <ChartUploadZone
              onFileSelect={handleFileSelect}
              onDrop={handleDrop}
              onDrag={handleDrag}
              dragActive={dragActive}
              fileInputRef={fileInputRef}
            />
          </>
        )}
      </div>
    </div>
  );
}
