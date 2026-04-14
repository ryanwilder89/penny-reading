export default function ParentPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Parent Says:</p>
      <div className="text-lg text-gray-700 italic">
        {children}
      </div>
    </div>
  );
}
