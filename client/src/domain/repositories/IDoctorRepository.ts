import type { Doctor } from '../entities/Doctor';

/**
 * Search filters for doctors
 */
export interface SearchFilters {
    specialty?: string;
    gender?: 'male' | 'female';
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    doctorName?: string;
    availability?: 'morning' | 'afternoon' | 'evening';
    sortBy?: 'price' | 'rating' | 'experience' | 'bookingCount';
}

/**
 * Repository interface for Doctor operations
 * This is an abstraction - concrete implementation will be in infrastructure layer
 */
export interface IDoctorRepository {
    /**
     * Get all doctors
     */
    getAll(): Promise<Doctor[]>;

    /**
     * Get doctor by ID
     * @throws Error if doctor not found
     */
    getById(id: string): Promise<Doctor>;

    /**
     * Search doctors with filters
     */
    search(filters: SearchFilters): Promise<Doctor[]>;
}
