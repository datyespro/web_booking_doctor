// Repositories
import { ApiDoctorRepository } from './repositories/ApiDoctorRepository';

// Use Cases
import { GetAllDoctorsUseCase } from '../usecases/doctors/GetAllDoctors';
import { SearchDoctorsUseCase } from '../usecases/doctors/SearchDoctors';

// Presenters
import { DoctorPresenter } from '../presentation/presenters/DoctorPresenter';

/**
 * Dependency Injection Container
 * Wires up all dependencies following Clean Architecture
 */

// ============ Repositories ============
export const doctorRepository = new ApiDoctorRepository();

// ============ Use Cases ============
export const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository);
export const searchDoctorsUseCase = new SearchDoctorsUseCase(doctorRepository);

// ============ Presenters ============
export const doctorPresenter = new DoctorPresenter();
