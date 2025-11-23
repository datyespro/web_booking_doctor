import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../../domain/exceptions/DomainException';

/**
 * Global error handling middleware
 * Handles both domain exceptions and unexpected errors
 */
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global Error:', err);

    // Handle domain exceptions first
    if (err instanceof DomainException) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
            ...(err.errors && { details: err.errors })
        });
    }

    // Default error handling
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Map known legacy errors
    if (err.message === 'Time slot is already booked') {
        statusCode = 409; // Conflict
        message = err.message;
    } else if (err.message === 'Time slot not found' || err.message === 'Doctor does not have a schedule for this date') {
        statusCode = 404; // Not Found
        message = err.message;
    } else if (err.name === 'ZodError') {
        statusCode = 400; // Bad Request
        message = 'Validation Error';
        return res.status(statusCode).json({ error: message, details: err.errors });
    }

    res.status(statusCode).json({ error: message });
};
