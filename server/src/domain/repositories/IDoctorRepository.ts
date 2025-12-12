import { Doctor } from '../entities/Doctor';
import { DailySchedule } from '../entities/Schedule';

export interface SearchDoctorFilters {
    specialty?: string;
    gender?: 'male' | 'female';
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    availability?: 'morning' | 'afternoon' | 'evening';
    sortBy?: 'price' | 'rating' | 'experience' | 'bookingCount';
}

export interface IDoctorRepository {
    findAll(): Promise<Doctor[]>;
    findById(id: string): Promise<Doctor | null>;
    findByUserId(uid: string): Promise<Doctor | null>;
    search(filters: SearchDoctorFilters): Promise<Doctor[]>;
    getSchedule(doctorId: string, date: string): Promise<DailySchedule | null>;
    updateSchedule(schedule: DailySchedule): Promise<void>;

    // Admin CRUD
    create(doctor: Doctor): Promise<void>;
    update(id: string, doctor: Partial<Doctor>): Promise<void>;
    delete(id: string): Promise<void>;
}
