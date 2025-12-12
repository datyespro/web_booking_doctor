import { db } from '../../infrastructure/database/firestore';

export interface DashboardStats {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
}

export class GetDashboardStatsUseCase {
    async execute(): Promise<DashboardStats> {
        console.log('GetDashboardStatsUseCase: Executing...');
        const patientsSnapshot = await db.collection('users').where('role', '==', 'patient').get();
        console.log(`GetDashboardStatsUseCase: Found ${patientsSnapshot.size} patients`);

        const doctorsSnapshot = await db.collection('doctors').get();
        console.log(`GetDashboardStatsUseCase: Found ${doctorsSnapshot.size} doctors`);

        const appointmentsSnapshot = await db.collection('appointments').get();
        console.log(`GetDashboardStatsUseCase: Found ${appointmentsSnapshot.size} appointments`);

        return {
            totalPatients: patientsSnapshot.size,
            totalDoctors: doctorsSnapshot.size,
            totalAppointments: appointmentsSnapshot.size
        };
    }
}
