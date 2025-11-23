import { Container, Grid, Title, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchDoctorsPage } from '../presentation/hooks/useSearchDoctorsPage';
import { FilterSidebar } from '../components/FilterSidebar';
import { DoctorGrid } from '../components/DoctorGrid';

export default function SearchResultsPage() {
    const { doctors, loading, filters, updateFilters, resetFilters } = useSearchDoctorsPage();

    return (
        <Container size="xl" py="xl">
            <Title order={2} mb="xl">Tìm kiếm bác sĩ</Title>

            <TextInput
                placeholder="Tìm theo tên bác sĩ, chuyên khoa..."
                leftSection={<IconSearch size={16} />}
                mb="xl"
                size="lg"
                onChange={(e) => updateFilters({ doctorName: e.target.value })}
                value={filters.doctorName || ''}
            />

            <Grid>
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={updateFilters}
                        onReset={resetFilters}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 9 }}>
                    <DoctorGrid doctors={doctors} loading={loading} />
                </Grid.Col>
            </Grid>
        </Container>
    );
}
