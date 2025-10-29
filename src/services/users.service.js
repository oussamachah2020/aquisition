import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users: ', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return rows[0] || null;
  } catch (e) {
    logger.error('Error getting user by id: ', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Ensure user exists
    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existing.length === 0) throw new Error('User not found');

    const payload = { ...updates };

    if (payload.password) {
      // Hash new password
      payload.password = await hashPassword(payload.password);
    }

    // Always bump updated_at
    payload.updated_at = new Date();

    const [updated] = await db
      .update(users)
      .set(payload)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return updated;
  } catch (e) {
    logger.error('Error updating user: ', e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!deleted) throw new Error('User not found');

    return deleted;
  } catch (e) {
    logger.error('Error deleting user: ', e);
    throw e;
  }
};
