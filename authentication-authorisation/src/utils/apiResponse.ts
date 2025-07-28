// utils/apiResponse.ts - Standardized response format
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    code?: string;
    data?: T;
    errors?: ValidationError[];
    timestamp?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

// Response helper functions
export const successResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
});

export const errorResponse = (message: string, code?: string, errors?: ValidationError[]): ApiResponse => ({
    success: false,
    message,
    code,
    errors,
    timestamp: new Date().toISOString()
});

// Standard error codes
export const ERROR_CODES = {
    // Authentication
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_MISSING: 'TOKEN_MISSING',
    SESSION_REVOKED: 'SESSION_REVOKED',
    REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',

    // Authorization
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    ACCESS_DENIED: 'ACCESS_DENIED',

    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
    PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',

    // User Management
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

    // Rate Limiting
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    LOGIN_ATTEMPTS_EXCEEDED: 'LOGIN_ATTEMPTS_EXCEEDED',

    // System
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    DATABASE_ERROR: 'DATABASE_ERROR'
};