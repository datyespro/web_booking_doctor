import { db } from './infrastructure/database/firestore';
import { CancelAppointmentUseCase } from './usecases/CancelAppointmentUseCase';
import { FirestoreAppointmentRepository } from './infrastructure/database/FirestoreAppointmentRepository';
import { FirestoreDoctorRepository } from './infrastructure/database/FirestoreDoctorRepository';
import { AppointmentStatus } from './domain/entities/Appointment';

import { FirestoreTransactionManager } from './infrastructure/database/FirestoreTransactionManager';

async function main() {
    console.log('--- STARTING REPRODUCTION SCRIPT ---');

    const appointmentRepo = new FirestoreAppointmentRepository();
    const doctorRepo = new FirestoreDoctorRepository();
    const transactionManager = new FirestoreTransactionManager();
    const cancelUseCase = new CancelAppointmentUseCase(appointmentRepo, doctorRepo, transactionManager);

    // 1. Create a dummy appointment directly in Firestore
    const appointmentId = 'repro-test-appt';
    const patientId = 'repro-test-user';
    const doctorId = 'doctor-cancel-test';
    const date = '2025-12-01';

    console.log('1. Creating dummy appointment...');
    await db.collection('appointments').doc(appointmentId).set({
        id: appointmentId,
        patientId,
        doctorId,
        date,
        timeSlotId: '10:00',
        status: AppointmentStatus.PENDING,
        // Add other required fields to avoid validation errors if any (though Firestore is schemaless)
        patientName: 'Test',
        doctorName: 'Dr. Test',
        specialtyName: 'Test',
        timeText: '10:00',
        patientPhone: '123',
        patientGender: 'male',
        patientDob: '1990-01-01',
        patientAddress: 'Test',
        reason: 'Test',
        createdAt: new Date()
    });

    // 2. Create dummy schedule
    console.log('2. Creating dummy schedule...');
    await db.collection('doctors').doc(doctorId).collection('schedules').doc(date).set({
        date,
        doctorId,
        slots: [
            { id: '10:00', time: '10:00 - 10:30', isBooked: true, appointmentId: appointmentId }
        ]
    });

    // 3. Try to cancel
    console.log('3. Attempting to cancel...');
    try {
        await cancelUseCase.execute(appointmentId, patientId);
        console.log('✅ Cancellation successful');
    } catch (error: any) {
        console.error('❌ Cancellation failed:', error);
        if (error.stack) console.error(error.stack);
    }

    console.log('--- END REPRODUCTION SCRIPT ---');
    process.exit(0);
}

main().catch(console.error);
