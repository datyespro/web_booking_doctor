import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookAppointmentUseCase } from '../../usecases/BookAppointmentUseCase';
import { GetMyAppointmentsUseCase } from '../../usecases/GetMyAppointmentsUseCase';
import { CancelAppointmentUseCase } from '../../usecases/CancelAppointmentUseCase';

// Validation Schema
const bookAppointmentSchema = z.object({
    doctorId: z.string(),
    doctorName: z.string(),
    specialtyName: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    timeSlotId: z.string(),
    timeText: z.string(),
    // New fields
    patientPhone: z.string(),
    patientGender: z.string(),
    patientDob: z.string(),
    patientAddress: z.string(),
    reason: z.string()
});

export class AppointmentController {
    constructor(
        private bookAppointmentUseCase: BookAppointmentUseCase,
        private getMyAppointmentsUseCase: GetMyAppointmentsUseCase,
        private cancelAppointmentUseCase: CancelAppointmentUseCase
    ) { }

    book = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Validate Input
            const validatedData = bookAppointmentSchema.parse(req.body);

            // 2. Get User from Auth Middleware
            const user = req.user!; // Guaranteed by authMiddleware

            // 3. Call Use Case
            const appointment = await this.bookAppointmentUseCase.execute({
                patientId: user.uid,
                patientName: user.name || user.email || 'Unknown',
                ...validatedData
            });

            res.status(201).json(appointment);
        } catch (error) {
            next(error);
        }
    }

    getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const appointments = await this.getMyAppointmentsUseCase.execute(user.uid);
            res.json(appointments);
        } catch (error) {
            next(error);
        }
    }

    cancel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { id } = req.params;

            await this.cancelAppointmentUseCase.execute(id, user.uid);

            res.status(200).json({ message: 'Appointment cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
}
