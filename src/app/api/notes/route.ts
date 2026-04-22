import { NextResponse } from 'next/server';
import { getParentNotesHistory, updateParentNote, deleteParentNote } from '@/db/queries';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notesHistory = await getParentNotesHistory(session.user.id);
    return NextResponse.json(notesHistory);
  } catch (error) {
    console.error('Error fetching parent notes history:', error);
    return NextResponse.json({ error: 'Failed to fetch notes history' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, note } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });
    
    await updateParentNote(id, note || '', session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating parent note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });

    await deleteParentNote(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting parent note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}

