import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send('BookingCare Clone API is running');
});

// Import Firestore to ensure connection (will fail if service-account.json is missing)
import './infrastructure/database/firestore';
import doctorRoutes from './interfaces/routes/doctor.routes';
import appointmentRoutes from './interfaces/routes/appointment.routes';
import { errorMiddleware } from './interfaces/middlewares/error.middleware';

// Routes
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

// Error Handling (Must be last)
app.use(errorMiddleware);

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
