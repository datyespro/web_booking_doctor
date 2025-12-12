import { Request, Response } from 'express';
import { GetAllDoctorsAdminUseCase } from '../../usecases/admin/doctor/GetAllDoctorsAdminUseCase';
import { GetDoctorByIdAdminUseCase } from '../../usecases/admin/doctor/GetDoctorByIdAdminUseCase';
import { CreateDoctorUseCase } from '../../usecases/admin/doctor/CreateDoctorUseCase';
import { UpdateDoctorUseCase } from '../../usecases/admin/doctor/UpdateDoctorUseCase';
import { DeleteDoctorUseCase } from '../../usecases/admin/doctor/DeleteDoctorUseCase';

export class AdminDoctorController {
    constructor(
        private getAllDoctorsUseCase: GetAllDoctorsAdminUseCase,
        private getDoctorByIdUseCase: GetDoctorByIdAdminUseCase,
        private createDoctorUseCase: CreateDoctorUseCase,
        private updateDoctorUseCase: UpdateDoctorUseCase,
        private deleteDoctorUseCase: DeleteDoctorUseCase
    ) { }

    async getById(req: Request, res: Response) {
        try {
            const doctor = await this.getDoctorByIdUseCase.execute(req.params.id);
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(doctor);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const doctors = await this.getAllDoctorsUseCase.execute();
            res.json(doctors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const doctor = await this.createDoctorUseCase.execute(req.body);
            res.status(201).json(doctor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            await this.updateDoctorUseCase.execute(req.params.id, req.body);
            res.json({ message: 'Doctor updated successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.deleteDoctorUseCase.execute(req.params.id);
            res.json({ message: 'Doctor deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
