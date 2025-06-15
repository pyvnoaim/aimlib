import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema/users';
import { auth } from '@/lib/auth';
import { ROLES } from '@/types/role';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const userList = await db.select().from(users);
    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
