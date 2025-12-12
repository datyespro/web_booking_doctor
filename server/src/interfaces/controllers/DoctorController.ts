import { Request, Response, NextFunction } from 'express';
import { GetAllDoctorsUseCase } from '../../usecases/GetAllDoctorsUseCase';
import { GetDoctorByIdUseCase } from '../../usecases/GetDoctorByIdUseCase';
import { GetDoctorScheduleUseCase } from '../../usecases/GetDoctorScheduleUseCase';
import { SearchDoctorsUseCase } from '../../usecases/SearchDoctorsUseCase';
import type { SearchDoctorFilters } from '../../domain/repositories/IDoctorRepository';

import { CreateReviewUseCase } from '../../usecases/CreateReviewUseCase';
import { GetDoctorReviewsUseCase } from '../../usecases/GetDoctorReviewsUseCase';

import { GetMyDoctorProfileUseCase } from '../../usecases/GetMyDoctorProfileUseCase';

import { SaveDoctorScheduleUseCase } from '../../usecases/SaveDoctorScheduleUseCase';

import { DoctorPresenter } from '../presenters/DoctorPresenter';

export class DoctorController {
    constructor(
        private getAllDoctorsUseCase: GetAllDoctorsUseCase,
        private getDoctorByIdUseCase: GetDoctorByIdUseCase,
        private getDoctorScheduleUseCase: GetDoctorScheduleUseCase,
        private searchDoctorsUseCase: SearchDoctorsUseCase,
        private createReviewUseCase: CreateReviewUseCase,
        private getDoctorReviewsUseCase: GetDoctorReviewsUseCase,
        private getMyDoctorProfileUseCase: GetMyDoctorProfileUseCase,
        private saveDoctorScheduleUseCase: SaveDoctorScheduleUseCase
    ) { }

    getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            // Role validation now handled by requireDoctor middleware
            const doctor = await this.getMyDoctorProfileUseCase.execute(user.uid);
            if (!doctor) {
                res.status(404).json({ error: 'Doctor profile not found' });
                return;
            }

            res.json(DoctorPresenter.toResponse(doctor));
        } catch (error) {
            next(error);
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const doctors = await this.getAllDoctorsUseCase.execute();
            res.json(DoctorPresenter.toListResponse(doctors));
        } catch (error) {
            next(error);
        }
    }

    search = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: SearchDoctorFilters = {
                specialty: req.query.specialty as string | undefined,
                gender: req.query.gender as 'male' | 'female' | undefined,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                location: req.query.location as string | undefined,
                availability: req.query.availability as 'morning' | 'afternoon' | 'evening' | undefined,
                sortBy: req.query.sortBy as 'price' | 'rating' | 'experience' | 'bookingCount' | undefined
            };

            const doctors = await this.searchDoctorsUseCase.execute(filters);
            res.json(DoctorPresenter.toListResponse(doctors));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const doctor = await this.getDoctorByIdUseCase.execute(id);
            // Use case now throws exception if not found, no need to check null
            res.json(DoctorPresenter.toResponse(doctor));
        } catch (error) {
            next(error);
        }
    }

    getSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { date } = req.query;

            if (!date) {
                res.status(400).json({ error: 'Date query parameter is required' });
                return;
            }

            const schedule = await this.getDoctorScheduleUseCase.execute(id, date as string);
            res.json(schedule);
        } catch (error) {
            next(error);
        }
    }

    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = req.user!; // Authenticated user
            const { rating, comment, appointmentId } = req.body;

            const review = await this.createReviewUseCase.execute({
                doctorId: id,
                patientId: user.uid,
                patientName: user.name || user.email || 'Anonymous',
                appointmentId,
                rating,
                comment
            });

            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    getReviews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const reviews = await this.getDoctorReviewsUseCase.execute(id);
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    }

    saveSchedule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            // Role validation now handled by requireDoctor middleware

            const { date, slots } = req.body;
            if (!date || !slots) {
                res.status(400).json({ error: 'Date and slots are required' });
                return;
            }

            await this.saveDoctorScheduleUseCase.execute(user.doctorId!, date, slots);
            res.status(200).json({ message: 'Schedule saved successfully' });
        } catch (error) {
            next(error);
        }
    }
}
