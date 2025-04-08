import { Request, Response } from 'express';
import User from '../models/User';

export class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = new User(userData);
      await user.save();
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  // Get all users
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}