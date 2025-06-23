import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Camera, 
  Search, 
  Star, 
  Newspaper, 
  BarChart3, 
  LogOut,
  Zap,
  Eye
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Chart Analyzer",
    url: createPageUrl("ChartAnalyzer"),
    icon: Camera,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Asset Screener", 
    url: createPageUrl("AssetScreener"),
    icon: Search,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Top Movers",
    url: createPageUrl("TopMovers"),
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "Watchlist",
    url: createPageUrl("Watchlist"),
    icon: Star,
    gradient: "from-yellow-500 to-amber-500"
  },
  {
    title: "News Signals",
    url: createPageUrl("NewsSignals"),
    icon: Newspaper,
    gradient: "from-indigo-500 to-blue-500"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

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

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <style>
          {`
            :root {
              --primary-navy: #0B1426;
              --primary-blue: #00D4FF;
              --accent-purple: #6366F1;
              --success-green: #10B981;
              --warning-orange: #F59E0B;
              --error-red: #EF4444;
            }
            
            .glass-effect {
              background: rgba(255, 255, 255, 0.25);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.18);
            }
            
            .gradient-text {
              background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-white/20 glass-effect">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl gradient-text">TradeSnap</h2>
                <p className="text-xs text-slate-500 font-medium">AI Trading Signals</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Trading Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-white/50 transition-all duration-300 rounded-xl ${
                          location.pathname === item.url 
                            ? 'bg-white/80 shadow-md border border-white/20' 
                            : 'hover:shadow-sm'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-700">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Market Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-600">Markets Open</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <div>NSE: 9:15 AM - 3:30 PM</div>
                    <div>Crypto: 24/7</div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-700 text-sm truncate">
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full bg-white/50 hover:bg-white/70 border-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => User.login()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                Login to Trade
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-white/50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold gradient-text">TradeSnap</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}