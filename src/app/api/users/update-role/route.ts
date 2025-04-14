import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ROLES } from '@/types/role';

export async function POST(req: NextRequest) {
  try {
    const { userId, newRole, currentUserId } = await req.json();

    if (!userId || !newRole || !currentUserId) {
      return new NextResponse('Missing userId, newRole, or currentUserId', {
        status: 400,
      });
    }

    if (!Object.values(ROLES).includes(newRole)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUserId));

    if (!currentUser || currentUser[0].role !== ROLES.ADMIN) {
      return new NextResponse('Unauthorized: Only Admins can update roles', {
        status: 403,
      });
    }

    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: 'Role updated successfully',
      user: updatedUser[0],
    });
  } catch (error) {
    console.error(error);

    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new NextResponse(errorMessage, { status: 500 });
  }
}
