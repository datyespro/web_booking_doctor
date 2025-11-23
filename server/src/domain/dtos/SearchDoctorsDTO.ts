import { z } from 'zod';

/**
 * DTO Schema for searching doctors
 * Validates and types the search query parameters
 */
export const SearchDoctorsSchema = z.object({
    specialty: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    location: z.string().optional(),
    availability: z.enum(['morning', 'afternoon', 'evening']).optional(),
    sortBy: z.enum(['price', 'rating', 'experience', 'bookingCount']).optional(),
});

export type SearchDoctorsDTO = z.infer<typeof SearchDoctorsSchema>;
