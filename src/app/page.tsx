"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import WcpmChart from '@/components/progress/WcpmChart';
import SessionHistory from '@/components/progress/SessionHistory';
import GrowthRate from '@/components/progress/GrowthRate';
import SkillsMap from '@/components/progress/SkillsMap';
import { calculateGrowthRate } from '@/lib/engine/growth-calculator';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/dashboard')
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => {
              throw new Error(errData.error || `HTTP ${res.status}`);
            }).catch(() => {
              throw new Error(`Failed to load dashboard (HTTP ${res.status})`);
            });
          }
          return res.json();
        })
        .then(data => setDashboardData(data))
        .catch(err => {
          console.error('Error loading dashboard data', err);
          setError(err.message);
        });
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading...</div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white text-black p-8 rounded-xl shadow-xl flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Penny's Reading</h1>
          <p className="text-gray-600 mb-6 font-semibold">Sign in to track your child's progress.</p>
          
          <Link 
            href="/auth/signin"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-colors text-lg"
          >
            Sign In
          </Link>

          <Link 
            href="/auth/signup"
            className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-4 px-6 rounded-lg shadow-sm transition-colors text-lg"
          >
            Create an Account
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </main>
    );
  }

  if (!dashboardData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading dashboard...</div>
      </main>
    );
  }

  const { today, streak, currentLesson, fluencyProgress, sessionHistory, skillsMap } = dashboardData;

  const dateObj = new Date(today);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const growthData = fluencyProgress.length >= 2 ? calculateGrowthRate(fluencyProgress) : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Hi, {session?.user?.name || session?.user?.email?.split('@')[0]}</h1>
        <button 
          onClick={() => signOut()}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white text-black p-6 md:p-8 rounded-xl shadow-xl flex flex-col gap-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold">Today: {formattedDate}</h2>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
            Streak: {streak} Days 🔥
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 md:p-10 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">TODAY'S SESSION</h3>
          <p className="text-2xl font-semibold text-gray-800 mb-2">{currentLesson.name}</p>
          <p className="text-lg text-gray-500 mb-8">Type: {currentLesson.type} • Est. time: {currentLesson.estTime} min</p>
          
          <Link href={`/session?patternId=${currentLesson.id}`} className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-12 md:px-16 rounded-full shadow-lg text-2xl transition-transform transform hover:scale-105 active:scale-95">
            START SESSION
          </Link>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
           {/* Left column: WcpmChart and Growth Rate */}
           <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
             <GrowthRate growthData={growthData} />
             <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
               <h4 className="text-lg font-bold mb-4 whitespace-nowrap">Fluency Progress (WCPM)</h4>
               <WcpmChart data={fluencyProgress} />
             </div>
           </div>

           {/* Right column: SessionHistory and Quick actions */}
           <div className="flex flex-col gap-6">
             <SessionHistory history={sessionHistory} />
             
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col gap-3 justify-center shadow-sm">
                <h4 className="font-bold text-lg mb-2 text-gray-800">QUICK ACTIONS</h4>
                <div className="flex gap-4">
                  <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 rounded-lg shadow-sm border border-blue-200 transition-colors">Fluency Check</button>
                  <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 rounded-lg shadow-sm border border-purple-200 transition-colors">Free Practice</button>
                </div>
                <Link href="/notes" className="w-full mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-center font-semibold py-3 rounded-lg shadow-sm border border-yellow-200 transition-colors">
                  View Parent Notes History
                </Link>
             </div>
           </div>
         </div>
         
         <div className="mt-8">
            <SkillsMap progressMap={skillsMap} />
         </div>
      </div>
    </main>
  );
}
