import { Doctor } from '../../domain/entities/Doctor';
import { DoctorViewModel } from '../viewmodels/DoctorViewModel';

/**
 * Presenter for converting Doctor entities to ViewModels
 * Separates domain entities from UI representation
 */
export class DoctorPresenter {
    /**
     * Convert a single Doctor entity to ViewModel
     */
    toViewModel(doctor: Doctor): DoctorViewModel {
        const genderMap = {
            male: 'Nam',
            female: 'Nữ',
        };

        return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty || 'Đa khoa',
            avatarUrl: doctor.avatarUrl || '/default-avatar.png',
            bio: doctor.bio || '',

            // Raw values for calculations
            pricePerVisit: doctor.pricePerVisit,
            experience: doctor.experience,

            // Use entity business methods for formatting
            displayRating: doctor.getDisplayRating(),
            formattedPrice: doctor.getFormattedPrice(),

            // Use entity business logic
            isHighlyRated: doctor.isHighlyRated(),
            experienceLevel: doctor.getExperienceLevelText(),
            experienceYears: doctor.experience || 0,
            rating: doctor.rating || 0,

            clinicAddress: doctor.clinicAddress || 'Chưa cập nhật',
            location: doctor.location,
            gender: doctor.gender ? genderMap[doctor.gender] : undefined,

            // Working hours flags
            worksInMorning: doctor.isAvailableIn('morning'),
            worksInAfternoon: doctor.isAvailableIn('afternoon'),
            worksInEvening: doctor.isAvailableIn('evening'),
        };
    }

    /**
     * Convert an array of Doctor entities to ViewModels
     */
    toViewModelList(doctors: Doctor[]): DoctorViewModel[] {
        return doctors.map(doctor => this.toViewModel(doctor));
    }
}
