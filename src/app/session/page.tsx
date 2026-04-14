"use client";
import { useState } from 'react';
import SessionFlow from '@/components/session/SessionFlow';
import SessionComplete from '@/components/session/SessionComplete';
import Link from 'next/link';

export default function SessionPage() {
  const [completed, setCompleted] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-12">
      <div className="max-w-4xl mx-auto w-full px-4 mb-4 flex justify-between items-center">
         <Link href="/" className="text-blue-500 font-semibold hover:underline">
            ← Back to Dashboard
         </Link>
         {!completed && (
           <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              Current Session
           </div>
         )}
      </div>
      
      {!completed ? (
        <SessionFlow 
          lesson={{ id: 'mock-lesson' }} 
          onSessionComplete={() => setCompleted(true)} 
        />
      ) : (
        <SessionComplete />
      )}
    </main>
  );
}
