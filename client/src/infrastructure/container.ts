// ============ Repositories ============
import { ApiDoctorRepository } from './repositories/ApiDoctorRepository';
import { ApiAppointmentRepository } from './repositories/ApiAppointmentRepository';
import { ApiReviewRepository } from './repositories/ApiReviewRepository';
import { ApiScheduleRepository } from './repositories/ApiScheduleRepository';

// ============ Doctor Use Cases ============
import { GetAllDoctorsUseCase } from '../usecases/doctors/GetAllDoctors';
import { SearchDoctorsUseCase } from '../usecases/doctors/SearchDoctors';
import { GetDoctorByIdUseCase } from '../usecases/doctors/GetDoctorByIdUseCase';

// ============ Appointment Use Cases ============
import { GetMyAppointmentsUseCase } from '../usecases/appointments/GetMyAppointmentsUseCase';
import { BookAppointmentUseCase } from '../usecases/appointments/BookAppointmentUseCase';
import { CancelAppointmentUseCase } from '../usecases/appointments/CancelAppointmentUseCase';
import { DeleteAppointmentUseCase } from '../usecases/appointments/DeleteAppointmentUseCase';
import { GetDoctorAppointmentsUseCase } from '../usecases/appointments/GetDoctorAppointmentsUseCase';
import { UpdateAppointmentStatusUseCase } from '../usecases/appointments/UpdateAppointmentStatusUseCase';

// ============ Review Use Cases ============
import { GetDoctorReviewsUseCase } from '../usecases/reviews/GetDoctorReviewsUseCase';
import { CreateReviewUseCase } from '../usecases/reviews/CreateReviewUseCase';

// ============ Schedule Use Cases ============
import { GetDoctorScheduleUseCase } from '../usecases/schedules/GetDoctorScheduleUseCase';
import { SaveDoctorScheduleUseCase } from '../usecases/schedules/SaveDoctorScheduleUseCase';

// ============ Presenters ============
import { DoctorPresenter } from '../presentation/presenters/DoctorPresenter';
import { AppointmentPresenter } from '../presentation/presenters/AppointmentPresenter';
import { ReviewPresenter } from '../presentation/presenters/ReviewPresenter';
import { SchedulePresenter } from '../presentation/presenters/SchedulePresenter';

/**
 * Dependency Injection Container
 * Wires up all dependencies following Clean Architecture
 */

// ============ Repository Instances ============
export const doctorRepository = new ApiDoctorRepository();
export const appointmentRepository = new ApiAppointmentRepository();
export const reviewRepository = new ApiReviewRepository();
export const scheduleRepository = new ApiScheduleRepository();

// ============ Doctor Use Case Instances ============
export const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository);
export const searchDoctorsUseCase = new SearchDoctorsUseCase(doctorRepository);
export const getDoctorByIdUseCase = new GetDoctorByIdUseCase(doctorRepository);

// ============ Appointment Use Case Instances ============
export const getMyAppointmentsUseCase = new GetMyAppointmentsUseCase(appointmentRepository);
export const bookAppointmentUseCase = new BookAppointmentUseCase(appointmentRepository);
export const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);
export const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentRepository);
export const getDoctorAppointmentsUseCase = new GetDoctorAppointmentsUseCase(appointmentRepository);
export const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository);

// ============ Review Use Case Instances ============
export const getDoctorReviewsUseCase = new GetDoctorReviewsUseCase(reviewRepository);
export const createReviewUseCase = new CreateReviewUseCase(reviewRepository);

// ============ Schedule Use Case Instances ============
export const getDoctorScheduleUseCase = new GetDoctorScheduleUseCase(scheduleRepository);
export const saveDoctorScheduleUseCase = new SaveDoctorScheduleUseCase(scheduleRepository);

// ============ Presenter Instances ============
export const doctorPresenter = new DoctorPresenter();
export const appointmentPresenter = new AppointmentPresenter();
export const reviewPresenter = new ReviewPresenter();
export const schedulePresenter = new SchedulePresenter();
