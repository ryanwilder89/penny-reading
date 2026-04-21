import { NextResponse } from 'next/server';
import { getParentNotesHistory, updateParentNote, deleteParentNote } from '@/db/queries';

export async function GET() {
  try {
    const notesHistory = await getParentNotesHistory();
    return NextResponse.json(notesHistory);
  } catch (error) {
    console.error('Error fetching parent notes history:', error);
    return NextResponse.json({ error: 'Failed to fetch notes history' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, note } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });
    
    await updateParentNote(id, note || '');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating parent note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });

    await deleteParentNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting parent note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
