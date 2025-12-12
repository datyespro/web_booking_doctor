import { Request, Response } from 'express';
import { GetDashboardStatsUseCase } from '../../usecases/admin/GetDashboardStatsUseCase';

export class AdminDashboardController {
    constructor(private getDashboardStatsUseCase: GetDashboardStatsUseCase) { }

    async getStats(req: Request, res: Response): Promise<void> {
        console.log('AdminDashboardController: Received request for stats');
        try {
            const stats = await this.getDashboardStatsUseCase.execute();
            console.log('AdminDashboardController: Returning stats:', stats);
            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
