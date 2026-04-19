"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SessionFlow from '@/components/session/SessionFlow';
import SessionComplete from '@/components/session/SessionComplete';
import Link from 'next/link';

function SessionPageContent() {
  const searchParams = useSearchParams();
  const patternId = searchParams.get('patternId');
  const [completed, setCompleted] = useState(false);
  const [sessionLog, setSessionLog] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/session/plan${patternId ? `?patternId=${patternId}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setPlan(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load session plan', err);
        setLoading(false);
      });
  }, [patternId]);

  if (loading || !plan) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col pt-12 items-center">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading session...</div>
      </main>
    );
  }

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
          plan={plan} 
          onSessionComplete={(log) => { setSessionLog(log); setCompleted(true); }} 
        />
      ) : (
        <SessionComplete sessionLog={sessionLog} />
      )}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SessionPageContent />
    </Suspense>
  );
}
