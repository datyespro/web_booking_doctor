import { db } from './infrastructure/database/firestore';
import { BookAppointmentUseCase } from './usecases/BookAppointmentUseCase';
import { DailySchedule } from './domain/entities/Schedule';
import { FirestoreAppointmentRepository } from './infrastructure/database/FirestoreAppointmentRepository';
import { FirestoreDoctorRepository } from './infrastructure/database/FirestoreDoctorRepository';

async function main() {
    console.log('--- STARTING BOOKING TEST ---');

    const doctorId = 'doctor-test-1';
    const date = '2025-11-20';
    const timeSlotId = '09:00';

    // 1. Setup Dummy Data
    console.log('1. Setting up dummy schedule...');
    const scheduleRef = db.collection('doctors').doc(doctorId).collection('schedules').doc(date);

    const dummySchedule: DailySchedule = {
        date,
        doctorId,
        slots: [
            { id: '08:00', time: '08:00 - 08:30', isBooked: false },
            { id: '09:00', time: '09:00 - 09:30', isBooked: false },
            { id: '10:00', time: '10:00 - 10:30', isBooked: false }
        ]
    };

    await scheduleRef.set(dummySchedule);
    console.log('   Schedule created.');

    // 2. Test Successful Booking
    console.log('\n2. Testing Successful Booking...');
    // Initialize repositories
    const doctorRepo = new FirestoreDoctorRepository();
    const appointmentRepo = new FirestoreAppointmentRepository();
    const useCase = new BookAppointmentUseCase(doctorRepo, appointmentRepo);

    try {
        const appointment = await useCase.execute({
            patientId: 'patient-123',
            patientName: 'Nguyen Van A',
            doctorId,
            doctorName: 'Dr. Strange',
            specialtyName: 'Neurology',
            date,
            timeSlotId,
            timeText: '09:00 - 09:30',
            // New Fields
            patientPhone: '0901234567',
            patientGender: 'male',
            patientDob: '1990-01-01',
            patientAddress: '123 Test St',
            reason: 'Test reason'
        });
        console.log('   ✅ Booking Success! Appointment ID:', appointment.id);

        if (appointment.patientPhone === '0901234567' && appointment.reason === 'Test reason') {
            console.log('   ✅ New fields verified correctly.');
        } else {
            console.log('   ❌ New fields mismatch!');
        }

    } catch (error) {
        console.error('   ❌ Booking Failed:', error);
    }

    // 3. Test Double Booking (Race Condition Simulation)
    console.log('\n3. Testing Double Booking (Should Fail)...');
    try {
        await useCase.execute({
            patientId: 'patient-456',
            patientName: 'Tran Van B',
            doctorId,
            doctorName: 'Dr. Strange',
            specialtyName: 'Neurology',
            date,
            timeSlotId,
            timeText: '09:00 - 09:30',
            // New Fields
            patientPhone: '0908888888',
            patientGender: 'female',
            patientDob: '1995-05-05',
            patientAddress: '456 Another St',
            reason: 'Should fail'
        });
        console.log('   ❌ Error: Double booking allowed!');
    } catch (error: any) {
        console.log('   ✅ Expected Error:', error.message);
    }

    console.log('\n--- TEST COMPLETED ---');
    process.exit(0);
}

main().catch(console.error);
