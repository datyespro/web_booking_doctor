import type { Doctor } from '../../domain/entities/Doctor';

/**
 * Presenter for formatting Doctor entities for API responses
 * Separates domain entities from API response format
 */
export class DoctorPresenter {
    /**
     * Convert a single Doctor entity to API response format
     */
    static toResponse(doctor: Doctor) {
        return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty || 'Đa khoa',
            avatarUrl: doctor.avatarUrl || '',
            bio: doctor.bio || '',
            pricePerVisit: doctor.pricePerVisit,
            priceFormatted: `${doctor.pricePerVisit.toLocaleString('vi-VN')} VNĐ`,
            clinicAddress: doctor.clinicAddress || 'Chưa cập nhật',
            bookingCount: doctor.bookingCount,
            gender: doctor.gender,
            location: doctor.location,
            experience: doctor.experience,
            rating: doctor.rating ? Number(doctor.rating.toFixed(1)) : undefined,
            reviewCount: doctor.reviewCount,
            workingHours: doctor.workingHours,
        };
    }

    /**
     * Convert an array of Doctor entities to API response format
     */
    static toListResponse(doctors: Doctor[]) {
        return doctors.map(doctor => this.toResponse(doctor));
    }

    /**
     * Convert Doctor entity to summary format (for lists/cards)
     */
    static toSummaryResponse(doctor: Doctor) {
        return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty || 'Đa khoa',
            avatarUrl: doctor.avatarUrl || '',
            pricePerVisit: doctor.pricePerVisit,
            priceFormatted: `${doctor.pricePerVisit.toLocaleString('vi-VN')} VNĐ`,
            rating: doctor.rating ? Number(doctor.rating.toFixed(1)) : undefined,
            reviewCount: doctor.reviewCount,
            location: doctor.location,
        };
    }
}
