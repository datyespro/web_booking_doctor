import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { Doctor } from '../../../domain/entities/Doctor';

export class GetAllDoctorsAdminUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(): Promise<Doctor[]> {
        return this.doctorRepository.findAll();
    }
}
