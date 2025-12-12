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

import { GetMyDoctorProfileUseCase } from '../usecases/GetMyDoctorProfileUseCase';

import { GetDoctorAppointmentsUseCase } from '../usecases/GetDoctorAppointmentsUseCase';
import { UpdateAppointmentStatusUseCase } from '../usecases/UpdateAppointmentStatusUseCase';

// ============= Repositories =============
export const doctorRepository = new FirestoreDoctorRepository();
export const appointmentRepository = new FirestoreAppointmentRepository();
export const reviewRepository = new FirestoreReviewRepository();
export const transactionManager = new FirestoreTransactionManager();

// ============= Use Cases =============
import { SaveDoctorScheduleUseCase } from '../usecases/SaveDoctorScheduleUseCase';

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
export const getMyDoctorProfileUseCase = new GetMyDoctorProfileUseCase(doctorRepository);
export const getDoctorAppointmentsUseCase = new GetDoctorAppointmentsUseCase(appointmentRepository);
export const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository, doctorRepository);
export const saveDoctorScheduleUseCase = new SaveDoctorScheduleUseCase(doctorRepository);

// ============= Controllers =============
export const doctorController = new DoctorController(
    getAllDoctorsUseCase,
    getDoctorByIdUseCase,
    getDoctorScheduleUseCase,
    searchDoctorsUseCase,
    createReviewUseCase,
    getDoctorReviewsUseCase,
    getMyDoctorProfileUseCase,
    saveDoctorScheduleUseCase
);

export const appointmentController = new AppointmentController(
    bookAppointmentUseCase,
    getMyAppointmentsUseCase,
    cancelAppointmentUseCase,
    getDoctorAppointmentsUseCase,
    updateAppointmentStatusUseCase
);

export const deleteAppointmentController = new DeleteAppointmentController(deleteAppointmentUseCase);

// ============= Admin Dependencies =============
import { FirestoreUserRepository } from './database/FirestoreUserRepository';
import { FirebaseAuthService } from './auth/FirebaseAuthService';

// Admin Use Cases - Patient
import { GetAllPatientsUseCase } from '../usecases/admin/patient/GetAllPatientsUseCase';
import { GetPatientByIdUseCase } from '../usecases/admin/patient/GetPatientByIdUseCase';
import { CreatePatientUseCase } from '../usecases/admin/patient/CreatePatientUseCase';
import { UpdatePatientUseCase } from '../usecases/admin/patient/UpdatePatientUseCase';
import { DeletePatientUseCase } from '../usecases/admin/patient/DeletePatientUseCase';

// Admin Use Cases - Doctor
import { GetAllDoctorsAdminUseCase } from '../usecases/admin/doctor/GetAllDoctorsAdminUseCase';
import { GetDoctorByIdAdminUseCase } from '../usecases/admin/doctor/GetDoctorByIdAdminUseCase';
import { CreateDoctorUseCase } from '../usecases/admin/doctor/CreateDoctorUseCase';
import { UpdateDoctorUseCase } from '../usecases/admin/doctor/UpdateDoctorUseCase';
import { DeleteDoctorUseCase } from '../usecases/admin/doctor/DeleteDoctorUseCase';
import { GetDashboardStatsUseCase } from '../usecases/admin/GetDashboardStatsUseCase';

// Admin Controllers
import { AdminPatientController } from '../interfaces/controllers/AdminPatientController';
import { AdminDoctorController } from '../interfaces/controllers/AdminDoctorController';
import { AdminDashboardController } from '../interfaces/controllers/AdminDashboardController';

// Repositories & Services
export const userRepository = new FirestoreUserRepository();
export const authService = new FirebaseAuthService();

// Use Cases - Patient
export const getAllPatientsUseCase = new GetAllPatientsUseCase(userRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(userRepository);
export const createPatientUseCase = new CreatePatientUseCase(userRepository, authService);
export const updatePatientUseCase = new UpdatePatientUseCase(userRepository, authService);
export const deletePatientUseCase = new DeletePatientUseCase(userRepository, authService);

// Use Cases - Doctor
export const getAllDoctorsAdminUseCase = new GetAllDoctorsAdminUseCase(doctorRepository);
export const getDoctorByIdAdminUseCase = new GetDoctorByIdAdminUseCase(doctorRepository);
export const createDoctorUseCaseAdmin = new CreateDoctorUseCase(doctorRepository, userRepository, authService);
export const updateDoctorUseCaseAdmin = new UpdateDoctorUseCase(doctorRepository, authService);
export const deleteDoctorUseCaseAdmin = new DeleteDoctorUseCase(doctorRepository, userRepository, authService);
export const getDashboardStatsUseCase = new GetDashboardStatsUseCase();

// Controllers
export const adminPatientController = new AdminPatientController(
    getAllPatientsUseCase,
    getPatientByIdUseCase,
    createPatientUseCase,
    updatePatientUseCase,
    deletePatientUseCase
);

export const adminDoctorController = new AdminDoctorController(
    getAllDoctorsAdminUseCase,
    getDoctorByIdAdminUseCase,
    createDoctorUseCaseAdmin,
    updateDoctorUseCaseAdmin,
    deleteDoctorUseCaseAdmin
);

export const adminDashboardController = new AdminDashboardController(getDashboardStatsUseCase);
