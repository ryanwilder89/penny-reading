import React, { useState } from 'react';
import PhonemicWarmup from '../activities/PhonemicWarmup';
import FlashcardReview from '../activities/FlashcardReview';
import WordBuilding from '../activities/WordBuilding';
import WordChain from '../activities/WordChain';
import PassageReader from '../activities/PassageReader';
import { generateSessionPlan } from '@/lib/engine/session-planner';
import { Passage } from '@/lib/content/passages';

export default function SessionFlow({ lesson, onSessionComplete }: { lesson: any, onSessionComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const plan = generateSessionPlan(lesson);
  
  const handleNext = () => {
    if (currentStep < plan.activities.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSessionComplete();
    }
  };

  const activity = plan.activities[currentStep];

  // Dummy content based on type (MVP mock)
  if (activity.type === 'WARMUP') {
    return <PhonemicWarmup 
      prompts={[
        { instruction: "Say 'stop'. Now say it without the /s/.", answer: "top" },
        { instruction: "Say 'flat'. Change /f/ to /s/.", answer: "slat" }
      ]}
      onComplete={handleNext}
    />;
  }

  if (activity.type === 'REVIEW') {
    return <FlashcardReview 
      words={["clap", "sled", "drum", "frog", "jump"]}
      onComplete={handleNext}
    />;
  }

  if (activity.type === 'PRACTICE') {
    // Alternate between word building and chain. Let's do chain for now
    return <WordChain 
      initialWord="flat"
      targetWord="flop"
      availableLetters={['o', 'i', 's', 'p']}
      onCorrect={handleNext}
    />;
  }

  if (activity.type === 'READ') {
    return <PassageReader 
      passage={{ id: 'mock', title: 'The Sled', text: 'Sam had a big red sled. He went to the hill with his dog, Rex. The sled slid down the hill. Rex ran and ran. Sam was glad.', wordCount: 28, maxPatternId: '2.1', patternsUsed: [] }}
      onComplete={(stats) => {
        // Here we would sync stats to API
        handleNext();
      }}
    />;
  }

  return <div>Unknown activity type</div>;
}
