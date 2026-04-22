import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await db.insert(users).values({
      id: newId,
      email,
      password: hashedPassword,
      name: email.split('@')[0], // Default name
    });

    return NextResponse.json({ success: true, message: 'User created' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
