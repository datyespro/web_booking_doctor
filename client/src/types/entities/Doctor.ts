export interface Doctor {
    id: string;
    name: string;
    specialty?: string;
    avatarUrl?: string;
    pricePerVisit: number;
    clinicAddress?: string;
    bio?: string;

    // Search & filter fields
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
