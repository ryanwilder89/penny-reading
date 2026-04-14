"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [currentLesson, setCurrentLesson] = useState(14);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-12 items-center px-4 pb-12">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl flex flex-col gap-6">
         <div className="flex justify-between items-center border-b pb-4">
           <h2 className="text-2xl font-bold text-gray-800">Settings & Calibration</h2>
           <Link href="/" className="text-blue-500 hover:underline font-semibold text-sm">
             Return to Dashboard
           </Link>
         </div>

         <div className="flex flex-col gap-8 mt-4">
            <section className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-700">Manual Lesson Override</h3>
              <p className="text-sm text-gray-500 mb-2">
                Override the engine's session planner by directly setting Penny's current lesson position. Only do this if you feel the automated progression is moving too fast or too slow.
              </p>
              
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700 shrink-0">Current Next Lesson:</span>
                <select 
                  className="border p-2 rounded-lg bg-gray-50 max-w-[300px] flex-1 text-gray-800"
                  value={currentLesson}
                  onChange={(e) => setCurrentLesson(Number(e.target.value))}
                >
                  <option value={12}>Lesson 12: Suffixes -ing</option>
                  <option value={13}>Lesson 13: Suffixes -s, -es</option>
                  <option value={14}>Lesson 14: Silent-e (i_e)</option>
                  <option value={15}>Lesson 15: Silent-e (o_e, u_e)</option>
                  <option value={16}>Lesson 16: Vowel teams (ai, ay)</option>
               </select>
              </div>
            </section>
            
            <section className="flex flex-col gap-3 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-700">Reset Error Words</h3>
              <p className="text-sm text-gray-500 mb-2">
                Clear all currently queued "trouble words" from Penny's review loop.
              </p>
              <div>
                <button className="bg-rose-100 text-rose-800 font-bold px-4 py-2 rounded shadow-sm hover:bg-rose-200 transition-colors">
                  Clear Error Words Queue
                </button>
              </div>
            </section>
            
            <div className="border-t pt-6 flex justify-end items-center gap-4 mt-6">
               <Link href="/" className="text-gray-500 hover:text-gray-700 font-bold">
                 Cancel
               </Link>
               <button 
                 onClick={handleSave}
                 className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-blue-600 transition-colors w-32 flex justify-center"
               >
                 {saved ? 'Saved!' : 'Save'}
               </button>
            </div>
         </div>
      </div>
    </main>
  );
}
