import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Brain, Zap, Target } from "lucide-react";

export default function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    { icon: Brain, text: "Analyzing chart patterns..." },
    { icon: Zap, text: "Detecting support & resistance..." },
    { icon: Target, text: "Calculating entry/exit points..." }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <CardContent className="p-12">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">
              AI Analysis in Progress
            </h3>
            <div className="flex items-center justify-center gap-3 text-lg text-slate-600">
              <CurrentIcon className="w-6 h-6 text-purple-500" />
              <span>{steps[currentStep].text}</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-slate-500">
            This usually takes 10-15 seconds. Please wait while our AI analyzes your chart.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}