import React, { useState, useEffect } from 'react';
import ParentPrompt from '../ui/ParentPrompt';
import { Passage } from '@/lib/content/passages';

interface PassageReaderProps {
  passage: Passage;
  onComplete: (stats: { wpm: number; accuracy: number; mistakes: string[] }) => void;
}

export default function PassageReader({ passage, onComplete }: PassageReaderProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());
  const words = (passage.content || passage.text || '').split(' ');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      finishRead();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleWordMistake = (index: number) => {
    if (!isRunning) return;
    const newMistakes = new Set(mistakes);
    if (newMistakes.has(index)) {
      newMistakes.delete(index);
    } else {
      newMistakes.add(index);
    }
    setMistakes(newMistakes);
  };

  const finishRead = () => {
    // Parent taps on last word read, or we assume they read everything if time isn't out.
    // For MVP simplification: We assume they read the whole passage or up to what they scored.
    // WCPM = total words - mistakes. Wait, wcpm needs to scale if they finished early.
    const timeUsed = Math.max(1, 60 - timeLeft);
    const wcpm = Math.round(((passage.wordCount - mistakes.size) / timeUsed) * 60);
    const accuracy = Math.round(((passage.wordCount - mistakes.size) / passage.wordCount) * 100);
    const mistakenWords = Array.from(mistakes).map((idx) => words[idx]);
    
    onComplete({ wpm: wcpm, accuracy, mistakes: mistakenWords });
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6 flex-1 min-h-[50vh] p-6">
      <ParentPrompt>
        <p className="font-semibold">Passage: {passage.title}</p>
        <p className="text-sm text-gray-500">Tap START, then tap any words Penny reads incorrectly.</p>
        <div className="mt-4 flex space-x-4 items-center">
          <button 
            onClick={() => setIsRunning(!isRunning)}
             className={`px-6 py-3 rounded-xl font-bold text-white transition ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isRunning ? 'STOP / PAUSE' : 'START 1:00 TIMER'}
          </button>
          <span className="text-2xl font-mono p-2 bg-gray-100 rounded-lg">{timeLeft}s</span>
          {(!isRunning && timeLeft < 60) && (
             <button onClick={finishRead} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600">
               FINISH
             </button>
          )}
        </div>
      </ParentPrompt>

      <div className="mt-8 leading-loose tracking-wide border-t pt-8 w-full border-gray-200">
        <p className="text-3xl md:text-5xl font-serif text-gray-800" style={{ lineHeight: '2em' }}>
          {words.map((w, i) => (
            <span 
              key={i} 
              onClick={() => toggleWordMistake(i)}
              className={`cursor-pointer transition-colors duration-200 inline-block px-1 ${mistakes.has(i) ? 'text-red-500 bg-red-50 rounded line-through' : 'hover:bg-gray-100 rounded'}`}
            >
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
