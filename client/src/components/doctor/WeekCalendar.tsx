import { Group, ActionIcon, Text, Paper } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

interface WeekCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateChange }: WeekCalendarProps) {
    const startOfWeek = dayjs(selectedDate).startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

    const handlePrevWeek = () => onDateChange(dayjs(selectedDate).subtract(1, 'week').toDate());
    const handleNextWeek = () => onDateChange(dayjs(selectedDate).add(1, 'week').toDate());

    return (
        <Paper p="md" withBorder mb="md">
            <Group justify="space-between" mb="md">
                <ActionIcon variant="subtle" onClick={handlePrevWeek}>
                    <IconChevronLeft size={20} />
                </ActionIcon>
                <Text fw={700} size="lg">
                    Tháng {dayjs(selectedDate).format('MM/YYYY')}
                </Text>
                <ActionIcon variant="subtle" onClick={handleNextWeek}>
                    <IconChevronRight size={20} />
                </ActionIcon>
            </Group>

            <Group grow>
                {days.map((day) => {
                    const isSelected = day.isSame(selectedDate, 'day');
                    const isToday = day.isSame(dayjs(), 'day');

                    return (
                        <Paper
                            key={day.toString()}
                            p="xs"
                            withBorder={isSelected}
                            bg={isSelected ? 'blue.0' : 'transparent'}
                            style={{
                                cursor: 'pointer',
                                borderColor: isSelected ? 'var(--mantine-color-blue-5)' : 'transparent',
                                textAlign: 'center'
                            }}
                            onClick={() => onDateChange(day.toDate())}
                        >
                            <Text size="xs" c="dimmed" tt="uppercase">
                                {day.locale('vi').format('ddd')}
                            </Text>
                            <Text fw={700} size="lg" c={isToday ? 'blue' : undefined}>
                                {day.format('DD')}
                            </Text>
                        </Paper>
                    );
                })}
            </Group>
        </Paper>
    );
}
