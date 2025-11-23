import { useState, useEffect, useCallback } from 'react';
import { doctorRepository } from '../api/repositories/DoctorRepository';
import type { Doctor } from '../types/entities/Doctor';
import type { SearchDoctorFilters } from '../types/SearchFilters';

export function useSearchDoctors(initialFilters: SearchDoctorFilters = {}) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<SearchDoctorFilters>(initialFilters);

    const search = useCallback(async (searchFilters: SearchDoctorFilters) => {
        try {
            setLoading(true);
            setError(null);
            const data = await doctorRepository.search(searchFilters);
            setDoctors(data);
        } catch (err) {
            console.error('Failed to search doctors:', err);
            setError('Không thể tìm kiếm bác sĩ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        search(filters);
    }, [filters, search]);

    const updateFilters = (newFilters: Partial<SearchDoctorFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({});
    };

    return {
        doctors,
        loading,
        error,
        filters,
        updateFilters,
        resetFilters,
        search
    };
}
