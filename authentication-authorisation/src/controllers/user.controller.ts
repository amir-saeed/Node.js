
import db from '../config/databse';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from '../types/user.types';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const userModel = new UserModel(db);

export class UserController {

    getProfile = async (req: AuthRequest, res: Response) => {
        try {

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password, ...userProfile } = user;
            res.json({
                success: true,
                data: userProfile,
                message: 'Profile retrieved successfully'
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve profile',
                error: error.message
            });
        }
    };

    updateProfile = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const updateData: UpdateUserDto = req.body;

            // Hash password if provided
            if (updateData.password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(updateData.password, saltRounds);
            }

            const updatedUser = await userModel.update(userId, updateData);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove password from response
            const { password, ...userProfile } = updatedUser;

            res.json({
                success: true,
                data: userProfile,
                message: 'Profile updated successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    };
}