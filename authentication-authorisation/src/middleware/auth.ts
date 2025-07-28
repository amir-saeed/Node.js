import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.types';
import { AuthModel } from '../models/auth.model';
import db from '../config/databse';

export interface AuthRequest extends Request {
    user?: User;
}

const authModel = new AuthModel(db);

// export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Access token required'
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET || "", (err, user) => {

//         if (err || !user) {
//             console.error('Token verification failed:', err);
//             return res.status(403).json({
//                 success: false,
//                 message: 'Invalid or expired token'
//             });
//         }

//         if (err) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Invalid or expired token'
//             });
//         }

//         req.user = user as any;

//         next();
//     });
// };

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('0000000>>>>>>', token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || "", async (err, user) => {
        // if (err || !user) {
        //     console.error('Token verification failed:', err);
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Invalid or expired token'
        //     });
        // }


        if (err) {
            console.log('Token verification failed:', err);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Access token expired',
                    code: 'TOKEN_EXPIRED',
                    expiredAt: (err as any).expiredAt
                });
            }

            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token',
                    code: 'INVALID_TOKEN'
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Token verification failed',
                code: 'TOKEN_ERROR'
            });
        }


        // Extract userId from the decoded token
        const decodedUser = user as any;
        console.log('Decoded user:', decodedUser);

        if (!decodedUser) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token structure'
            });
        }

        const userId = decodedUser.userId || decodedUser.id;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload - missing user ID'
            });
        }

        try {
            // Check if user has any valid refresh tokens (means they're still logged in)
            const hasValidRefreshToken = await authModel.checkRefreshAllTokenExists(userId);

            // const hasValidRefreshToken = parseInt(refreshTokenCheck.rows[0].count) > 0;

            if (!hasValidRefreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Session expired - please login again',
                    code: 'SESSION_REVOKED'
                });
            }

            // User is authenticated and has valid session
            req.user = user as any;
            next();

        } catch (dbError) {
            console.log('Database error during auth check:', dbError);
            return res.status(500).json({
                success: false,
                message: 'Authentication check failed'
            });
        }
    });
};