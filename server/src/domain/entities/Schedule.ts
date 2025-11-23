export interface TimeSlot {
    id: string; // e.g., "08:00", "09:30"
    time: string; // Display text: "08:00 - 08:30"
    isBooked: boolean;
    appointmentId?: string; // Link to the appointment if booked
}

export interface DailySchedule {
    date: string; // YYYY-MM-DD
    doctorId: string;
    slots: TimeSlot[];
}
