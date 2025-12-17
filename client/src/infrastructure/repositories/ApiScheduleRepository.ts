import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';
import { DailySchedule, TimeSlot } from '../../domain/entities/Schedule';
import apiClient from '../http/httpClient';

/**
 * DTO from API response
 */
interface TimeSlotDTO {
    id: string;
    time: string;
    isBooked: boolean;
}

interface DailyScheduleDTO {
    date: string;
    doctorId: string;
    slots: TimeSlotDTO[];
}

/**
 * API implementation of IScheduleRepository
 * Converts between API DTOs and Domain Entities
 */
export class ApiScheduleRepository implements IScheduleRepository {
    async getSchedule(doctorId: string, date: string): Promise<DailySchedule | null> {
        try {
            const response = await apiClient.get<DailyScheduleDTO>(`/doctors/${doctorId}/schedule`, {
                params: { date }
            });

            if (!response.data || !response.data.slots) {
                return null;
            }

            return this.toDomain(response.data);
        } catch {
            return null;
        }
    }

    async saveSchedule(doctorId: string, date: string, slots: TimeSlot[]): Promise<void> {
        // Convert domain TimeSlot to DTO format
        const slotDTOs: TimeSlotDTO[] = slots.map(slot => ({
            id: slot.id,
            time: slot.time,
            isBooked: slot.isBooked
        }));

        await apiClient.post('/doctors/me/schedule', {
            date,
            slots: slotDTOs
        });
    }

    /**
     * Convert API DTO to Domain Entity
     */
    private toDomain(dto: DailyScheduleDTO): DailySchedule {
        const slots = dto.slots.map(slotDto =>
            new TimeSlot(slotDto.id, slotDto.time, slotDto.isBooked)
        );

        return new DailySchedule(dto.date, dto.doctorId, slots);
    }
}
