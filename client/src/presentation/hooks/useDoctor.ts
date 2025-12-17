import { useState, useEffect } from 'react';
import { DoctorViewModel } from '../viewmodels/DoctorViewModel';
import { getDoctorByIdUseCase, doctorPresenter } from '../../infrastructure/container';

/**
 * Hook to fetch a single doctor by ID using Clean Architecture
 * Returns ViewModel ready for UI rendering
 */
export function useDoctor(doctorId: string | undefined) {
    const [doctor, setDoctor] = useState<DoctorViewModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        const fetchDoctor = async () => {
            try {
                setLoading(true);
                setError(null);

                // Execute use case
                const domainDoctor = await getDoctorByIdUseCase.execute(doctorId);

                // Convert to ViewModel
                const viewModel = doctorPresenter.toViewModel(domainDoctor);

                setDoctor(viewModel);
            } catch (err) {
                console.error('Failed to fetch doctor:', err);
                setError('Không thể tải thông tin bác sĩ.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    return { doctor, loading, error };
}
