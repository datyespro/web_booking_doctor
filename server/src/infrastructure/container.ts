/**
 * Dependency Injection Container
 * This file wires up all dependencies following Clean Architecture principles
 */

import { FirestoreDoctorRepository } from './database/FirestoreDoctorRepository';
import { FirestoreAppointmentRepository } from './database/FirestoreAppointmentRepository';
import { FirestoreReviewRepository } from './database/FirestoreReviewRepository';
import { FirestoreTransactionManager } from './database/FirestoreTransactionManager';

// Use Cases
import { GetAllDoctorsUseCase } from '../usecases/GetAllDoctorsUseCase';
import { GetDoctorByIdUseCase } from '../usecases/GetDoctorByIdUseCase';
import { GetDoctorScheduleUseCase } from '../usecases/GetDoctorScheduleUseCase';
import { SearchDoctorsUseCase } from '../usecases/SearchDoctorsUseCase';
import { BookAppointmentUseCase } from '../usecases/BookAppointmentUseCase';
import { GetMyAppointmentsUseCase } from '../usecases/GetMyAppointmentsUseCase';
import { CreateReviewUseCase } from '../usecases/CreateReviewUseCase';
import { GetDoctorReviewsUseCase } from '../usecases/GetDoctorReviewsUseCase';

import { CancelAppointmentUseCase } from '../usecases/CancelAppointmentUseCase';
import { DeleteAppointmentUseCase } from '../usecases/DeleteAppointmentUseCase';

// Controllers
import { DoctorController } from '../interfaces/controllers/DoctorController';
import { AppointmentController } from '../interfaces/controllers/AppointmentController';
import { DeleteAppointmentController } from './web/controllers/DeleteAppointmentController';

// ============= Repositories =============
export const doctorRepository = new FirestoreDoctorRepository();
export const appointmentRepository = new FirestoreAppointmentRepository();
export const reviewRepository = new FirestoreReviewRepository();
export const transactionManager = new FirestoreTransactionManager();

// ============= Use Cases =============
export const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository);
export const getDoctorByIdUseCase = new GetDoctorByIdUseCase(doctorRepository);
export const getDoctorScheduleUseCase = new GetDoctorScheduleUseCase(doctorRepository);
export const searchDoctorsUseCase = new SearchDoctorsUseCase(doctorRepository);
export const bookAppointmentUseCase = new BookAppointmentUseCase(doctorRepository, appointmentRepository, transactionManager);
export const getMyAppointmentsUseCase = new GetMyAppointmentsUseCase(appointmentRepository);
export const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository, doctorRepository, transactionManager);
export const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentRepository, transactionManager);
export const createReviewUseCase = new CreateReviewUseCase(reviewRepository);
export const getDoctorReviewsUseCase = new GetDoctorReviewsUseCase(reviewRepository);

// ============= Controllers =============
export const doctorController = new DoctorController(
    getAllDoctorsUseCase,
    getDoctorByIdUseCase,
    getDoctorScheduleUseCase,
    searchDoctorsUseCase,
    createReviewUseCase,
    getDoctorReviewsUseCase
);

export const appointmentController = new AppointmentController(
    bookAppointmentUseCase,
    getMyAppointmentsUseCase,
    cancelAppointmentUseCase
);

export const deleteAppointmentController = new DeleteAppointmentController(deleteAppointmentUseCase);
