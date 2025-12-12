import { Paper, Stack, Title, Select, NumberInput, Button, Group } from '@mantine/core';
import { SearchFilters } from '../domain/repositories/IDoctorRepository';

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (filters: Partial<SearchFilters>) => void;
    onReset: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={4} mb="md">Bộ lọc</Title>

            <Stack gap="md">
                <Select
                    label="Chuyên khoa"
                    placeholder="Chọn chuyên khoa"
                    value={filters.specialty || null}
                    onChange={(value) => onFilterChange({ specialty: value || undefined })}
                    data={[
                        { value: 'Cơ xương khớp', label: 'Cơ xương khớp' },
                        { value: 'Thần kinh', label: 'Thần kinh' },
                        { value: 'Tiêu hóa', label: 'Tiêu hóa' },
                        { value: 'Tim mạch', label: 'Tim mạch' },
                        { value: 'Da liễu', label: 'Da liễu' },
                        { value: 'Tai Mũi Họng', label: 'Tai Mũi Họng' },
                        { value: 'Răng Hàm Mặt', label: 'Răng Hàm Mặt' },
                        { value: 'Sản Phụ Khoa', label: 'Sản Phụ Khoa' },
                        { value: 'Mắt', label: 'Mắt' },
                        { value: 'Nội Khoa', label: 'Nội Khoa' },
                        { value: 'Nhi Khoa', label: 'Nhi Khoa' },
                        { value: 'Y học Cổ truyền', label: 'Y học Cổ truyền' },
                    ]}
                    clearable
                    searchable
                />

                <Select
                    label="Địa điểm"
                    placeholder="Chọn địa điểm"
                    value={filters.location || null}
                    onChange={(value) => onFilterChange({ location: value || undefined })}
                    data={[
                        { value: 'Hà Nội', label: 'Hà Nội' },
                        { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                        { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                        { value: 'Cần Thơ', label: 'Cần Thơ' },
                        { value: 'Huế', label: 'Huế' },
                        { value: 'Hải Phòng', label: 'Hải Phòng' },
                    ]}
                    clearable
                    searchable
                />

                <Title order={6} mt="md">Khoảng giá</Title>

                <NumberInput
                    label="Giá tối thiểu"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(value) => onFilterChange({ minPrice: value as number })}
                    min={0}
                    step={50000}
                    suffix=" VNĐ"
                />

                <NumberInput
                    label="Giá tối đa"
                    placeholder="Không giới hạn"
                    value={filters.maxPrice}
                    onChange={(value) => onFilterChange({ maxPrice: value as number })}
                    min={0}
                    step={50000}
                    suffix=" VNĐ"
                />

                <Group mt="md">
                    <Button variant="outline" onClick={onReset} fullWidth>
                        Xóa bộ lọc
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}
