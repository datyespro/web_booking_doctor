import { db } from './infrastructure/database/firestore';
import { BookAppointmentUseCase } from './usecases/BookAppointmentUseCase';
import { CancelAppointmentUseCase } from './usecases/CancelAppointmentUseCase';
import { DailySchedule } from './domain/entities/Schedule';
import { FirestoreAppointmentRepository } from './infrastructure/database/FirestoreAppointmentRepository';
import { FirestoreDoctorRepository } from './infrastructure/database/FirestoreDoctorRepository';
import { AppointmentStatus } from './domain/entities/Appointment';
import { FirestoreTransactionManager } from './infrastructure/database/FirestoreTransactionManager';

async function main() {
    console.log('--- STARTING CANCELLATION TEST ---');

    const doctorId = 'doctor-cancel-test';
    const date = '2025-12-01';
    const timeSlotId = '10:00';
    const patientId = 'patient-cancel-test';

    // Repositories
    const doctorRepo = new FirestoreDoctorRepository();
    const appointmentRepo = new FirestoreAppointmentRepository();
    const transactionManager = new FirestoreTransactionManager();
    const bookUseCase = new BookAppointmentUseCase(doctorRepo, appointmentRepo, transactionManager);
    const cancelUseCase = new CancelAppointmentUseCase(appointmentRepo, doctorRepo, transactionManager);

    // 1. Setup Dummy Data
    console.log('1. Setting up dummy schedule...');
    const scheduleRef = db.collection('doctors').doc(doctorId).collection('schedules').doc(date);

    const dummySchedule: DailySchedule = {
        date,
        doctorId,
        slots: [
            { id: '10:00', time: '10:00 - 10:30', isBooked: false }
        ]
    };

    await scheduleRef.set(dummySchedule);
    console.log('   Schedule created.');

    // 2. Book Appointment
    console.log('\n2. Booking Appointment...');
    let appointmentId = '';
    try {
        console.log('   Calling bookUseCase.execute...');
        const appointment = await bookUseCase.execute({
            patientId,
            patientName: 'Cancel Test User',
            doctorId,
            doctorName: 'Dr. Cancel',
            specialtyName: 'Test',
            date,
            timeSlotId,
            timeText: '10:00 - 10:30',
            patientPhone: '123',
            patientGender: 'male',
            patientDob: '1990-01-01',
            patientAddress: 'Test',
            reason: 'To be cancelled'
        });
        appointmentId = appointment.id;
        console.log('   ✅ Booking Success! Appointment ID:', appointmentId);
    } catch (error: any) {
        console.error('   ❌ Booking Failed:', error);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }

    // 3. Verify Slot is Booked
    console.log('\n3. Verifying Slot is Booked...');
    let scheduleDoc = (await scheduleRef.get()).data() as DailySchedule;
    let slot = scheduleDoc.slots.find(s => s.id === timeSlotId);
    if (slot?.isBooked) {
        console.log('   ✅ Slot is booked.');
    } else {
        console.error('   ❌ Slot is NOT booked!');
        process.exit(1);
    }

    // 4. Cancel Appointment
    console.log('\n4. Cancelling Appointment...');
    try {
        await cancelUseCase.execute(appointmentId, patientId);
        console.log('   ✅ Cancellation executed.');
    } catch (error) {
        console.error('   ❌ Cancellation Failed:', error);
        process.exit(1);
    }

    // 5. Verify Appointment Status
    console.log('\n5. Verifying Appointment Status...');
    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    const appointmentData = appointmentDoc.data();
    if (appointmentData?.status === AppointmentStatus.CANCELLED) {
        console.log('   ✅ Appointment status is CANCELLED.');
    } else {
        console.error('   ❌ Appointment status is NOT CANCELLED:', appointmentData?.status);
    }

    // 6. Verify Slot is Freed
    console.log('\n6. Verifying Slot is Freed...');
    scheduleDoc = (await scheduleRef.get()).data() as DailySchedule;
    slot = scheduleDoc.slots.find(s => s.id === timeSlotId);
    if (!slot?.isBooked) {
        console.log('   ✅ Slot is freed (isBooked = false).');
    } else {
        console.error('   ❌ Slot is STILL booked!');
    }

    console.log('\n--- TEST COMPLETED ---');
    process.exit(0);
}

main().catch(console.error);
