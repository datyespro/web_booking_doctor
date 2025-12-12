console.log('Loading CancelAppointmentUseCase...');
import { AppointmentStatus } from '../domain/entities/Appointment';
import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { ITransactionManager } from '../domain/repositories/ITransactionManager';
import { db } from '../infrastructure/database/firestore';

export class CancelAppointmentUseCase {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private doctorRepository: IDoctorRepository,
        private transactionManager: ITransactionManager
    ) { }

    async execute(appointmentId: string, userId: string): Promise<void> {
        console.log('CancelAppointmentUseCase.execute called', appointmentId, userId);
        const appointmentRef = db.collection('appointments').doc(appointmentId);

        await this.transactionManager.runTransaction(async (transaction) => {
            console.log('Transaction started');
            // 1. Get Appointment
            const appointmentDoc = await transaction.get(appointmentRef);
            if (!appointmentDoc.exists) {
                throw new Error('Appointment not found');
            }

            const appointment = appointmentDoc.data();
            if (!appointment) {
                throw new Error('Invalid appointment data');
            }
            console.log('Appointment found', appointment);

            // 2. Verify Ownership
            if (appointment.patientId !== userId) {
                throw new Error('Unauthorized to cancel this appointment');
            }

            // Validate required fields
            if (!appointment.doctorId || !appointment.date || !appointment.timeSlotId) {
                throw new Error(`Invalid appointment data: missing doctorId, date, or timeSlotId. ID: ${appointmentId}`);
            }

            // 3. Verify Status
            if (appointment.status === AppointmentStatus.CANCELLED) {
                throw new Error('Appointment is already cancelled');
            }
            if (appointment.status === AppointmentStatus.COMPLETED) {
                throw new Error('Cannot cancel completed appointment');
            }
            if (appointment.status === AppointmentStatus.CONFIRMED) {
                throw new Error('Không thể hủy lịch hẹn đã được bác sĩ xác nhận. Vui lòng liên hệ trực tiếp với phòng khám.');
            }

            // 4. Get Schedule (READ before WRITE)
            const scheduleRef = db.collection('doctors').doc(appointment.doctorId)
                .collection('schedules').doc(appointment.date);
            const scheduleDoc = await transaction.get(scheduleRef);

            // 5. Update Appointment Status (WRITE)
            transaction.update(appointmentRef, { status: AppointmentStatus.CANCELLED });
            console.log('Appointment status updated');

            // 6. Free up Doctor's Schedule Slot (WRITE)
            if (scheduleDoc.exists) {
                const scheduleData = scheduleDoc.data();
                if (scheduleData && Array.isArray(scheduleData.slots)) {
                    const newSlots = scheduleData.slots.map((slot: any) => {
                        if (slot.id === appointment.timeSlotId) {
                            return { ...slot, isBooked: false, appointmentId: null };
                        }
                        return slot;
                    });
                    transaction.update(scheduleRef, { slots: newSlots });
                    console.log('Schedule updated');
                } else {
                    console.warn(`Schedule found but slots are missing or invalid for doctor ${appointment.doctorId} on ${appointment.date}`);
                }
            } else {
                console.warn(`Schedule not found for doctor ${appointment.doctorId} on ${appointment.date}`);
            }
        });
        console.log('Transaction committed');
    }
}
