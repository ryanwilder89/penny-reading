import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface LetterTileProps {
  id: string;
  letter: string;
  isDraggable?: boolean;
}

export default function LetterTile({ id, letter, isDraggable = true }: LetterTileProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    disabled: !isDraggable,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center justify-center w-16 h-16 md:w-20 md:h-20
        bg-white border-2 border-gray-300 rounded-lg shadow-md
        text-3xl md:text-4xl font-bold uppercase cursor-grab active:cursor-grabbing
        ${isDraggable ? 'hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      {letter}
    </div>
  );
}
