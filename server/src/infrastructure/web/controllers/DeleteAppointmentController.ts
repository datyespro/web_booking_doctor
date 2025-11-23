import { Request, Response } from 'express';
import { DeleteAppointmentUseCase } from '../../../usecases/DeleteAppointmentUseCase';

export class DeleteAppointmentController {
    constructor(private deleteAppointmentUseCase: DeleteAppointmentUseCase) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.uid; // Assuming auth middleware adds user

            await this.deleteAppointmentUseCase.execute(id, userId);

            res.status(200).json({ message: 'Appointment deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting appointment:', error);
            if (error.message === 'Appointment not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Unauthorized to delete this appointment') {
                res.status(403).json({ error: error.message });
            } else if (error.message.includes('Only cancelled or completed')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}
