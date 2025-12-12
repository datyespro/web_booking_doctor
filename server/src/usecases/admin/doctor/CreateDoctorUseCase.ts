import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';
import { Doctor } from '../../../domain/entities/Doctor';
import { User } from '../../../domain/entities/User';
import { db } from '../../../infrastructure/database/firestore';

export interface CreateDoctorDTO {
    email: string;
    password: string;
    name: string;
    departmentId: string;
    specialty?: string;
    pricePerVisit: number;
    clinicAddress?: string;
    avatarUrl?: string;
    bio?: string;
    gender?: 'male' | 'female';
    location?: string;
    experience?: number;
}

export class CreateDoctorUseCase {
    constructor(
        private doctorRepository: IDoctorRepository,
        private userRepository: IUserRepository,
        private authService: IAuthService
    ) { }

    async execute(data: CreateDoctorDTO): Promise<Doctor> {
        // 1. Create User in Firebase Auth
        const uid = await this.authService.createUser(data.email, data.password, data.name);

        // 2. Create Doctor Profile in Firestore
        // We'll use the same ID as UID for simplicity, or generate a new one?
        // Existing code seems to use auto-generated IDs for doctors usually, but linked via uid field.
        // Let's generate a new ID for doctor to keep it separate from User ID, but link them.
        // Actually, using UID as Doctor ID might be cleaner if 1-to-1, but let's follow existing pattern.
        // Existing pattern: Doctor has 'id' and 'uid'.

        const doctorId = db.collection('doctors').doc().id; // We need 'db' access or just let repo handle ID generation?
        // Ideally repo handles it or we pass a generated ID.
        // Let's assume we can generate ID here or pass null to repo?
        // The Doctor entity requires ID.
        // Let's import uuid or just use a placeholder and let repo set it?
        // Better: Use the UID as the Doctor ID? No, existing doctors might not follow this.
        // Let's just use a random string or timestamp for now if we don't have uuid lib.
        // Or better, let's use the UID as the Doctor ID as well? No, that might conflict if we have other collections.
        // Let's use a simple random ID generator.
        const newDoctorId = 'doc_' + Date.now();

        const newDoctor: Doctor = {
            id: newDoctorId,
            uid: uid,
            email: data.email,
            name: data.name,
            departmentId: data.departmentId,
            specialty: data.specialty,
            pricePerVisit: data.pricePerVisit,
            clinicAddress: data.clinicAddress,
            bookingCount: 0,
            avatarUrl: data.avatarUrl,
            bio: data.bio,
            gender: data.gender,
            location: data.location,
            experience: data.experience,
            rating: 0,
            reviewCount: 0,
            workingHours: {
                morning: true,
                afternoon: true,
                evening: false
            }
        };

        await this.doctorRepository.create(newDoctor);

        // 3. Set Custom Claims for role (tamper-proof)
        await this.authService.setCustomClaims(uid, { role: 'doctor', doctorId: newDoctorId });

        // 4. Create User in Firestore (linked to Doctor)
        const newUser: User = {
            id: uid,
            email: data.email,
            displayName: data.name,
            role: 'doctor',
            doctorId: newDoctorId,
            createdAt: new Date()
        };

        await this.userRepository.create(newUser);

        return newDoctor;
    }
}

// Helper for ID generation if needed, but for now simple string is fine.
// Note: 'db' import is not available here in UseCase (Clean Arch).
// So we should rely on Repo to generate ID?
// Or just use a simple random string.
// 'doc_' + Math.random().toString(36).substr(2, 9);
