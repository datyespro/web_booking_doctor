export interface TimeSlot {
    id: string; // e.g., "08:00"
    time: string; // Display text: "08:00 - 08:30"
    isBooked: boolean;
}

export interface DailySchedule {
    date: string; // YYYY-MM-DD
    doctorId: string;
    slots: TimeSlot[];
}
