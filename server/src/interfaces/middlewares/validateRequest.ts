import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationException } from '../../domain/exceptions/ValidationException';

/**
 * Middleware factory to validate request data against a Zod schema
 * @param schema Zod schema to validate against
 * @param source Where to read data from: 'body', 'query', or 'params'
 */
export function validateRequest(
    schema: z.ZodSchema,
    source: 'body' | 'query' | 'params' = 'body'
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate and parse the data
            const validated = schema.parse(req[source]);
            // Replace original data with validated/coerced data
            req[source] = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Convert Zod errors to domain exception
                next(new ValidationException(
                    'Request validation failed',
                    error.issues
                ));
            } else {
                next(error);
            }
        }
    };
}
