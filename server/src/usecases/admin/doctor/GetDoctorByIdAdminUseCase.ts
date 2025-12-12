import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';

export class GetDoctorByIdAdminUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(id: string) {
        return await this.doctorRepository.findById(id);
    }
}
