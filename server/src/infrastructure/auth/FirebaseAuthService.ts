import { IAuthService } from '../../domain/services/IAuthService';
import { admin } from '../database/firestore';

export class FirebaseAuthService implements IAuthService {
    async createUser(email: string, password: string, displayName: string): Promise<string> {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
            emailVerified: true, // Auto verify for admin created accounts
        });
        return userRecord.uid;
    }

    async deleteUser(uid: string): Promise<void> {
        await admin.auth().deleteUser(uid);
    }

    async updateUser(uid: string, data: { email?: string; password?: string; displayName?: string }): Promise<void> {
        await admin.auth().updateUser(uid, data);
    }

    async setCustomClaims(uid: string, claims: { role: 'patient' | 'doctor' | 'admin'; doctorId?: string }): Promise<void> {
        await admin.auth().setCustomUserClaims(uid, claims);
    }
}
