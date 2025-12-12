import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';
import { User } from '../../../domain/entities/User';

export interface UpdatePatientDTO {
    email?: string;
    password?: string;
    displayName?: string;
    phoneNumber?: string;
    address?: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
}

export class UpdatePatientUseCase {
    constructor(
        private userRepository: IUserRepository,
        private authService: IAuthService
    ) { }

    async execute(id: string, data: UpdatePatientDTO): Promise<void> {
        // Get user to find Firebase UID
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Patient not found');
        }

        // Update Firebase Auth if email or password provided
        const authUpdate: { email?: string; password?: string } = {};
        if (data.email && data.email !== user.email) {
            authUpdate.email = data.email;
        }
        if (data.password && data.password.length >= 6) {
            authUpdate.password = data.password;
        }

        if (Object.keys(authUpdate).length > 0) {
            await this.authService.updateUser(id, authUpdate);
        }

        // Update Firestore (exclude password from Firestore update)
        const { password, ...firestoreData } = data;
        await this.userRepository.update(id, firestoreData);
    }
}
