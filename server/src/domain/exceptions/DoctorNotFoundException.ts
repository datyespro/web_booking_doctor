import { DomainException } from './DomainException';

/**
 * Exception thrown when a requested doctor is not found
 */
export class DoctorNotFoundException extends DomainException {
    constructor(doctorId: string) {
        super(
            `Doctor with ID "${doctorId}" not found`,
            404,
            'DOCTOR_NOT_FOUND'
        );
    }
}
