import { Doctor } from '../domain/entities/Doctor';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';

export class GetMyDoctorProfileUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(userId: string): Promise<Doctor | null> {
        return this.doctorRepository.findByUserId(userId);
    }
}
