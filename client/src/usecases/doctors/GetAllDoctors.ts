import type { Doctor } from '../../domain/entities/Doctor';
import type { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';

/**
 * Use Case: Get all doctors
 * Application business logic for retrieving all doctors
 */
export class GetAllDoctorsUseCase {
    constructor(private repository: IDoctorRepository) { }

    async execute(): Promise<Doctor[]> {
        return await this.repository.getAll();
    }
}
