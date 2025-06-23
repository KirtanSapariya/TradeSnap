import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image, Zap } from "lucide-react";

export default function ChartUploadZone({ onFileSelect, onDrop, onDrag, dragActive, fileInputRef }) {
  return (
    <Card className={`transition-all duration-300 border-2 border-dashed ${
      dragActive 
        ? 'border-purple-400 bg-purple-50 shadow-lg' 
        : 'border-slate-300 bg-white/80 backdrop-blur-sm hover:border-purple-300'
    }`}>
      <CardContent 
        className="p-12"
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
        
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
              dragActive 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                : 'bg-gradient-to-r from-purple-400 to-pink-400'
            }`}>
              {dragActive ? (
                <Zap className="w-10 h-10 text-white animate-pulse" />
              ) : (
                <Upload className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">
              {dragActive ? 'Drop your chart here!' : 'Upload Trading Chart'}
            </h3>
            <p className="text-slate-600 text-lg max-w-md mx-auto">
              Drag & drop your chart image or click to browse. Supports PNG, JPG, and JPEG formats.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8 py-6 text-lg rounded-xl"
            >
              <Image className="w-5 h-5 mr-2" />
              Choose File
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="bg-white/50 hover:bg-white/70 border-white/20 px-8 py-6 text-lg rounded-xl"
              onClick={() => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  // Mobile camera functionality could be added here
                  fileInputRef.current?.click();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              <strong>Pro Tips:</strong> For best results, upload clear charts with visible price levels, 
              timeframes, and technical indicators. Screenshots from TradingView work great!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}