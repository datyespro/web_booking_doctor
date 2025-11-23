import type { IDoctorRepository, SearchDoctorFilters } from '../../domain/repositories/IDoctorRepository';
import type { Doctor } from '../../domain/entities/Doctor';
import type { DailySchedule } from '../../domain/entities/Schedule';
import { db } from './firestore';

export class FirestoreDoctorRepository implements IDoctorRepository {
    async findAll(): Promise<Doctor[]> {
        const snapshot = await db.collection('doctors').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    }

    async findById(id: string): Promise<Doctor | null> {
        const doc = await db.collection('doctors').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Doctor;
    }

    async search(filters: SearchDoctorFilters): Promise<Doctor[]> {
        let query: FirebaseFirestore.Query = db.collection('doctors');

        // Apply filters
        if (filters.specialty) {
            query = query.where('specialty', '==', filters.specialty);
        }

        if (filters.gender) {
            query = query.where('gender', '==', filters.gender);
        }

        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }

        // Fetch all matching documents
        const snapshot = await query.get();
        let doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));

        // Apply client-side filters (Firestore limitations)
        if (filters.minPrice !== undefined) {
            doctors = doctors.filter(d => d.pricePerVisit >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
            doctors = doctors.filter(d => d.pricePerVisit <= filters.maxPrice!);
        }

        if (filters.availability && filters.availability in ['morning', 'afternoon', 'evening']) {
            doctors = doctors.filter(d =>
                d.workingHours && d.workingHours[filters.availability as keyof typeof d.workingHours]
            );
        }

        // Sorting is now handled by the use case, not the repository
        return doctors;
    }


    async getSchedule(doctorId: string, date: string): Promise<DailySchedule | null> {
        const doc = await db.collection('doctors').doc(doctorId)
            .collection('schedules').doc(date).get();

        if (!doc.exists) return null;
        return doc.data() as DailySchedule;
    }

    async updateSchedule(schedule: DailySchedule): Promise<void> {
        await db.collection('doctors').doc(schedule.doctorId)
            .collection('schedules').doc(schedule.date).set(schedule);
    }
}
