import { Router } from 'express';
import { appointmentController, deleteAppointmentController } from '../../infrastructure/container';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all appointment routes
router.use(authMiddleware);

router.post('/', appointmentController.book);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.post('/:id/cancel', appointmentController.cancel);
router.delete('/:id', (req, res) => deleteAppointmentController.handle(req, res));

export default router;
