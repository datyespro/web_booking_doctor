import { SimpleGrid, Button, Text, Paper } from '@mantine/core';
import { TimeSlot } from '../../hooks/useDoctorSchedule';

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    onChange: (slots: TimeSlot[]) => void;
}

const DEFAULT_SLOTS = [
    { id: '1', time: '07:00 - 07:30', isBooked: false },
    { id: '2', time: '07:30 - 08:00', isBooked: false },
    { id: '3', time: '08:00 - 08:30', isBooked: false },
    { id: '4', time: '08:30 - 09:00', isBooked: false },
    { id: '5', time: '09:00 - 09:30', isBooked: false },
    { id: '6', time: '09:30 - 10:00', isBooked: false },
    { id: '7', time: '10:00 - 10:30', isBooked: false },
    { id: '8', time: '10:30 - 11:00', isBooked: false },
    { id: '9', time: '13:30 - 14:00', isBooked: false },
    { id: '10', time: '14:00 - 14:30', isBooked: false },
    { id: '11', time: '14:30 - 15:00', isBooked: false },
    { id: '12', time: '15:00 - 15:30', isBooked: false },
    { id: '13', time: '15:30 - 16:00', isBooked: false },
    { id: '14', time: '16:00 - 16:30', isBooked: false },
    { id: '15', time: '16:30 - 17:00', isBooked: false },
];

export function TimeSlotPicker({ slots, onChange }: TimeSlotPickerProps) {
    // Merge current slots with default slots to show selection state
    // If a slot exists in 'slots', it is selected.

    const toggleSlot = (defaultSlot: any) => {
        const exists = slots.find(s => s.time === defaultSlot.time);
        if (exists) {
            if (exists.isBooked) return; // Cannot unselect booked slots
            onChange(slots.filter(s => s.time !== defaultSlot.time));
        } else {
            onChange([...slots, { ...defaultSlot, isBooked: false }]);
        }
    };

    return (
        <Paper p="md" withBorder>
            <Text fw={700} mb="md">Chọn khung giờ làm việc</Text>
            <SimpleGrid cols={{ base: 2, sm: 4, md: 5 }}>
                {DEFAULT_SLOTS.map((slot) => {
                    const existing = slots.find(s => s.time === slot.time);
                    const isSelected = !!existing;
                    const isBooked = existing?.isBooked;

                    return (
                        <Button
                            key={slot.id}
                            variant={isSelected ? 'filled' : 'outline'}
                            color={isBooked ? 'red' : 'blue'}
                            onClick={() => toggleSlot(slot)}
                            disabled={isBooked}
                            size="xs"
                        >
                            {slot.time}
                        </Button>
                    );
                })}
            </SimpleGrid>
            <Text size="xs" c="dimmed" mt="sm">
                * Khung giờ màu đỏ là đã có người đặt, không thể bỏ chọn.
            </Text>
        </Paper>
    );
}
