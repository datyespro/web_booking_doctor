import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { db } from './firestore';

export class FirestoreAppointmentRepository implements IAppointmentRepository {
    private collection = db.collection('appointments');

    async create(appointment: Appointment): Promise<void> {
        await this.collection.doc(appointment.id).set(appointment);
    }

    async findByUser(userId: string): Promise<Appointment[]> {
        const snapshot = await this.collection.where('patientId', '==', userId).get();
        const appointments = snapshot.docs.map(doc => doc.data() as Appointment);

        // Check if each appointment has been reviewed
        const appointmentsWithReviewStatus = await Promise.all(
            appointments.map(async (apt) => {
                const reviewSnapshot = await db.collection('reviews')
                    .where('appointmentId', '==', apt.id)
                    .limit(1)
                    .get();

                return {
                    ...apt,
                    hasReviewed: !reviewSnapshot.empty
                };
            })
        );

        return appointmentsWithReviewStatus;
    }

    async findByDoctorId(doctorId: string): Promise<Appointment[]> {
        const snapshot = await this.collection.where('doctorId', '==', doctorId).get();
        return snapshot.docs.map(doc => doc.data() as Appointment);
    }

    async findByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]> {
        const snapshot = await this.collection
            .where('doctorId', '==', doctorId)
            .where('date', '==', date)
            .get();
        return snapshot.docs.map(doc => doc.data() as Appointment);
    }

    async findById(id: string): Promise<Appointment | null> {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return null;
        return doc.data() as Appointment;
    }

    async update(appointment: Appointment): Promise<void> {
        await this.collection.doc(appointment.id).set(appointment, { merge: true });
    }

    async delete(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }
}
