import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';

export class DeleteDoctorUseCase {
    constructor(
        private doctorRepository: IDoctorRepository,
        private userRepository: IUserRepository,
        private authService: IAuthService
    ) { }

    async execute(id: string): Promise<void> {
        // 1. Get Doctor to find UID
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) return;

        // 2. Delete Doctor Profile
        await this.doctorRepository.delete(id);

        // 3. Delete Linked User and Auth
        if (doctor.uid) {
            // Delete User from Firestore
            await this.userRepository.delete(doctor.uid);

            // Delete Auth User
            try {
                await this.authService.deleteUser(doctor.uid);
            } catch (error) {
                console.error(`Failed to delete auth user ${doctor.uid}:`, error);
            }
        }
    }
}
