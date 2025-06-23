import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Clock, Target } from "lucide-react";

export default function RecentAnalyses({ analyses, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Clock className="w-6 h-6 text-blue-500" />
            Recent Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Clock className="w-6 h-6 text-blue-500" />
          Recent Analyses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No analyses yet</p>
            <p className="text-slate-400 text-sm">Upload a chart to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis) => (
              <div key={analysis.id} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    analysis.direction === 'BUY' 
                      ? 'bg-green-100 text-green-600' 
                      : analysis.direction === 'SELL'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {analysis.direction === 'BUY' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : analysis.direction === 'SELL' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{analysis.asset_symbol}</p>
                    <p className="text-sm text-slate-500">
                      {format(new Date(analysis.created_date), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={analysis.direction === 'BUY' ? 'default' : 'destructive'}
                    className={`${
                      analysis.direction === 'BUY' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {analysis.direction}
                  </Badge>
                  {analysis.confidence_score && (
                    <p className="text-xs text-slate-500 mt-1">
                      {analysis.confidence_score}% confidence
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}