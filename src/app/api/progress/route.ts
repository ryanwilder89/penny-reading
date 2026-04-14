import { NextResponse } from 'next/server';

// In a real app, this would use DB from src/db
const MOCK_DB = {
  fluencyScores: [
    { date: '2026-04-10', wcpm: 20 },
    { date: '2026-04-11', wcpm: 22 },
    { date: '2026-04-12', wcpm: 28 },
    { date: '2026-04-13', wcpm: 30 }
  ],
  progress: [
    { patternId: '2.1', status: 'MASTERED' },
    { patternId: '2.2', status: 'IN_PROGRESS' }
  ]
};

export async function GET(request: Request) {
  return NextResponse.json(MOCK_DB);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data.type === 'fluency') {
      MOCK_DB.fluencyScores.push(data.score);
    }
    if (data.type === 'progress') {
      MOCK_DB.progress.push(data.progress);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
