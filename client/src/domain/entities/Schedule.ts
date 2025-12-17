/**
 * Schedule Domain Entities
 * Contains business logic related to doctor schedules
 */

/**
 * TimeSlot entity representing a bookable time slot
 */
export class TimeSlot {
    constructor(
        public readonly id: string, // e.g., "08:00"
        public readonly time: string, // Display text: "08:00 - 08:30"
        public readonly isBooked: boolean
    ) { }

    /**
     * Check if slot is available for booking
     */
    isAvailable(): boolean {
        return !this.isBooked;
    }

    /**
     * Get hour from slot id (e.g., "08:00" -> 8)
     */
    getHour(): number {
        const [hours] = this.id.split(':');
        return parseInt(hours, 10);
    }

    /**
     * Check if slot is in morning (before 12:00)
     */
    isMorning(): boolean {
        return this.getHour() < 12;
    }

    /**
     * Check if slot is in afternoon (12:00 - 17:00)
     */
    isAfternoon(): boolean {
        const hour = this.getHour();
        return hour >= 12 && hour < 17;
    }

    /**
     * Check if slot is in evening (after 17:00)
     */
    isEvening(): boolean {
        return this.getHour() >= 17;
    }
}

/**
 * DailySchedule entity representing a doctor's schedule for a specific day
 */
export class DailySchedule {
    constructor(
        public readonly date: string, // YYYY-MM-DD
        public readonly doctorId: string,
        public readonly slots: TimeSlot[]
    ) { }

    /**
     * Get all available slots
     */
    getAvailableSlots(): TimeSlot[] {
        return this.slots.filter(slot => slot.isAvailable());
    }

    /**
     * Get all booked slots
     */
    getBookedSlots(): TimeSlot[] {
        return this.slots.filter(slot => slot.isBooked);
    }

    /**
     * Check if there's any availability
     */
    hasAvailability(): boolean {
        return this.getAvailableSlots().length > 0;
    }

    /**
     * Get available slots count
     */
    getAvailableCount(): number {
        return this.getAvailableSlots().length;
    }

    /**
     * Get morning slots
     */
    getMorningSlots(): TimeSlot[] {
        return this.slots.filter(slot => slot.isMorning());
    }

    /**
     * Get afternoon slots
     */
    getAfternoonSlots(): TimeSlot[] {
        return this.slots.filter(slot => slot.isAfternoon());
    }

    /**
     * Get evening slots
     */
    getEveningSlots(): TimeSlot[] {
        return this.slots.filter(slot => slot.isEvening());
    }

    /**
     * Check if schedule is for today
     */
    isToday(): boolean {
        const scheduleDate = new Date(this.date);
        const today = new Date();
        return scheduleDate.toDateString() === today.toDateString();
    }

    /**
     * Check if schedule is in the past
     */
    isPast(): boolean {
        const scheduleDate = new Date(this.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return scheduleDate < today;
    }

    /**
     * Get formatted date for display
     */
    getFormattedDate(): string {
        const date = new Date(this.date);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
