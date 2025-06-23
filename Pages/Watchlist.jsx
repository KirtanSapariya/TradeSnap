import React, { useState, useEffect } from "react";
import { Watchlist } from "@/entities/Watchlist";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Search, Trash2 } from "lucide-react";

import WatchlistGrid from "../../components/watchlist/WatchlistGrid";
import AddAssetDialog from "../../components/watchlist/AddAssetDialog";

export default function WatchlistPage() {
  const [user, setUser] = useState(null);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      loadWatchlist();
    } catch (error) {
      setUser(null);
    }
  };

  const loadWatchlist = async () => {
    setIsLoading(true);
    try {
      const items = await Watchlist.list('-created_date');
      setWatchlistItems(items);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
    setIsLoading(false);
  };

  const removeFromWatchlist = async (id) => {
    try {
      await Watchlist.delete(id);
      setWatchlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const filteredItems = watchlistItems.filter(item =>
    item.asset_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Star className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Watchlist
            </h1>
            <p className="text-slate-600 text-lg">
              Please log in to manage your favorite assets
            </p>
          </div>
          <Button
            onClick={() => User.login()}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
          >
            Login to View Watchlist
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
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                My Watchlist
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Track your favorite assets and get personalized insights
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-slate-900">{watchlistItems.length}</h3>
              <p className="text-slate-600">Total Assets</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600">
                {watchlistItems.filter(item => item.asset_type === 'stock').length}
              </h3>
              <p className="text-slate-600">Stocks</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-600">
                {watchlistItems.filter(item => item.asset_type === 'crypto').length}
              </h3>
              <p className="text-slate-600">Crypto</p>
            </CardContent>
          </Card>
        </div>

        <WatchlistGrid 
          items={filteredItems}
          isLoading={isLoading}
          onRemove={removeFromWatchlist}
        />

        <AddAssetDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAssetAdded={loadWatchlist}
        />
      </div>
    </div>
  );
}