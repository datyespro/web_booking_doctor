import { useState, useCallback } from 'react';
import { DoctorViewModel } from '../viewmodels/DoctorViewModel';
import { SearchFilters } from '../../domain/repositories/IDoctorRepository';
import { searchDoctorsUseCase, doctorPresenter } from '../../infrastructure/container';

/**
 * Hook to search doctors with filters using Clean Architecture
 */
export function useSearchDoctors() {
    const [doctors, setDoctors] = useState<DoctorViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (filters: SearchFilters) => {
        try {
            setLoading(true);
            setError(null);

            // Execute use case (contains business logic for filtering & sorting)
            const domainDoctors = await searchDoctorsUseCase.execute(filters);

            // Convert to ViewModels using presenter
            const viewModels = doctorPresenter.toViewModelList(domainDoctors);

            setDoctors(viewModels);
        } catch (err) {
            console.error('Failed to search doctors:', err);
            setError('Không thể tìm kiếm bác sĩ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { doctors, loading, error, search };
}
