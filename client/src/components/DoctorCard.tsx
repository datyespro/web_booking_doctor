import { Card, Text, Badge, Group, Stack, Avatar, Button } from '@mantine/core';
import { IconMapPin, IconClock, IconStar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { DoctorViewModel } from '../presentation/viewmodels/DoctorViewModel';

interface DoctorCardProps {
    doctor: DoctorViewModel;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
    // Build availability text from flags
    const availabilityText = [
        doctor.worksInMorning && 'Sáng',
        doctor.worksInAfternoon && 'Chiều',
        doctor.worksInEvening && 'Tối'
    ].filter(Boolean).join(', ') || 'Chưa cập nhật';

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
            <Card.Section withBorder inheritPadding py="xs">
                <Group>
                    <Avatar src={doctor.avatarUrl} size="lg" radius="md" />
                    <Stack gap="0" style={{ flex: 1 }}>
                        <Text fw={600} size="lg">{doctor.name}</Text>
                        <Text size="sm" c="dimmed">{doctor.specialty}</Text>
                    </Stack>
                </Group>
            </Card.Section>

            <Stack mt="md" gap="xs">
                {/* Rating Badge */}
                {doctor.isHighlyRated && (
                    <Badge color="yellow" variant="light" leftSection={<IconStar size={14} />}>
                        Bác sĩ nổi bật
                    </Badge>
                )}

                {/* Experience Level */}
                <Group gap="xs">
                    <Text size="sm" fw={500}>{doctor.experienceLevel}</Text>
                    {doctor.experienceYears > 0 && (
                        <Text size="sm" c="dimmed">({doctor.experienceYears} năm)</Text>
                    )}
                </Group>

                {/* Rating Display */}
                <Text size="sm" c="blue">
                    {doctor.displayRating}
                </Text>

                {/* Location */}
                {doctor.location && (
                    <Group gap="xs">
                        <IconMapPin size={16} />
                        <Text size="sm">{doctor.location}</Text>
                    </Group>
                )}

                {/* Working Hours */}
                <Group gap="xs">
                    <IconClock size={16} />
                    <Text size="sm">{availabilityText}</Text>
                </Group>

                {/* Price */}
                <Text size="lg" fw={700} c="green" mt="xs">
                    {doctor.formattedPrice}
                </Text>

                {/* Bio excerpt */}
                {doctor.bio && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                        {doctor.bio}
                    </Text>
                )}
            </Stack>

            {/* Actions */}
            <Button
                component={Link}
                to={`/doctors/${doctor.id}`}
                fullWidth
                mt="auto"
                radius="md"
                variant="light"
            >
                Xem hồ sơ & Đặt lịch
            </Button>
        </Card>
    );
}
