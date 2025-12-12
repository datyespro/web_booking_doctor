/**
 * View Model for Doctor
 * UI-friendly data structure optimized for rendering
 */
export interface DoctorViewModel {
    id: string;
    name: string;
    specialty: string;
    avatarUrl: string;
    bio: string;

    // Formatted display values
    displayRating: string;          // "4.5 ⭐⭐⭐⭐⭐ (120 đánh giá)"
    formattedPrice: string;          // "200,000 VNĐ"

    // UI indicators
    isHighlyRated: boolean;          // For badges/highlighting
    experienceLevel: string;         // "Bác sĩ chuyên môn cao"
    experienceYears: number;
    rating: number;                  // Numeric rating for sorting

    // Additional info
    clinicAddress: string;
    location?: string;
    gender?: string;

    // Working hours for quick check
    worksInMorning: boolean;
    worksInAfternoon: boolean;
    worksInEvening: boolean;
}
