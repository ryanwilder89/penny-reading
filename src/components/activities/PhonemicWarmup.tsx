import React, { useState } from 'react';
import ParentPrompt from '../ui/ParentPrompt';

interface PhonemicWarmupProps {
  prompts: { instruction: string; answer: string; }[];
  onComplete: (accuracy: number) => void;
}

export default function PhonemicWarmup({ prompts, onComplete }: PhonemicWarmupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleScore = (isCorrect: boolean) => {
    let newCount = correctCount;
    if (isCorrect) newCount += 1;
    setCorrectCount(newCount);

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      onComplete(Math.round((newCount / prompts.length) * 100));
    }
  };

  if (!prompts || prompts.length === 0) return null;

  const current = prompts[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-12 p-6 flex-1 min-h-[50vh]">
      <ParentPrompt>
         <h3 className="text-xl font-bold mb-4">Warmup: Sound Practice</h3>
         <p className="text-xl mb-4">Instructions:</p>
         <p className="text-3xl font-bold text-gray-800 bg-gray-100 p-6 rounded-2xl text-center">"{current.instruction}"</p>
      </ParentPrompt>

      <div className="flex flex-col items-center w-full space-y-8">
        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            className="text-gray-400 hover:text-gray-600 underline underline-offset-4 font-medium"
          >
            Show Answer
          </button>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-3xl font-bold border-2 border-yellow-200">
            {current.answer}
          </div>
        )}

        <div className="flex space-x-6 w-full mt-10">
          <button 
             onClick={() => handleScore(false)}
             className="flex-1 py-8 px-4 rounded-3xl bg-red-100 text-red-700 font-bold text-2xl hover:bg-red-200 shadow-sm border-2 border-red-200 transition"
          >
            INCORRECT
          </button>
          <button 
             onClick={() => handleScore(true)}
             className="flex-1 py-8 px-4 rounded-3xl bg-green-500 text-white font-bold text-2xl hover:bg-green-600 shadow-sm transition"
          >
            CORRECT
          </button>
        </div>

        <div className="text-gray-400 font-mono font-bold tracking-widest">
           {currentIndex + 1} / {prompts.length}
        </div>
      </div>
    </div>
  );
}
