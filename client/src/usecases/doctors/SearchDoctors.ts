import type { Doctor } from '../../domain/entities/Doctor';
import type { IDoctorRepository, SearchFilters } from '../../domain/repositories/IDoctorRepository';

/**
 * Use Case: Search doctors with filters
 * Contains business logic for filtering and sorting doctors
 */
export class SearchDoctorsUseCase {
    constructor(private repository: IDoctorRepository) { }

    async execute(filters: SearchFilters): Promise<Doctor[]> {
        // Get doctors from repository (may be partially filtered)
        let doctors = await this.repository.search(filters);

        // Apply client-side filtering for name (fuzzy search)
        if (filters.doctorName && filters.doctorName.trim()) {
            doctors = this.filterByName(doctors, filters.doctorName);
        }

        // Apply sorting (business logic in use case)
        if (filters.sortBy) {
            doctors = this.sortDoctors(doctors, filters.sortBy);
        }

        return doctors;
    }

    /**
     * Filter doctors by name (client-side fuzzy search)
     * Business logic: case-insensitive substring match
     */
    private filterByName(doctors: Doctor[], name: string): Doctor[] {
        const searchTerm = name.toLowerCase().trim();
        return doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Sort doctors based on criteria
     * Business logic for doctor ordering
     */
    private sortDoctors(doctors: Doctor[], sortBy: string): Doctor[] {
        return [...doctors].sort((a, b) => {
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
