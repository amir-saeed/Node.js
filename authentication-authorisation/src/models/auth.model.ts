import { Pool } from 'pg'
// import { UpdateUserDto, User } from '../types/user.types';

export class AuthModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    addRefreshToken = async (id: number, refreshToken: string, expiresAt: Date): Promise<void> => {
        const query = 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)';
        const result = await this.db.query(query, [id, refreshToken, expiresAt]);
        return result.rows[0] || null;
    }

    removeRefreshToken = async (id: number, refreshToken: string): Promise<void> => {
        const query = 'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2';
        console.log('Removing refresh token:', id, refreshToken);
        await this.db.query(query, [id, refreshToken]);
    }

    removeRefreshTokenAll = async (id: number): Promise<void> => {
        const query = 'DELETE FROM refresh_tokens WHERE user_id = $1';
        await this.db.query(query, [id]);
    }

    checkRefreshToken = async (refreshToken: string): Promise<number | null> => {
        // Check if refresh token exists and is valid
        const tokenQuery = 'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()';
        const result = await this.db.query(tokenQuery, [refreshToken]);

        if (result.rows.length === 0) {
            return null; // Invalid token
        }
        return result.rows[0].user_id; // Return user ID associated with the token
    }

    updateRefreshToken = async (userId: number, newRefreshToken: string, expiresAt: Date): Promise<void> => {
        const query = 'UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE user_id = $3';
        const result = await this.db.query(query, [newRefreshToken, expiresAt, userId]);
        if (result.rowCount === 0) {
            throw new Error('Failed to update refresh token');
        }
    }

    checkRefreshAllTokenExists = async (userId: number): Promise<boolean> => {
        const query = 'SELECT COUNT(*) as count FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()';
        const result = await this.db.query(query, [userId]);
        return parseInt(result.rows[0].count) > 0;
    }
}