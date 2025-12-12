export interface User {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    address?: string;
    role: 'patient' | 'doctor' | 'admin';
    dob?: string; // YYYY-MM-DD
    gender?: 'male' | 'female' | 'other';
    doctorId?: string; // Linked Doctor ID if role is 'doctor'
    createdAt: Date;
}
