import React from 'react';
import { GrowthResult } from '@/lib/engine/growth-calculator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function GrowthRate({
  growthData
}: {
  growthData: GrowthResult | null
}) {
  if (!growthData) {
    return (
      <div className="p-6 rounded-xl border shadow-sm flex items-center justify-between bg-gray-50 text-gray-500 w-full">
        <div>
           <h4 className="text-lg font-bold mb-1 text-gray-700">4-Week Growth Rate</h4>
           <p className="text-xl font-semibold mt-2">Insufficient Data</p>
           <p className="text-sm mt-1">Complete at least 2 reading sessions to calculate your growth rate.</p>
        </div>
        <div className="bg-white p-4 rounded-full shadow-sm ml-4 shrink-0">
           <Minus className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
        </div>
      </div>
    );
  }

  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let icon = <Minus className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />;
  
  if (growthData.status === 'green') {
     bgColor = 'bg-emerald-50 border-emerald-200';
     textColor = 'text-emerald-800';
     icon = <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />;
  } else if (growthData.status === 'yellow') {
     bgColor = 'bg-yellow-50 border-yellow-200';
     textColor = 'text-yellow-800';
     icon = <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-yellow-600" />;
  } else if (growthData.status === 'red') {
     bgColor = 'bg-rose-50 border-rose-200';
     textColor = 'text-rose-800';
     icon = <TrendingDown className="w-8 h-8 md:w-10 md:h-10 text-rose-600" />;
  }

  return (
    <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between ${bgColor} ${textColor} w-full`}>
      <div>
         <h4 className="text-lg font-bold mb-1">4-Week Growth Rate</h4>
         <p className="text-3xl font-black">
           {growthData.growthRatePerWeek > 0 ? '+' : ''}{growthData.growthRatePerWeek.toFixed(1)} 
           <span className="text-lg font-semibold ml-2 opacity-80">WCPM / week</span>
         </p>
         <p className="text-sm mt-1 opacity-90 max-w-sm">
            {growthData.status === 'green' && 'Excellent progress! The fluency gap is closing.'}
            {growthData.status === 'yellow' && 'Maintaining progress, but the gap may not be closing.'}
            {growthData.status === 'red' && 'Growth is stalled. Intervention adjustment recommended.'}
         </p>
      </div>
      <div className="bg-white p-4 rounded-full shadow-sm ml-4 shrink-0">
         {icon}
      </div>
    </div>
  );
}
