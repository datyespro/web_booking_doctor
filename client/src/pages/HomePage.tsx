import { SimpleGrid, Container, Title, Text, Loader, Center, Box } from '@mantine/core';
import { useDoctors } from '../presentation/hooks/useDoctors';
import { DoctorCard } from '../components/DoctorCard';
import { HeroBanner } from '../components/HeroBanner';

export default function HomePage() {
    const { doctors, loading, error } = useDoctors();

    return (
        <Box>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Doctors List */}
            <Container size="lg" py="xl">
                <Title order={2} mb="xl" ta="center">Bác sĩ nổi bật</Title>

                {loading ? (
                    <Center h={300}>
                        <Loader size="xl" />
                    </Center>
                ) : error ? (
                    <Text c="red" ta="center">{error}</Text>
                ) : doctors.length === 0 ? (
                    <Text ta="center" c="dimmed">Chưa có bác sĩ nào trong hệ thống.</Text>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    );
}
