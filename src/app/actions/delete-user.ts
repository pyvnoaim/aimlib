'use server';

import { db } from '@/db/index';
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
} from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteUserById(userId: string) {
  try {
    // Delete related records first
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(sessions).where(eq(sessions.userId, userId));
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, userId));
    await db.delete(authenticators).where(eq(authenticators.userId, userId));

    // Then delete the user
    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
