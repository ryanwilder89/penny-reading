"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WcpmChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // Format data for chart
  const chartData = data.map(d => ({
    ...d,
    dateValue: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full h-[300px]">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Fluency Progress (WCPM)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="dateValue" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          {/* Target line for end of 1st grade 50th percentile (60 wcpm) */}
          <ReferenceLine y={60} label={{ position: 'top', value: 'End Yr Goal', fill: '#10b981', fontSize: 12 }} stroke="#10b981" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="wcpm" 
            stroke="#3b82f6" 
            strokeWidth={4}
            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 8, fill: '#2563eb' }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
