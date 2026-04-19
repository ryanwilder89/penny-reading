"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CelebrationAnim from '../ui/CelebrationAnim';

export default function SessionComplete({ sessionLog }: { sessionLog?: any }) {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    if (isSaving || saved) return;
    setIsSaving(true);
    
    try {
      const payload = { ...sessionLog, parentNotes: notes };
      await fetch('/api/progress/session-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSaved(true);
      router.push('/');
    } catch (error) {
      console.error("Failed to save session:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full flex flex-col gap-6 items-center z-10 relative">
        <CelebrationAnim show={true} />
        <h2 className="text-3xl font-bold text-gray-800 mt-8">Session Complete!</h2>
        <p className="text-xl text-gray-600 font-medium">Amazing job today. The daily streak continues! 🔥</p>
        
        <div className="w-full bg-gray-50 border border-gray-200 p-6 rounded-xl text-left mt-4 shadow-inner">
           <h3 className="font-bold text-gray-700 mb-2">Parent Notes (Optional)</h3>
           <textarea 
             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px] text-gray-800"
             placeholder="How did Penny do? e.g. 'Struggled with the /ai/ sound, need more practice.'"
             value={notes}
             onChange={e => setNotes(e.target.value)}
             disabled={saved}
           />
           {saved ? (
              <p className="text-green-600 font-bold mt-3">Notes saved!</p>
           ) : (
             <button 
               onClick={handleFinish}
               disabled={isSaving}
               className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
             >
               {isSaving ? 'Saving...' : 'Save Notes'}
             </button>
           )}
        </div>

        <button 
          onClick={handleFinish}
          disabled={isSaving}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl transition-transform transform hover:scale-105 active:scale-95 text-center w-full md:w-auto disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Return to Dashboard'}
        </button>
      </div>
    </div>
  );
}
