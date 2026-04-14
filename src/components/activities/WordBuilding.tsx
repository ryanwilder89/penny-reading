"use client";
import React, { useState } from 'react';
import { DndContext, useDroppable, DragEndEvent } from '@dnd-kit/core';
import ParentPrompt from '../ui/ParentPrompt';
import LetterTile from '../ui/LetterTile';
import CelebrationAnim from '../ui/CelebrationAnim';

interface WordBuildingProps {
  targetWord: string;
  onComplete: () => void;
}

function DroppableSlot({ id, expectedLetter, currentLetter }: { id: string, expectedLetter: string, currentLetter: string | null }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isCorrect = currentLetter === expectedLetter;

  return (
    <div
      ref={setNodeRef}
      className={`
        w-20 h-20 md:w-24 md:h-24 border-4 border-dashed rounded-xl flex items-center justify-center
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isCorrect && currentLetter ? 'border-green-500 bg-green-50' : ''}
        transition-colors
      `}
    >
      {currentLetter ? (
        <div className="text-4xl font-bold uppercase">{currentLetter}</div>
      ) : (
        <span className="text-gray-400">{expectedLetter.toUpperCase()}</span>
      )}
    </div>
  );
}

export default function WordBuilding({ targetWord, onComplete }: WordBuildingProps) {
  const targetLetters = targetWord.split('');
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>(new Array(targetWord.length).fill(null));
  
  // Set up available tiles only once on mount
  const [availableTiles, setAvailableTiles] = useState(() => {
    const letters = [...targetLetters, 'k', 'b', 's']; // destructors
    return letters.sort(() => Math.random() - 0.5).map((l, i) => ({ id: `tile-${i}-${l}`, letter: l }));
  });
  
  const [showCelebration, setShowCelebration] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active) {
      const slotIndex = parseInt(over.id.toString().split('-')[1]);
      const tileLetter = active.id.toString().split('-')[2];

      const expectedLetter = targetLetters[slotIndex];
      
      // For MVP, we only allow correct placements to "stick"
      if (tileLetter === expectedLetter && !placedLetters[slotIndex]) {
        const newPlaced = [...placedLetters];
        newPlaced[slotIndex] = tileLetter;
        setPlacedLetters(newPlaced);
        
        setAvailableTiles(prev => prev.filter(t => t.id !== active.id));

        // Check if word is complete
        if (newPlaced.every(l => l !== null)) {
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
            onComplete();
          }, 1500);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-8 relative">
      <CelebrationAnim show={showCelebration} />
      
      <div className="w-full mb-8">
        <ParentPrompt>
          Let's build the word '{targetWord}'. What sounds do you hear in {targetWord}?
        </ParentPrompt>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 mb-16 px-4 py-8 bg-white rounded-2xl shadow-xl w-full justify-center">
          {targetLetters.map((letter, index) => (
            <DroppableSlot 
              key={`slot-${index}`} 
              id={`slot-${index}`} 
              expectedLetter={letter}
              currentLetter={placedLetters[index]}
            />
          ))}
        </div>

        <div className="bg-gray-100 p-6 md:p-8 rounded-2xl w-full border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-500 mb-4 text-center uppercase">Letters</h3>
          <div className="flex gap-4 flex-wrap justify-center">
            {availableTiles.map(tile => (
              <LetterTile key={tile.id} id={tile.id} letter={tile.letter} />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
