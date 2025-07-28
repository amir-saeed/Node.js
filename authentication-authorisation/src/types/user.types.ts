export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
    created_at: Date;
    updated_at: Date;
}


export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    age: number;
}

export interface LoginDto {
    email: string;
    password: string;
}


export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    age?: number;
}

export interface TokenResult {
    user: User | null;
    error: string | null;
}