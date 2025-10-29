import {
  fetchAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/users.controller.js';
import express from 'express';
import { requireAuth, requireRole } from '#middleware/auth.middleware.js';

const router = express.Router();

// Admin-only: list all users
router.get('/', requireRole('admin'), fetchAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;
