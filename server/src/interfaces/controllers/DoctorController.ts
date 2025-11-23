import { Request, Response, NextFunction } from 'express';
import { GetAllDoctorsUseCase } from '../../usecases/GetAllDoctorsUseCase';
import { GetDoctorByIdUseCase } from '../../usecases/GetDoctorByIdUseCase';
import { GetDoctorScheduleUseCase } from '../../usecases/GetDoctorScheduleUseCase';
import { SearchDoctorsUseCase } from '../../usecases/SearchDoctorsUseCase';
import type { SearchDoctorFilters } from '../../domain/repositories/IDoctorRepository';

import { CreateReviewUseCase } from '../../usecases/CreateReviewUseCase';
import { GetDoctorReviewsUseCase } from '../../usecases/GetDoctorReviewsUseCase';

import { DoctorPresenter } from '../presenters/DoctorPresenter';

export class DoctorController {
    constructor(
        private getAllDoctorsUseCase: GetAllDoctorsUseCase,
        private getDoctorByIdUseCase: GetDoctorByIdUseCase,
        private getDoctorScheduleUseCase: GetDoctorScheduleUseCase,
        private searchDoctorsUseCase: SearchDoctorsUseCase,
        private createReviewUseCase: CreateReviewUseCase,
        private getDoctorReviewsUseCase: GetDoctorReviewsUseCase
    ) { }

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
            const { rating, comment } = req.body;

            const review = await this.createReviewUseCase.execute({
                doctorId: id,
                patientId: user.uid,
                patientName: user.name || user.email || 'Anonymous',
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
}
