import type { IDoctorRepository, SearchDoctorFilters } from '../domain/repositories/IDoctorRepository';
import type { Doctor } from '../domain/entities/Doctor';

/**
 * Use Case: Search doctors with filters and sorting
 * Business logic for doctor search is centralized here
 */
export class SearchDoctorsUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(filters: SearchDoctorFilters): Promise<Doctor[]> {
        // Get filtered doctors from repository
        let doctors = await this.doctorRepository.search(filters);

        // Apply sorting (business logic in use case layer)
        if (filters.sortBy) {
            doctors = this.sortDoctors(doctors, filters.sortBy);
        }

        return doctors;
    }

    /**
     * Sort doctors based on criteria
     * This is business logic, so it belongs in the use case, not the repository
     */
    private sortDoctors(doctors: Doctor[], sortBy: string): Doctor[] {
        return doctors.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.pricePerVisit - b.pricePerVisit;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'experience':
                    return (b.experience || 0) - (a.experience || 0);
                case 'bookingCount':
                    return b.bookingCount - a.bookingCount;
                default:
                    return 0;
            }
        });
    }
}
