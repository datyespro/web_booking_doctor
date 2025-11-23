import { useState, useEffect, useCallback } from 'react';
import { DoctorViewModel } from '../viewmodels/DoctorViewModel';
import { SearchFilters } from '../../domain/repositories/IDoctorRepository';
import { useSearchDoctors } from './useSearchDoctors';

/**
 * Hook for SearchResultsPage
 * Manages search filters state and triggers search
 */
export function useSearchDoctorsPage() {
    const [filters, setFilters] = useState<SearchFilters>({});
    const { doctors, loading, error, search } = useSearchDoctors();

    // Trigger search when filters change
    useEffect(() => {
        search(filters);
    }, [filters, search]);

    const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    return {
        doctors,
        loading,
        error,
        filters,
        updateFilters,
        resetFilters
    };
}
