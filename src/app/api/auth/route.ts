import { NextResponse } from 'next/server';

const MOCK_PIN = "1234"; // Setup in MVP

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    if (pin === MOCK_PIN) {
      return NextResponse.json({ success: true, message: "Authorized" }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: "Invalid PIN" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bad Request" }, { status: 400 });
  }
}
