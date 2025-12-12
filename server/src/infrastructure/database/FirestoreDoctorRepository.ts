import type { IDoctorRepository, SearchDoctorFilters } from '../../domain/repositories/IDoctorRepository';
import type { Doctor } from '../../domain/entities/Doctor';
import type { DailySchedule } from '../../domain/entities/Schedule';
import { db } from './firestore';

export class FirestoreDoctorRepository implements IDoctorRepository {
    async findAll(): Promise<Doctor[]> {
        const snapshot = await db.collection('doctors').get();
        const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));

        // Fetch reviews and calculate average rating for each doctor
        const doctorsWithRatings = await Promise.all(
            doctors.map(async (doctor) => {
                const reviewsSnapshot = await db.collection('reviews')
                    .where('doctorId', '==', doctor.id)
                    .get();

                const reviews = reviewsSnapshot.docs.map(doc => doc.data());
                const reviewCount = reviews.length;

                let rating: number | undefined = undefined;
                if (reviewCount > 0) {
                    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                    rating = totalRating / reviewCount;
                }

                return {
                    ...doctor,
                    rating,
                    reviewCount
                };
            })
        );

        return doctorsWithRatings;
    }

    async findById(id: string): Promise<Doctor | null> {
        const doc = await db.collection('doctors').doc(id).get();
        if (!doc.exists) return null;

        const doctor = { id: doc.id, ...doc.data() } as Doctor;

        // Calculate rating from reviews
        const reviewsSnapshot = await db.collection('reviews')
            .where('doctorId', '==', id)
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const reviewCount = reviews.length;

        let rating: number | undefined = undefined;
        if (reviewCount > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            rating = totalRating / reviewCount;
        }

        return { ...doctor, rating, reviewCount };
    }

    async findByUserId(uid: string): Promise<Doctor | null> {
        const snapshot = await db.collection('doctors').where('uid', '==', uid).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
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

        // Fetch reviews and calculate average rating for each doctor
        const doctorsWithRatings = await Promise.all(
            doctors.map(async (doctor) => {
                const reviewsSnapshot = await db.collection('reviews')
                    .where('doctorId', '==', doctor.id)
                    .get();

                const reviews = reviewsSnapshot.docs.map(doc => doc.data());
                const reviewCount = reviews.length;

                let rating: number | undefined = undefined;
                if (reviewCount > 0) {
                    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                    rating = totalRating / reviewCount;
                }

                return { ...doctor, rating, reviewCount };
            })
        );

        // Sorting is now handled by the use case, not the repository
        return doctorsWithRatings;
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

    async create(doctor: Doctor): Promise<void> {
        await db.collection('doctors').doc(doctor.id).set(doctor);
    }

    async update(id: string, doctor: Partial<Doctor>): Promise<void> {
        await db.collection('doctors').doc(id).update(doctor);
    }

    async delete(id: string): Promise<void> {
        await db.collection('doctors').doc(id).delete();
    }
}
