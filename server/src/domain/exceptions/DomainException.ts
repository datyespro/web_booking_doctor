/**
 * Base class for all domain exceptions
 * Provides consistent error handling
 */
export class DomainException extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly errors?: any[]; // For ValidationException details

    constructor(message: string, statusCode: number = 500, code: string = 'DOMAIN_ERROR', errors?: any[]) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
