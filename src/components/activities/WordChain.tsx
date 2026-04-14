import React, { useState } from 'react';
import ParentPrompt from '../ui/ParentPrompt';
import LetterTile from '../ui/LetterTile';

interface WordChainProps {
  initialWord: string;
  targetWord: string;
  availableLetters: string[];
  onCorrect: () => void;
}

export default function WordChain({ initialWord, targetWord, availableLetters, onCorrect }: WordChainProps) {
  const [currentWord, setCurrentWord] = useState<string[]>(initialWord.split(''));
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  
  const handleSlotTap = (index: number) => {
    setSelectedSlotIndex(index);
  };
  
  const handleLetterTap = (letter: string) => {
    if (selectedSlotIndex === null) return;
    
    const newWord = [...currentWord];
    newWord[selectedSlotIndex] = letter;
    setCurrentWord(newWord);
    setSelectedSlotIndex(null);
    
    if (newWord.join('') === targetWord) {
      setTimeout(() => onCorrect(), 1000); // Wait 1s for celebration
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto space-y-8 p-6">
      <ParentPrompt>
        <p className="text-xl font-medium">Say to Penny: "Change it to <span className="font-bold text-blue-700">{targetWord}</span>"</p>
        <p className="text-gray-500 mt-2">Penny, tap the letter you want to change, then pick a new one below.</p>
      </ParentPrompt>

      <div className="flex space-x-4">
        {currentWord.map((letter, i) => (
          <div 
            key={i} 
            onClick={() => handleSlotTap(i)}
            className={`rounded-lg cursor-pointer ${selectedSlotIndex === i ? 'ring-4 ring-blue-500' : ''}`}
          >
            <LetterTile id={`slot-${i}`} letter={letter} isDraggable={false} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 mt-8 bg-gray-100 p-6 rounded-xl w-full">
        {availableLetters.map((l, i) => (
          <div 
            key={i} 
            onClick={() => handleLetterTap(l)}
            className="cursor-pointer hover:opacity-80 active:scale-95 transition-transform"
          >
             <LetterTile id={`opt-${i}`} letter={l} isDraggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
