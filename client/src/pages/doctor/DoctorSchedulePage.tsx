import { Container, Title, Button, Group, LoadingOverlay, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import { WeekCalendar } from '../../components/doctor/WeekCalendar';
import { TimeSlotPicker } from '../../components/doctor/TimeSlotPicker';
import { useDoctorSchedule } from '../../hooks/useDoctorSchedule';

export default function DoctorSchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { schedule, loading, fetchSchedule, saveSchedule } = useDoctorSchedule();

    // Local state for slots to allow editing before saving
    const [currentSlots, setCurrentSlots] = useState<any[]>([]);

    useEffect(() => {
        fetchSchedule(selectedDate);
    }, [selectedDate, fetchSchedule]);

    useEffect(() => {
        if (schedule) {
            setCurrentSlots(schedule.slots);
        } else {
            setCurrentSlots([]);
        }
    }, [schedule]);

    const handleSave = () => {
        saveSchedule(selectedDate, currentSlots);
    };

    const isPastDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(selectedDate);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    return (
        <Container size="xl">
            <Title order={2} mb="lg">Lịch làm việc</Title>

            <Box pos="relative">
                <LoadingOverlay visible={loading} />

                <WeekCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                <TimeSlotPicker
                    slots={currentSlots}
                    onChange={setCurrentSlots}
                />

                <Group justify="flex-end" mt="xl">
                    <Button
                        onClick={handleSave}
                        size="md"
                        disabled={isPastDate()}
                        title={isPastDate() ? "Không thể lưu lịch cho ngày trong quá khứ" : ""}
                    >
                        Lưu lịch làm việc
                    </Button>
                </Group>
            </Box>
        </Container>
    );
}
