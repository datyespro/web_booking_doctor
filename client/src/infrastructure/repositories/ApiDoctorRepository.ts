import { IDoctorRepository, SearchFilters } from '../../domain/repositories/IDoctorRepository';
import { Doctor } from '../../domain/entities/Doctor';
import apiClient from '../http/httpClient';

/**
 * Doctor DTO from API - API response structure
 */
interface DoctorDTO {
    id: string;
    name: string;
    specialty?: string;
    avatarUrl?: string;
    bio?: string;
    pricePerVisit: number;
    priceFormatted?: string; // Backend sends this but we don't use it
    clinicAddress?: string;
    bookingCount: number;
    gender?: 'male' | 'female';
    location?: string;
    experience?: number;
    rating?: number;
    reviewCount?: number;
    workingHours?: {
        morning: boolean;
        afternoon: boolean;
        evening: boolean;
    };
}

/**
 * API implementation of IDoctorRepository
 * Converts between API DTOs and Domain Entities
 */
export class ApiDoctorRepository implements IDoctorRepository {
    async getAll(): Promise<Doctor[]> {
        const response = await apiClient.get<DoctorDTO[]>('/doctors');
        return response.data.map(dto => this.toDomain(dto));
    }

    async getById(id: string): Promise<Doctor> {
        const response = await apiClient.get<DoctorDTO>(`/doctors/${id}`);
        return this.toDomain(response.data);
    }

    async search(filters: SearchFilters): Promise<Doctor[]> {
        const params = this.buildQueryParams(filters);
        const response = await apiClient.get<DoctorDTO[]>(`/doctors/search?${params}`);

        // Convert DTOs to domain entities
        return response.data.map(dto => this.toDomain(dto));
    }

    /**
     * Convert API DTO to Domain Entity
     * This is where we map API response to our domain model
     */
    private toDomain(dto: DoctorDTO): Doctor {
        return new Doctor(
            dto.id,
            dto.name,
            dto.specialty || '',
            dto.avatarUrl || '',
            dto.bio || '',
            dto.pricePerVisit,
            dto.clinicAddress || '',
            dto.bookingCount,
            dto.gender,
            dto.location,
            dto.experience,
            dto.rating,
            dto.reviewCount,
            dto.workingHours
        );
    }

    /**
     * Build query parameters for search
     * Only include backend-supported filters
     */
    private buildQueryParams(filters: SearchFilters): string {
        const params = new URLSearchParams();

        if (filters.specialty) params.append('specialty', filters.specialty);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.location) params.append('location', filters.location);
        if (filters.availability) params.append('availability', filters.availability);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        // Note: doctorName is NOT sent to backend, it's filtered client-side in the use case

        return params.toString();
    }
}
