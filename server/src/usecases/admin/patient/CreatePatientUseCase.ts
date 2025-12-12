import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';
import { User } from '../../../domain/entities/User';

export interface CreatePatientDTO {
    email: string;
    password: string;
    displayName: string;
    phoneNumber?: string;
    address?: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
}

export class CreatePatientUseCase {
    constructor(
        private userRepository: IUserRepository,
        private authService: IAuthService
    ) { }

    async execute(data: CreatePatientDTO): Promise<User> {
        // 1. Create User in Firebase Auth
        const uid = await this.authService.createUser(data.email, data.password, data.displayName);

        // 2. Set Custom Claims for role (tamper-proof)
        await this.authService.setCustomClaims(uid, { role: 'patient' });

        // 3. Create User in Firestore
        const newUser: User = {
            id: uid,
            email: data.email,
            displayName: data.displayName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            role: 'patient',
            dob: data.dob,
            gender: data.gender,
            createdAt: new Date()
        };

        await this.userRepository.create(newUser);

        return newUser;
    }
}
