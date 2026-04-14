import React from 'react';

export default function SessionHistory({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return <div className="text-gray-500 italic p-4">No recent sessions found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
         <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
         Recent Sessions
      </h3>
      <div className="space-y-4">
        {history.map((session, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
             <div>
                <p className="font-semibold text-gray-800">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500 mt-1">Lesson: {session.lessonId} • {session.durationMin} min</p>
             </div>
             <div className="text-right">
                <span className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                   {session.wcpm} WCPM
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
