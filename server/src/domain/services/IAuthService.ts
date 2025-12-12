export interface IAuthService {
    createUser(email: string, password: string, displayName: string): Promise<string>; // Returns UID
    deleteUser(uid: string): Promise<void>;
    updateUser(uid: string, data: { email?: string; password?: string; displayName?: string }): Promise<void>;
    setCustomClaims(uid: string, claims: { role: 'patient' | 'doctor' | 'admin'; doctorId?: string }): Promise<void>;
}
