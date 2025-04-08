import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

// User routes
router.post('/', UserController.createUser);
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);

export default router;