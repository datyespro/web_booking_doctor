import type { Doctor } from '../../domain/entities/Doctor';
import type { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';

/**
 * Use Case: Get doctor by ID
 * Application business logic for retrieving a single doctor
 */
export class GetDoctorByIdUseCase {
    constructor(private repository: IDoctorRepository) { }

    async execute(id: string): Promise<Doctor> {
        return await this.repository.getById(id);
    }
}
