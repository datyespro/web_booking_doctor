import api from '../http';
import type { Doctor } from '../../types/entities/Doctor';
import type { DailySchedule } from '../../types/entities/Schedule';
import type { SearchDoctorFilters } from '../../types/SearchFilters';

export class DoctorRepository {
    /**
     * Get all doctors
     */
    async getAll(): Promise<Doctor[]> {
        const response = await api.get<Doctor[]>('/doctors');
        return response.data;
    }

    /**
     * Get doctor by ID
     */
    async getById(id: string): Promise<Doctor> {
        const response = await api.get<Doctor>(`/doctors/${id}`);
        return response.data;
    }

    /**
     * Search doctors with filters
     */
    async search(filters: SearchDoctorFilters): Promise<Doctor[]> {
        const params = new URLSearchParams();

        // Only send filters that backend understands
        if (filters.specialty) params.append('specialty', filters.specialty);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.location) params.append('location', filters.location);
        if (filters.availability) params.append('availability', filters.availability);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const response = await api.get<Doctor[]>(`/doctors/search?${params.toString()}`);
        let doctors = response.data;

        // Client-side filtering for doctor name (fuzzy search)
        if (filters.doctorName && filters.doctorName.trim()) {
            const searchTerm = filters.doctorName.toLowerCase().trim();
            doctors = doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm)
            );
        }

        return doctors;
    }

    /**
     * Get doctor's schedule for a specific date
     */
    async getSchedule(doctorId: string, date: string): Promise<DailySchedule> {
        const response = await api.get<DailySchedule>(`/doctors/${doctorId}/schedule`, {
            params: { date }
        });
        return response.data;
    }
}

// Export singleton instance
export const doctorRepository = new DoctorRepository();
