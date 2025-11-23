export interface Doctor {
    id: string;
    name: string;
    departmentId: string; // Link to Department
    specialty?: string; // Keep for backward compatibility or display
    avatarUrl?: string;
    bio?: string;
    pricePerVisit: number;
    clinicAddress?: string;
    bookingCount: number; // For sorting popular doctors

    // New fields for search & filter
    gender?: 'male' | 'female';
    location?: string; // City/District
    experience?: number; // Years of experience
    rating?: number; // Average rating (1-5)
    reviewCount?: number; // Total reviews
    workingHours?: {
        morning: boolean;
        afternoon: boolean;
        evening: boolean;
    };
}
