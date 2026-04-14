import { NextResponse } from 'next/server';
import { scopeAndSequence } from '@/lib/content/scope-sequence';
import { PASSAGES } from '@/lib/content/passages';
import { WORD_CHAINS } from '@/lib/content/word-chains';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'passages') {
    return NextResponse.json(PASSAGES);
  }
  if (type === 'chains') {
    return NextResponse.json(WORD_CHAINS);
  }
  if (type === 'scope') {
    return NextResponse.json(scopeAndSequence);
  }

  return NextResponse.json({ passages: PASSAGES, chains: WORD_CHAINS, scope: scopeAndSequence });
}
