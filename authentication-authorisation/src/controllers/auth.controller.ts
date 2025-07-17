import { message } from 'antd';
import db from '../config/databse';
import { UserModel } from '../models/user.model';
import { CreateUserDto, LoginDto } from '../types/user.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userModel = new UserModel(db);

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

            // find that email in the db already exits 
            const existingUser = await userModel.findByEmail(email);
            if (!existingUser) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Email does not exist'
                    });
            }

            // check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(400).json(
                    {
                        success: false,
                        message: 'Invalid password'
                    });
            }

            // remove password from the user object before sending it back
            const { password: _, ...userWithoutPassword } = existingUser;

            const token = jwt.sign(
                {
                    ...userWithoutPassword
                },
                process.env.JWT_SECRET || 'l+BjLhXf5Ro/c/6SFkhdlQbhBZpHOhxQF9c9T6FeKKI=',
                { expiresIn: '1h' },
            )

            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json(
                {
                    success: false,
                    message: 'Login failed',
                    error: error instanceof Error ? error.message : 'Internal server error'
                })
        }
    }
}