import { DomainException } from './DomainException';

/**
 * Exception for validation errors
 */
export class ValidationException extends DomainException {
    constructor(message: string = 'Validation failed', errors?: any[]) {
        super(message, 400, 'VALIDATION_ERROR', errors);
    }
}
