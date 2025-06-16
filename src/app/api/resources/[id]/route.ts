import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { resources } from '@/db/schema/resources';
import { auth } from '@/lib/auth';
import { ROLES } from '@/types/role';
import { eq } from 'drizzle-orm';

// Get a single resource by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    const { id: resourceId } = await params;
    const resource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, resourceId))
      .then((res) => res[0] || null);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    const { id } = await params;
    console.error(`Error fetching resource ${id}:`, error);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// Delete a resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: resourceId } = await params;
    const existingResource = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.id, resourceId))
      .then((res) => res[0] || null);

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    await db.delete(resources).where(eq(resources.id, resourceId));

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const { id } = await params;
    console.error(`Error deleting resource ${id}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// Update a resource
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: resourceId } = await params;
    const body = await request.json();

    // Check if the resource name is valid
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if the resource type is valid
    if (
      !body.type ||
      !['Crosshair', 'Sound', 'Theme', 'Playlist'].includes(body.type)
    ) {
      return NextResponse.json(
        { error: 'Type must be one of: Crosshair, Sound, Theme, Playlist' },
        { status: 400 }
      );
    }

    const existingResource = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.id, resourceId))
      .then((res) => res[0] || null);

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Update the resource
    const updatedData = {
      name: body.name,
      type: body.type,
      updatedAt: new Date(),
    };

    await db
      .update(resources)
      .set(updatedData)
      .where(eq(resources.id, resourceId));

    const updatedResource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, resourceId))
      .then((res) => res[0]);

    return NextResponse.json(
      { message: 'Resource updated successfully', resource: updatedResource },
      { status: 200 }
    );
  } catch (error) {
    const { id } = await params;
    console.error(`Error updating resource ${id}:`, error);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
