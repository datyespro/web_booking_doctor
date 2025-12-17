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

        // 3. Create User in Firestore - only include defined fields to avoid Firestore undefined error
        const newUser: User = {
            id: uid,
            email: data.email,
            displayName: data.displayName,
            role: 'patient',
            createdAt: new Date()
        };

        // Only add optional fields if they have values
        if (data.phoneNumber) newUser.phoneNumber = data.phoneNumber;
        if (data.address) newUser.address = data.address;
        if (data.dob) newUser.dob = data.dob;
        if (data.gender) newUser.gender = data.gender;

        await this.userRepository.create(newUser);

        return newUser;
    }
}
