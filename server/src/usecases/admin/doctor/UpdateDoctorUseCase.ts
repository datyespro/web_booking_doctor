import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { Doctor } from '../../../domain/entities/Doctor';
import { IAuthService } from '../../../domain/services/IAuthService';

export interface UpdateDoctorDTO {
    email?: string;
    password?: string;
    name?: string;
    departmentId?: string;
    specialty?: string;
    pricePerVisit?: number;
    clinicAddress?: string;
    avatarUrl?: string;
    bio?: string;
    gender?: 'male' | 'female';
    location?: string;
    experience?: number;
    workingHours?: {
        morning: boolean;
        afternoon: boolean;
        evening: boolean;
    };
}

export class UpdateDoctorUseCase {
    constructor(
        private doctorRepository: IDoctorRepository,
        private authService?: IAuthService // Optional for backward compatibility if needed, but better required
    ) { }

    async execute(id: string, data: UpdateDoctorDTO): Promise<void> {
        // If email or password is being updated, we need to update Auth user as well
        if ((data.email || data.password) && this.authService) {
            // Fetch doctor to get the linked UID
            const doctor = await this.doctorRepository.findById(id);
            if (doctor && doctor.uid) {
                const updateData: { email?: string; password?: string } = {};
                if (data.email) updateData.email = data.email;
                if (data.password) updateData.password = data.password;

                await this.authService.updateUser(doctor.uid, updateData);
            } else {
                console.warn(`Doctor ${id} has no linked UID, skipping Auth update.`);
            }
        }

        // Remove password from data before updating Firestore doctor document
        // as we don't store passwords in Firestore
        const { password, ...firestoreData } = data;

        await this.doctorRepository.update(id, firestoreData);
    }
}
