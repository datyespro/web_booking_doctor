import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

export class GetAllPatientsUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(): Promise<User[]> {
        const users = await this.userRepository.findAll();
        // Filter only patients (or return all users and filter in frontend? Usually backend filtering is better)
        // Assuming 'patient' is the default role or we want to manage all users including admins/doctors?
        // The requirement says "Manage Patients", so let's filter by role 'patient'.
        return users.filter(user => user.role === 'patient');
    }
}
