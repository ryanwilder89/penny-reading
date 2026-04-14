"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Quick simulated login/user selection for testing
  if (!currentUser) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white text-black p-8 rounded-xl shadow-xl flex flex-col gap-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-600 mb-6 font-semibold">Select an option to test Phase 1 flows:</p>
          
          <button 
            onClick={() => router.push('/placement')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-colors text-lg"
          >
            Log in as New User
            <div className="text-sm font-normal text-blue-100 mt-1">(Triggers Placement/Calibration)</div>
          </button>

          <button 
            onClick={() => setCurrentUser('existing')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-colors text-lg"
          >
            Log in as Existing User
            <div className="text-sm font-normal text-green-100 mt-1">(Shows Daily Dashboard)</div>
          </button>
        </div>
      </main>
    );
  }

  // Original Daily Dashboard UI (Shown to Existing Users)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white text-black p-6 md:p-8 rounded-xl shadow-xl flex flex-col gap-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold">Today: Tuesday, April 15</h2>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
            Streak: 8 Days 🔥
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 md:p-10 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">TODAY'S SESSION</h3>
          <p className="text-2xl font-semibold text-gray-800 mb-2">Lesson 14: Silent-e (i_e)</p>
          <p className="text-lg text-gray-500 mb-8">Type: Reinforce • Est. time: 12 min</p>
          
          <Link href="/session" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-12 md:px-16 rounded-full shadow-lg text-2xl transition-transform transform hover:scale-105 active:scale-95">
            START SESSION
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-2 text-gray-600">RECENT PROGRESS</h4>
              <p className="text-md text-gray-800 mb-1">Last session: Mon Apr 14 - 13 min</p>
              <p className="text-md text-gray-800">WCPM: <span className="font-bold text-xl">28</span> (accuracy: 94%)</p>
           </div>
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col gap-3 justify-center">
              <h4 className="font-bold text-lg mb-2 text-gray-600">QUICK ACTIONS</h4>
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 rounded-lg shadow-sm border border-blue-200 transition-colors">Fluency Check</button>
                <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 rounded-lg shadow-sm border border-purple-200 transition-colors">Free Practice</button>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
