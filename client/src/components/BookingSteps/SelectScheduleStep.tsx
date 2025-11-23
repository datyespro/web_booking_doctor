import { useEffect, useState } from 'react';
import { Text, Title, Paper, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { ScheduleGrid } from '../ScheduleGrid';
import { useSchedule } from '../../hooks/useSchedule';
import { useBookingContext } from '../../contexts/BookingContext';

export function SelectScheduleStep() {
    const { bookingData, setBookingData, nextStep } = useBookingContext();
    const { doctor, date, slot } = bookingData;

    // Local state for date to handle the DatePickerInput
    const [selectedDate, setSelectedDate] = useState<Date | null>(date || new Date());

    const dateString = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
    const { slots, loading: scheduleLoading } = useSchedule(doctor?.id, dateString);

    // Update context when date changes
    useEffect(() => {
        if (selectedDate) {
            setBookingData({ date: selectedDate, slot: null }); // Reset slot when date changes
        }
    }, [selectedDate]);

    const handleSlotSelect = (slotId: string) => {
        const selectedSlot = slots.find(s => s.id === slotId);
        if (selectedSlot) {
            setBookingData({ slot: selectedSlot });
        }
    };

    const handleNext = () => {
        if (selectedDate && bookingData.slot) {
            nextStep();
        }
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={4} mb="md">1. Chọn lịch khám</Title>

            <DatePickerInput
                label="Ngày khám"
                placeholder="Chọn ngày"
                value={selectedDate}
                onChange={(value) => setSelectedDate(value as any)}
                minDate={new Date()}
                mb="md"
            />

            <Text fw={500} mb="xs">Giờ khám:</Text>
            {scheduleLoading ? (
                <Text>Đang tải lịch...</Text>
            ) : (
                <ScheduleGrid
                    slots={slots}
                    selectedSlotId={slot?.id || null}
                    onSelect={handleSlotSelect}
                />
            )}

            <Button
                fullWidth
                mt="xl"
                size="md"
                disabled={!bookingData.slot}
                onClick={handleNext}
            >
                Tiếp tục
            </Button>
        </Paper>
    );
}
