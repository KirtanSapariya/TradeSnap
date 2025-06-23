import React, { useState } from "react";
import { Watchlist } from "@/entities/Watchlist";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function AddAssetDialog({ open, onOpenChange, onAssetAdded }) {
  const [formData, setFormData] = useState({
    asset_symbol: "",
    asset_name: "",
    asset_type: "stock",
    target_price: "",
    alert_enabled: true,
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Watchlist.create({
        ...formData,
        target_price: formData.target_price ? parseFloat(formData.target_price) : null
      });
      
      setFormData({
        asset_symbol: "",
        asset_name: "",
        asset_type: "stock",
        target_price: "",
        alert_enabled: true,
        notes: ""
      });
      
      onOpenChange(false);
      onAssetAdded();
    } catch (error) {
      console.error("Error adding asset:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Asset to Watchlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset_symbol">Asset Symbol *</Label>
            <Input
              id="asset_symbol"
              placeholder="e.g., AAPL, BTC"
              value={formData.asset_symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_symbol: e.target.value.toUpperCase() }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_name">Asset Name *</Label>
            <Input
              id="asset_name"
              placeholder="e.g., Apple Inc., Bitcoin"
              value={formData.asset_name}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_type">Asset Type</Label>
            <Select 
              value={formData.asset_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_price">Target Price</Label>
            <Input
              id="target_price"
              type="number"
              step="0.01"
              placeholder="Optional"
              value={formData.target_price}
              onChange={(e) => setFormData(prev => ({ ...prev, target_price: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="alert_enabled"
              checked={formData.alert_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, alert_enabled: checked }))}
            />
            <Label htmlFor="alert_enabled">Enable price alerts</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add personal notes about this asset..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
            >
              {isSubmitting ? 'Adding...' : 'Add to Watchlist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}