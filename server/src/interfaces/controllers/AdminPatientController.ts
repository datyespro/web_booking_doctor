import { Request, Response } from 'express';
import { GetAllPatientsUseCase } from '../../usecases/admin/patient/GetAllPatientsUseCase';
import { GetPatientByIdUseCase } from '../../usecases/admin/patient/GetPatientByIdUseCase';
import { CreatePatientUseCase } from '../../usecases/admin/patient/CreatePatientUseCase';
import { UpdatePatientUseCase } from '../../usecases/admin/patient/UpdatePatientUseCase';
import { DeletePatientUseCase } from '../../usecases/admin/patient/DeletePatientUseCase';

export class AdminPatientController {
    constructor(
        private getAllPatientsUseCase: GetAllPatientsUseCase,
        private getPatientByIdUseCase: GetPatientByIdUseCase,
        private createPatientUseCase: CreatePatientUseCase,
        private updatePatientUseCase: UpdatePatientUseCase,
        private deletePatientUseCase: DeletePatientUseCase
    ) { }

    async getAll(req: Request, res: Response) {
        try {
            const patients = await this.getAllPatientsUseCase.execute();
            res.json(patients);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const patient = await this.getPatientByIdUseCase.execute(req.params.id);
            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json(patient);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const patient = await this.createPatientUseCase.execute(req.body);
            res.status(201).json(patient);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            await this.updatePatientUseCase.execute(req.params.id, req.body);
            res.json({ message: 'Patient updated successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.deletePatientUseCase.execute(req.params.id);
            res.json({ message: 'Patient deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
