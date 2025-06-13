import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema/users';
import { likes } from '@/db/schema/likes';
import { auth } from '@/lib/auth';
import { ROLES } from '@/types/role';
import { eq } from 'drizzle-orm';

// Get a single user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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

    // Fetch the user by ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0] || null);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch the liked resources for the user
    const likedResources = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, userId))
      .then((res) => res);

    const response = {
      ...user,
      likedResources,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error fetching user:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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

    const body = await req.json();
    const allowSelfDelete = body?.allowSelfDelete ?? false;
    if (userId === session.user.id && !allowSelfDelete) {
      return NextResponse.json(
        { error: 'Cannot delete your own account this way' },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0] || null);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting user:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// Update a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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

    const body = await req.json();

    if (!body.role || typeof body.role !== 'string') {
      return NextResponse.json(
        { error: 'Role is required and must be a string' },
        { status: 400 }
      );
    }

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    if (userId === session.user.id && body.role !== ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'Cannot remove admin rights from your own account' },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0] || null);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.update(users).set({ role: body.role }).where(eq(users.id, userId));

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0]);

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating user:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
