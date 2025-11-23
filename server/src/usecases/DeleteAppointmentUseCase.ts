import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';
import { ITransactionManager } from '../domain/repositories/ITransactionManager';
import { AppointmentStatus } from '../domain/entities/Appointment';
import { db } from '../infrastructure/database/firestore';

export class DeleteAppointmentUseCase {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private transactionManager: ITransactionManager
    ) { }

    async execute(appointmentId: string, userId: string): Promise<void> {
        const appointmentRef = db.collection('appointments').doc(appointmentId);

        await this.transactionManager.runTransaction(async (transaction) => {
            const appointmentDoc = await transaction.get(appointmentRef);

            if (!appointmentDoc.exists) {
                throw new Error('Appointment not found');
            }

            const appointment = appointmentDoc.data();
            if (!appointment) {
                throw new Error('Invalid appointment data');
            }

            // Verify Ownership
            if (appointment.patientId !== userId) {
                throw new Error('Unauthorized to delete this appointment');
            }

            // Verify Status
            if (appointment.status !== AppointmentStatus.CANCELLED && appointment.status !== AppointmentStatus.COMPLETED) {
                throw new Error('Only cancelled or completed appointments can be deleted');
            }

            // Delete
            transaction.delete(appointmentRef);
        });
    }
}
