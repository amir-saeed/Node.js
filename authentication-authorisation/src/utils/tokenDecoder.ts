import { AuthRequest } from "../middleware/auth";
import jwt from 'jsonwebtoken';
import { TokenResult, User } from "../types/user.types";

export const extractAndDecodeToken = (req: AuthRequest): TokenResult => {
    try {

        console.log('Extracting token from request headers...', req.headers.authorization);
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return { user: null, error: 'No token provided' };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;

     

        if (!decoded || !decoded.id) {
            return { user: null, error: 'Invalid token structure' };
        }
        
        return { user: decoded, error: null };

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { user: null, error: 'Token expired' };
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return { user: null, error: 'Invalid token' };
        }
        return { user: null, error: 'Token verification failed' };
    }
};