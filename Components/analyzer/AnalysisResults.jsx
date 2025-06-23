import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  BarChart3,
  Camera,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock,
  Percent
} from "lucide-react";

export default function AnalysisResults({ analysis, onNewAnalysis }) {
  const getDirectionColor = (direction) => {
    switch (direction) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100'; 
      case 'HOLD': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSignalStrengthColor = (strength) => {
    switch (strength) {
      case 'VERY_STRONG': return 'text-green-600 bg-green-100';
      case 'STRONG': return 'text-green-600 bg-green-100';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
      case 'WEAK': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message with Chart Quality */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Enhanced Analysis Complete!</h3>
                <p className="text-green-700">Professional-grade chart analysis with high accuracy</p>
              </div>
            </div>
            {analysis.chart_quality && (
              <div className="text-right">
                <Badge className={`${analysis.chart_quality.image_clarity === 'EXCELLENT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {analysis.chart_quality.image_clarity} Quality
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {analysis.asset_symbol} Analysis
                {analysis.market_type && analysis.market_type !== 'UNKNOWN' && (
                  <Badge variant="outline" className="text-xs">
                    {analysis.market_type}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-slate-600 mt-1">{analysis.asset_name}</p>
              {analysis.timeframe && analysis.timeframe !== 'Unknown' && (
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Timeframe: {analysis.timeframe}</span>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <Badge className={`text-lg px-4 py-2 ${getDirectionColor(analysis.direction)}`}>
                {analysis.direction === 'BUY' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : analysis.direction === 'SELL' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : (
                  <Target className="w-4 h-4 mr-1" />
                )}
                {analysis.direction}
              </Badge>
              <div className="space-y-1">
                <Badge className={`${getConfidenceColor(analysis.confidence_score)}`}>
                  {analysis.confidence_score}% Confidence
                </Badge>
                {analysis.signal_strength && (
                  <Badge className={`${getSignalStrengthColor(analysis.signal_strength)} block`}>
                    {analysis.signal_strength.replace('_', ' ')} Signal
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Trading Levels */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Entry Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {analysis.entry_price ? `$${analysis.entry_price.toFixed(2)}` : 'Market'}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Take Profit</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {analysis.take_profit ? `$${analysis.take_profit.toFixed(2)}` : 'N/A'}
              </p>
              {analysis.take_profit_2 && (
                <p className="text-sm text-green-700 mt-1">
                  TP2: ${analysis.take_profit_2.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Stop Loss</span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {analysis.stop_loss ? `$${analysis.stop_loss.toFixed(2)}` : 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Risk:Reward</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                1:{analysis.risk_reward_ratio?.toFixed(1) || '2.0'}
              </p>
            </div>
          </div>

          {/* Enhanced Technical Analysis */}
          {analysis.technical_patterns && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Pattern Analysis
              </h4>
              <div className="space-y-2">
                {analysis.technical_patterns.primary_pattern && (
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-700">Primary Pattern:</span>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-800">
                      {analysis.technical_patterns.primary_pattern}
                    </Badge>
                  </div>
                )}
                {analysis.technical_patterns.pattern_completion && (
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-700">Completion:</span>
                    <Badge variant="outline" className={`${
                      analysis.technical_patterns.pattern_completion === 'COMPLETE' 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-yellow-50 text-yellow-800'
                    }`}>
                      {analysis.technical_patterns.pattern_completion}
                    </Badge>
                  </div>
                )}
                {analysis.technical_patterns.pattern_reliability && (
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-700">Reliability:</span>
                    <Badge variant="outline" className={`${
                      analysis.technical_patterns.pattern_reliability === 'HIGH' 
                        ? 'bg-green-50 text-green-800' 
                        : analysis.technical_patterns.pattern_reliability === 'MEDIUM'
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'bg-red-50 text-red-800'
                    }`}>
                      {analysis.technical_patterns.pattern_reliability}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price Levels Analysis */}
          {analysis.price_analysis && (
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.price_analysis.key_support_levels && analysis.price_analysis.key_support_levels.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Support Levels</h4>
                  <div className="space-y-1">
                    {analysis.price_analysis.key_support_levels.map((level, index) => (
                      <div key={index} className="text-green-700">
                        ${level.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.price_analysis.key_resistance_levels && analysis.price_analysis.key_resistance_levels.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Resistance Levels</h4>
                  <div className="space-y-1">
                    {analysis.price_analysis.key_resistance_levels.map((level, index) => (
                      <div key={index} className="text-red-700">
                        ${level.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Strategy Details */}
          {analysis.detailed_analysis && (
            <div className="space-y-4">
              {analysis.detailed_analysis.entry_strategy && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Entry Strategy</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {analysis.detailed_analysis.entry_strategy}
                  </p>
                </div>
              )}
              
              {analysis.detailed_analysis.exit_strategy && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Exit Strategy</h4>
                  <p className="text-green-700 text-sm leading-relaxed">
                    {analysis.detailed_analysis.exit_strategy}
                  </p>
                </div>
              )}

              {analysis.detailed_analysis.market_structure && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Market Structure</h4>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    {analysis.detailed_analysis.market_structure}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Risk Factors */}
          {analysis.key_risks && analysis.key_risks.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Key Risk Factors
              </h4>
              <ul className="space-y-1">
                {analysis.key_risks.map((risk, index) => (
                  <li key={index} className="text-orange-700 text-sm flex items-start gap-2">
                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Position Sizing Recommendation */}
          {analysis.position_size && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Position Sizing</h4>
              <Badge className={`${
                analysis.position_size === 'LARGE' 
                  ? 'bg-green-100 text-green-800' 
                  : analysis.position_size === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {analysis.position_size} Position Recommended
              </Badge>
            </div>
          )}

          {/* Chart Image */}
          {analysis.image_url && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Analyzed Chart</h4>
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                <img 
                  src={analysis.image_url} 
                  alt="Analyzed Chart" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onNewAnalysis}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Analyze Another Chart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}