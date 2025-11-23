import { SimpleGrid, Button, Text } from '@mantine/core';
import type { TimeSlot } from '../types/entities/Schedule';

interface ScheduleGridProps {
    slots: TimeSlot[];
    selectedSlotId: string | null;
    onSelect: (slotId: string) => void;
}

export function ScheduleGrid({ slots, selectedSlotId, onSelect }: ScheduleGridProps) {
    if (slots.length === 0) {
        return <Text c="dimmed">Không có lịch khám cho ngày này.</Text>;
    }

    return (
        <SimpleGrid cols={4} spacing="sm">
            {slots.map((slot) => (
                <Button
                    key={slot.id}
                    variant={selectedSlotId === slot.id ? 'filled' : 'outline'}
                    color={slot.isBooked ? 'gray' : 'blue'}
                    disabled={slot.isBooked}
                    onClick={() => onSelect(slot.id)}
                >
                    {slot.time}
                </Button>
            ))}
        </SimpleGrid>
    );
}
