import { DailySchedule, TimeSlot } from '../../domain/entities/Schedule';
import { ScheduleViewModel, TimeSlotViewModel } from '../viewmodels/ScheduleViewModel';

/**
 * Presenter for converting Schedule entities to ViewModels
 * Separates domain entities from UI representation
 */
export class SchedulePresenter {
    /**
     * Convert TimeSlot entity to ViewModel
     */
    toTimeSlotViewModel(slot: TimeSlot): TimeSlotViewModel {
        return {
            id: slot.id,
            time: slot.time,
            isBooked: slot.isBooked,
            isAvailable: slot.isAvailable(),
            isMorning: slot.isMorning(),
            isAfternoon: slot.isAfternoon(),
            isEvening: slot.isEvening()
        };
    }

    /**
     * Convert DailySchedule entity to ViewModel
     */
    toViewModel(schedule: DailySchedule): ScheduleViewModel {
        return {
            date: schedule.date,
            doctorId: schedule.doctorId,
            slots: schedule.slots.map(slot => this.toTimeSlotViewModel(slot)),

            // Formatted values using entity business logic
            formattedDate: schedule.getFormattedDate(),
            availableCount: schedule.getAvailableCount(),
            hasAvailability: schedule.hasAvailability(),

            // Time period slots
            morningSlots: schedule.getMorningSlots().map(slot => this.toTimeSlotViewModel(slot)),
            afternoonSlots: schedule.getAfternoonSlots().map(slot => this.toTimeSlotViewModel(slot)),
            eveningSlots: schedule.getEveningSlots().map(slot => this.toTimeSlotViewModel(slot)),

            // Date flags
            isToday: schedule.isToday(),
            isPast: schedule.isPast()
        };
    }
}
