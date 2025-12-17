/**
 * Review Domain Entity
 * Contains business logic related to doctor reviews
 */
export class Review {
    constructor(
        public readonly id: string,
        public readonly doctorId: string,
        public readonly patientId: string,
        public readonly patientName: string,
        public readonly rating: number,
        public readonly comment: string,
        public readonly createdAt: string
    ) { }

    /**
     * Get star display string
     */
    getStarsDisplay(): string {
        return '⭐'.repeat(Math.round(this.rating));
    }

    /**
     * Get formatted date for display
     */
    getDisplayDate(): string {
        const date = new Date(this.createdAt);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Get relative time display (e.g., "2 ngày trước")
     */
    getRelativeTime(): string {
        const date = new Date(this.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
        return `${Math.floor(diffDays / 365)} năm trước`;
    }

    /**
     * Check if review is positive (>= 4 stars)
     */
    isPositive(): boolean {
        return this.rating >= 4;
    }

    /**
     * Check if review has comment
     */
    hasComment(): boolean {
        return this.comment.trim().length > 0;
    }
}

/**
 * DTO for creating new reviews
 */
export interface CreateReviewData {
    rating: number;
    comment: string;
    appointmentId?: string;
}
