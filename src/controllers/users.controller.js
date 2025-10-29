import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully fetched all users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validation.error),
      });
    }

    const id = validation.data.id;

    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Successfully fetched user',
      user,
    });
  } catch (e) {
    logger.error('Get user by id error', e);
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Validate params
    const paramsValidation = userIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    // Validate body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const id = paramsValidation.data.id;
    const updates = bodyValidation.data;

    // Authorization: only admin can change role
    if ('role' in updates && req.user?.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Forbidden: insufficient permissions to change role' });
    }

    // Authorization: non-admins can only update themselves
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: cannot update another user' });
    }

    const updated = await updateUserService(id, updates);

    return res.status(200).json({
      message: 'User updated successfully',
      user: updated,
    });
  } catch (e) {
    logger.error('Update user error', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validation.error),
      });
    }

    const id = validation.data.id;

    // Authorization: non-admins can only delete themselves
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      return res
        .status(403)
        .json({ error: 'Forbidden: cannot delete another user' });
    }

    await deleteUserService(id);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    logger.error('Delete user error', e);
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(e);
  }
};
