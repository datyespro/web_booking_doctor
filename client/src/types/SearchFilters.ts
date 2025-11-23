export interface SearchDoctorFilters {
    doctorName?: string; // Search by doctor name
    specialty?: string;
    gender?: 'male' | 'female';
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    availability?: 'morning' | 'afternoon' | 'evening';
    sortBy?: 'price' | 'rating' | 'experience' | 'bookingCount';
}
