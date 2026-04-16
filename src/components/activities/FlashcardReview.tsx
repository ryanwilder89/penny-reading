import React, { useState } from 'react';
import ParentPrompt from '../ui/ParentPrompt';

interface FlashcardReviewProps {
  words: string[];
  onComplete: (stats: { accuracy: number; incorrectWords: string[] }) => void;
}

export default function FlashcardReview({ words, onComplete }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState<string[]>([]);

  const handleScore = (isCorrect: boolean) => {
    let newCount = correctCount;
    if (isCorrect) newCount += 1;
    setCorrectCount(newCount);

    const newIncorrect = isCorrect ? incorrectWords : [...incorrectWords, words[currentIndex]];
    if (!isCorrect) setIncorrectWords(newIncorrect);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete({
        accuracy: Math.round((newCount / words.length) * 100),
        incorrectWords: newIncorrect
      });
    }
  };

  if (!words || words.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-16 p-6 flex-1 min-h-[50vh]">
      <div className="w-full text-center py-20 rounded-[3rem] bg-indigo-50 border-4 border-indigo-100 shadow-inner">
         <span className="text-8xl md:text-[8rem] font-bold tracking-tight text-gray-900 select-none">
           {words[currentIndex]}
         </span>
      </div>

      <div className="flex flex-col items-center w-full space-y-8">
        <div className="flex space-x-6 w-full">
          <button 
             onClick={() => handleScore(false)}
             className="flex-1 py-8 px-4 rounded-3xl bg-red-100 text-red-700 font-bold text-2xl hover:bg-red-200 shadow-sm border-2 border-red-200 transition transform active:scale-95"
          >
            INCORRECT
          </button>
          <button 
             onClick={() => handleScore(true)}
             className="flex-1 py-8 px-4 rounded-3xl bg-green-500 text-white font-bold text-2xl hover:bg-green-600 shadow-sm transition transform active:scale-95"
          >
            CORRECT
          </button>
        </div>

        <div className="flex items-center space-x-2">
            <div className="text-gray-400 font-mono font-bold tracking-widest text-lg">
               {currentIndex + 1} / {words.length}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full ml-4">
               <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1)/words.length)*100}%` }}></div>
            </div>
        </div>
      </div>
    </div>
  );
}
