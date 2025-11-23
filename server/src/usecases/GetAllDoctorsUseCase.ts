import { Doctor } from '../domain/entities/Doctor';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';

export class GetAllDoctorsUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(): Promise<Doctor[]> {
        return await this.doctorRepository.findAll();
    }
}
