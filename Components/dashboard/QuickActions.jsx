import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Search, TrendingUp, Star, Newspaper, BarChart3 } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Analyze Chart",
      description: "Upload a trading chart for AI analysis",
      icon: Camera,
      url: createPageUrl("ChartAnalyzer"),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Screen Assets",
      description: "Find underpriced & overpriced opportunities",
      icon: Search,
      url: createPageUrl("AssetScreener"),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Top Movers",
      description: "Today's high-volume trading opportunities",
      icon: TrendingUp,
      url: createPageUrl("TopMovers"),
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "News Signals",
      description: "Market-moving news with trade signals",
      icon: Newspaper,
      url: createPageUrl("NewsSignals"),
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link key={action.title} to={action.url}>
              <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}