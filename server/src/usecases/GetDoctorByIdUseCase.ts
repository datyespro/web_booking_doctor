import { Doctor } from '../domain/entities/Doctor';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { DoctorNotFoundException } from '../domain/exceptions/DoctorNotFoundException';

/**
 * Use Case: Get doctor by ID
 * Throws exception if doctor not found
 */
export class GetDoctorByIdUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(id: string): Promise<Doctor> {
        const doctor = await this.doctorRepository.findById(id);

        if (!doctor) {
            throw new DoctorNotFoundException(id);
        }

        return doctor;
    }
}
