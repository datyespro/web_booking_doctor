import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';

export class DeletePatientUseCase {
    constructor(
        private userRepository: IUserRepository,
        private authService: IAuthService
    ) { }

    async execute(id: string): Promise<void> {
        // 1. Delete from Firestore
        await this.userRepository.delete(id);

        // 2. Delete from Firebase Auth
        // Note: id in Firestore is usually the uid from Auth
        try {
            await this.authService.deleteUser(id);
        } catch (error) {
            console.error(`Failed to delete auth user ${id}:`, error);
            // We might want to throw or just log, depending on strictness.
            // For now, log and proceed as Firestore data is gone.
        }
    }
}
