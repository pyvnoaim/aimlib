import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
      })
      .from(users);

    if (!allUsers.length) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);

    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new NextResponse(errorMessage, { status: 500 });
  }
}
