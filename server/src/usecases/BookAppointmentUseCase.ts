console.log('Loading BookAppointmentUseCase...');
import { Appointment, AppointmentStatus } from '../domain/entities/Appointment';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';
import { ITransactionManager } from '../domain/repositories/ITransactionManager';
import { db } from '../infrastructure/database/firestore'; // Still needed for refs, but transaction logic moves

interface BookAppointmentRequest {
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    date: string;
    timeSlotId: string;
    timeText: string;
    // New fields
    patientPhone: string;
    patientGender: string;
    patientDob: string;
    patientAddress: string;
    reason: string;
}

export class BookAppointmentUseCase {
    constructor(
        private doctorRepository: IDoctorRepository,
        private appointmentRepository: IAppointmentRepository,
        private transactionManager: ITransactionManager
    ) { }

    async execute(request: BookAppointmentRequest): Promise<Appointment> {
        const { patientId, doctorId, date, timeSlotId } = request;

        // We still need to use transaction for atomicity
        // This is a special case where we need direct DB access for transaction
        const scheduleRef = db.collection('doctors').doc(doctorId).collection('schedules').doc(date);
        const appointmentRef = db.collection('appointments').doc(); // Auto-gen ID

        return await this.transactionManager.runTransaction(async (transaction) => {
            // 1. Read Schedule
            const scheduleDoc = await transaction.get(scheduleRef);

            if (!scheduleDoc.exists) {
                throw new Error('Doctor does not have a schedule for this date');
            }

            const scheduleData = scheduleDoc.data();
            if (!scheduleData) {
                throw new Error('Schedule data is invalid');
            }

            const slotIndex = scheduleData.slots.findIndex((s: any) => s.id === timeSlotId);

            if (slotIndex === -1) {
                throw new Error('Time slot not found');
            }

            if (scheduleData.slots[slotIndex].isBooked) {
                throw new Error('Time slot is already booked');
            }

            // 2. Create Appointment
            const newAppointment: Appointment = {
                id: appointmentRef.id,
                patientId,
                patientName: request.patientName,
                doctorId,
                doctorName: request.doctorName,
                specialtyName: request.specialtyName,
                date,
                timeSlotId,
                timeText: request.timeText,

                // New fields
                patientPhone: request.patientPhone,
                patientGender: request.patientGender,
                patientDob: request.patientDob,
                patientAddress: request.patientAddress,
                reason: request.reason,

                status: AppointmentStatus.PENDING,
                createdAt: new Date()
            };

            // 3. Update Schedule (Optimistic locking via Transaction)
            const newSlots = [...scheduleData.slots];
            newSlots[slotIndex].isBooked = true;
            newSlots[slotIndex].appointmentId = newAppointment.id;

            transaction.update(scheduleRef, { slots: newSlots });
            transaction.set(appointmentRef, newAppointment);

            return newAppointment;
        });
    }
}

