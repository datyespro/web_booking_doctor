import { BookAppointmentUseCase } from './usecases/BookAppointmentUseCase';
import { FirestoreAppointmentRepository } from './infrastructure/database/FirestoreAppointmentRepository';
import { FirestoreDoctorRepository } from './infrastructure/database/FirestoreDoctorRepository';

console.log('Imports successful');

try {
    const appointmentRepo = new FirestoreAppointmentRepository();
    const doctorRepo = new FirestoreDoctorRepository();
    const useCase = new BookAppointmentUseCase(doctorRepo, appointmentRepo);
    console.log('UseCase instantiated successfully');
} catch (error) {
    console.error('Error:', error);
}
