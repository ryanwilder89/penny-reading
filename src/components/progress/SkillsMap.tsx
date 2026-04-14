import React from 'react';
import { scopeAndSequence } from '@/lib/content/scope-sequence';

type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';

export default function SkillsMap({
  progressMap
}: {
  progressMap: Record<string, Status>
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-black w-full text-left border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Skills Map</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {scopeAndSequence.map(skill => {
          const status = progressMap[skill.id] || 'NOT_STARTED';
          
          let statusColors = 'bg-gray-50 text-gray-500 border-gray-200';
          let statusText = 'Not Started';
          if (status === 'IN_PROGRESS') {
             statusColors = 'bg-yellow-50 text-yellow-800 border-yellow-200 shadow-sm';
             statusText = 'In Progress';
          } else if (status === 'MASTERED') {
             statusColors = 'bg-green-50 text-green-800 border-green-200 shadow-sm';
             statusText = 'Mastered';
          }

          return (
            <div key={skill.id} className={`flex flex-col p-3 border rounded-lg transition-colors ${statusColors}`}>
               <div className="flex justify-between items-center mb-1">
                 <span className="font-bold text-sm">Unit {skill.order}</span>
                 <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-white/50 rounded-full">{statusText}</span>
               </div>
               <span className="font-medium text-sm">{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
