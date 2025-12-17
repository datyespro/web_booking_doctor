/**
 * View Model for TimeSlot
 * UI-friendly data structure optimized for rendering
 */
export interface TimeSlotViewModel {
    id: string;
    time: string;
    isBooked: boolean;

    // Computed flags
    isAvailable: boolean;
    isMorning: boolean;
    isAfternoon: boolean;
    isEvening: boolean;
}

/**
 * View Model for DailySchedule
 * UI-friendly data structure optimized for rendering
 */
export interface ScheduleViewModel {
    date: string;
    doctorId: string;
    slots: TimeSlotViewModel[];

    // Formatted display values
    formattedDate: string;           // "Thứ Hai, 16 tháng 12, 2025"
    availableCount: number;
    hasAvailability: boolean;

    // Grouped slots for UI sections
    morningSlots: TimeSlotViewModel[];
    afternoonSlots: TimeSlotViewModel[];
    eveningSlots: TimeSlotViewModel[];

    // Date flags
    isToday: boolean;
    isPast: boolean;
}
