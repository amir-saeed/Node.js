import { Router } from "express";
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from "../middleware/auth";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/profile", authenticateToken,  userController.getProfile);


/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "John Updated" }
 *               email: { type: string, example: "john.updated@example.com" }
 *               password: { type: string, example: "newpassword123" }
 *               age: { type: integer, example: 26 }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/profile", authenticateToken, userController.updateProfile);

export default router;