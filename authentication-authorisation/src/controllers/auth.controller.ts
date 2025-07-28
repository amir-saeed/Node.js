import { message } from 'antd';
import db from '../config/databse';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { CreateUserDto, LoginDto, TokenResult } from '../types/user.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { Request, Response } from 'express';
// import { db } from '../config/databse';
import crypto from 'crypto';
import { extractAndDecodeToken } from '../utils/tokenDecoder';

const userModel = new UserModel(db);
const authModel = new AuthModel(db);

export class AuthController {

    create = async (req: any, res: any): Promise<void> => {
        try {
            const userData: CreateUserDto = req.body;

            // find that email in the db already exits 
            const existingUser = await userModel.findByEmail(userData.email);
            if (existingUser) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Email already exists'
                    });
            }

            const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const user = await userModel.create(
                {
                    ...userData
                    , password: hashedPassword
                });

            // remove password from the user object before sending it back
            const { password: _, ...userWithoutPassword } = user;

            res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    login = async (req: any, res: any): Promise<void> => {
        try {
            const { email, password }: LoginDto = req.body;

            const existingUser = await userModel.findByEmail(email);
            if (!existingUser) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Email does not exist'
                    });
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Invalid password'
                    });
            }

            const { password: _, ...userWithoutPassword } = existingUser;

            const token = jwt.sign(
                {
                    ...userWithoutPassword
                },
                process.env.JWT_SECRET || 'l+BjLhXf5Ro/c/6SFkhdlQbhBZpHOhxQF9c9T6FeKKI=',
                { expiresIn: '15m' }
            )

            // Generate refresh token (long-lived)
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            console.log('Adding refresh token for user:', refreshToken);

            await authModel.addRefreshToken(existingUser.id, refreshToken, expiresAt);

            res
                .status(200)
                .json({
                    success: true,
                    message: 'Login successful',
                    user: userWithoutPassword,
                    token,
                    refreshToken
                });

        } catch (error) {
            console.error('Error logging in user:', error);
            res
                .status(500)
                .json({
                    success: false,
                    message: 'Login failed',
                    error: error instanceof Error ? error.message : 'Internal server error'
                })
        }
    }

    checkLoginStatus = async (req: AuthRequest, res: Response) => {
        try {
            const tokenResults: TokenResult = extractAndDecodeToken(req);
            if (!tokenResults.user) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Invalid token'
                    });
            }

            const result: any = await userModel.findById(tokenResults.user?.id);

            // Add this after getting the user, before the password destructuring:
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password: _, ...userWithoutPassword } = result;

            if (!result) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'User not found'
                    });
            }

            res
                .status(200)
                .json({
                    success: true,
                    message: 'User is logged in',
                    user: {
                        ...userWithoutPassword
                    }
                });

        } catch (error) {
            res
                .status(401)
                .json({
                    success: false,
                    message: 'Invalid token'
                });
        }
    };

    logout = async (req: AuthRequest, res: Response) => {
        try {

            console.log('ddd55555 results:', req.headers.authorization);

            const resutls: TokenResult = extractAndDecodeToken(req);
            console.log('Logout results:', resutls);

            if (!resutls.user) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Invalid token'
                    });
            }

            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'Refresh token is required'
                    });
            }

            await authModel.removeRefreshToken(resutls.user.id, refreshToken);

            res
                .status(200)
                .json({
                    success: true,
                    message: 'User logged out successfully'
                });

        } catch (error) {
            console.log('Error logging out user:', error);
            res
                .status(500)
                .json({
                    success: false,
                    message: 'Logout failed',
                    error: error instanceof Error ? error.message : 'Internal server error'
                });
        }
    }

    // Logout from all devices
    logoutAll = async (req: any, res: any): Promise<void> => {
        try {

            const resutls: TokenResult = extractAndDecodeToken(req);
            console.log('Logout results:', resutls);

            if (!resutls.user) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Invalid token'
                    });
            }


            const userId = resutls.user.id; // from auth middleware

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            await authModel.removeRefreshTokenAll(userId);

            res.status(200).json({
                success: true,
                message: 'Logged out from all devices'
            });

        } catch (error) {
            console.error('Error during logout all:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ success: false, message: 'Refresh token required' });
            }

            const userId = await authModel.checkRefreshToken(refreshToken);
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Invalid refresh token' });
            }

            // Generate new access token
            const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });

            // Generate new refresh token
            const newRefreshToken = crypto.randomBytes(64).toString('hex');
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // Update refresh token in database
            authModel.updateRefreshToken(userId, newRefreshToken, expiresAt);

            res.json({
                success: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    };
}