"use client";
import { useState } from 'react';
import WordBuilding from '@/components/activities/WordBuilding';
import Link from 'next/link';

export default function SessionPage() {
  const [completed, setCompleted] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-12">
      <div className="max-w-4xl mx-auto w-full px-4 mb-4 flex justify-between items-center">
         <Link href="/" className="text-blue-500 font-semibold hover:underline">
            ← Back to Dashboard
         </Link>
         <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Activity 1 of 4: PRACTICE
         </div>
      </div>
      
      {!completed ? (
        <WordBuilding 
          targetWord="clap" 
          onComplete={() => setCompleted(true)} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center flex flex-col items-center gap-6">
            <h2 className="text-3xl font-bold text-gray-800">Activity Complete!</h2>
            <p className="text-xl text-gray-600">Great job building the word 'clap'.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl transition-transform transform hover:scale-105">
              Next Activity
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
