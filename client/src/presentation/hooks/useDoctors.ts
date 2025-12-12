import { useState, useEffect } from 'react';
import { DoctorViewModel } from '../viewmodels/DoctorViewModel';
import { getAllDoctorsUseCase, doctorPresenter } from '../../infrastructure/container';

/**
 * Hook to fetch all doctors using Clean Architecture
 * Returns ViewModels ready for UI rendering
 */
export function useDoctors() {
    const [doctors, setDoctors] = useState<DoctorViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError(null);

                // Execute use case (contains business logic)
                const domainDoctors = await getAllDoctorsUseCase.execute();

                // Convert to ViewModels using presenter
                const viewModels = doctorPresenter.toViewModelList(domainDoctors);

                // Sort by rating (desc) then experience (desc), limit to 6 featured doctors
                const sortedDoctors = viewModels
                    .sort((a, b) => {
                        // First by rating (descending)
                        if (b.rating !== a.rating) {
                            return b.rating - a.rating;
                        }
                        // Then by experience (descending)
                        return b.experienceYears - a.experienceYears;
                    })
                    .slice(0, 6);

                setDoctors(sortedDoctors);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
                setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return { doctors, loading, error };
}
