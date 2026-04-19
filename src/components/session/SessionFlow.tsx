"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhonemicWarmup from '../activities/PhonemicWarmup';
import FlashcardReview from '../activities/FlashcardReview';
import WordBuilding from '../activities/WordBuilding';
import WordChain from '../activities/WordChain';
import PassageReader from '../activities/PassageReader';
import { Passage } from '@/lib/content/passages';

export default function SessionFlow({ plan, onSessionComplete }: { plan: any, onSessionComplete: (log: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Session Log State
  const [sessionLog, setSessionLog] = useState({
    sessionId: `sess_${Date.now()}`,
    startedAt: Date.now(),
    completedAt: null as number | null,
    lessonId: plan.lesson?.id || 'unknown',
    troubleWords: [] as string[],
    reviewedWords: [] as string[],
    fluencyStats: null as any
  });

  const handleNext = async () => {
    if (currentStep < plan.activities.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step reached, let's complete session
      const finalLog = { ...sessionLog, completedAt: Date.now() };
      onSessionComplete(finalLog);
    }
  };

  const activity = plan.activities[currentStep];

  // Use dynamic content from plan
  if (activity.type === 'WARMUP') {
    return <PhonemicWarmup 
      prompts={activity.data?.prompts || []}
      onComplete={handleNext}
    />;
  }

  if (activity.type === 'REVIEW') {
    return <FlashcardReview 
      words={activity.data?.words || []}
      onComplete={(stats) => {
        setSessionLog(prev => ({ 
           ...prev, 
           reviewedWords: [...prev.reviewedWords, ...(activity.data?.words || [])],
           troubleWords: [...prev.troubleWords, ...stats.incorrectWords] 
        }));
        handleNext();
      }}
    />;
  }

  if (activity.type === 'PRACTICE') {
    return <WordChain 
      initialWord={activity.data?.initialWord || "flat"}
      targetWord={activity.data?.targetWord || "flop"}
      availableLetters={activity.data?.availableLetters || ['o', 'i', 's', 'p']}
      onCorrect={handleNext}
    />;
  }

  if (activity.type === 'READ') {
    return <PassageReader 
      passage={activity.data?.passage || { id: 'mock', title: 'The Sled', text: 'Sam had a big red sled...', wordCount: 28, maxPatternId: '2.1', patternsUsed: [] }}
      onComplete={(stats) => {
        setSessionLog(prev => ({ ...prev, fluencyStats: stats }));
        handleNext();
      }}
    />;
  }

  return <div>Unknown activity type</div>;
}
