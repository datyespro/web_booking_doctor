import { Router } from 'express';
import { appointmentController, deleteAppointmentController } from '../../infrastructure/container';
import { authMiddleware, requireDoctor } from '../middlewares/auth.middleware';

const router = Router();

// Protect all appointment routes
router.use(authMiddleware);

// Patient routes
router.post('/', appointmentController.book);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.post('/:id/cancel', appointmentController.cancel);
router.delete('/:id', (req, res) => deleteAppointmentController.handle(req, res));

// Doctor-only routes
router.get('/doctor/me', requireDoctor, appointmentController.getDoctorAppointments);
router.patch('/:id/status', requireDoctor, appointmentController.updateStatus);

export default router;
