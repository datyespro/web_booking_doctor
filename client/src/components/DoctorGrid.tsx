import { SimpleGrid, Text, Loader, Center } from '@mantine/core';
import { DoctorCard } from './DoctorCard';
import { DoctorViewModel } from '../presentation/viewmodels/DoctorViewModel';

interface DoctorGridProps {
    doctors: DoctorViewModel[];
    loading: boolean;
}

export function DoctorGrid({ doctors, loading }: DoctorGridProps) {
    if (loading) {
        return (
            <Center h={300}>
                <Loader size="xl" />
            </Center>
        );
    }

    if (doctors.length === 0) {
        return (
            <Text ta="center" c="dimmed" size="lg" mt="xl">
                Không tìm thấy bác sĩ phù hợp. Vui lòng thử lại với bộ lọc khác.
            </Text>
        );
    }

    return (
        <>
            <Text mb="md" c="dimmed">
                Tìm thấy <strong>{doctors.length}</strong> bác sĩ
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </SimpleGrid>
        </>
    );
}
