import { Pool } from 'pg'
import { UpdateUserDto, User } from '../types/user.types';

export class UserModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    create = async (userData: any): Promise<User> => {
        const query = `
          INSERT INTO users(
	        name, email, password, age)
	        VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        const result = await this.db.query(query, [userData.name, userData.email, userData.password, userData.age]);
        return result.rows[0];
    }

    findByEmail = async (email: string): Promise<User | null> => {
        const query = `
            SELECT id, name, email, password, age, created_at, updated_at FROM users WHERE email = $1
        `;
        const result = await this.db.query(query, [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    findById = async (id: number): Promise<User | null> => {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0] || null;
    }

    update = async (id: number, userData: UpdateUserDto): Promise<User | null> => {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (userData.name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(userData.name);
            paramCount++;
        }

        if (userData.email !== undefined) {
            fields.push(`email = $${paramCount}`);
            values.push(userData.email);
            paramCount++;
        }

        if (userData.password !== undefined) {
            fields.push(`password = $${paramCount}`);
            values.push(userData.password);
            paramCount++;
        }

        if (userData.age !== undefined) {
            fields.push(`age = $${paramCount}`);
            values.push(userData.age);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        const query = `
          UPDATE users 
          SET ${fields.join(', ')} 
          WHERE id = $${paramCount} 
          RETURNING *
        `;
        values.push(id);

        const result = await this.db.query(query, values);
        return result.rows[0] || null;
    }
}