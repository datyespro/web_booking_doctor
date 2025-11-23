/**
 * Doctor Domain Entity
 * Contains business logic and rules related to doctors
 */
export class Doctor {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly specialty: string = '',
        public readonly avatarUrl: string = '',
        public readonly bio: string = '',
        public readonly pricePerVisit: number = 0,
        public readonly clinicAddress: string = '',
        public readonly bookingCount: number = 0,
        public readonly gender?: 'male' | 'female',
        public readonly location?: string,
        public readonly experience?: number,
        public readonly rating?: number,
        public readonly reviewCount?: number,
        public readonly workingHours?: {
            morning: boolean;
            afternoon: boolean;
            evening: boolean;
        }
    ) { }

    /**
     * Get formatted rating display
     * Business logic: how to display rating to users
     */
    getDisplayRating(): string {
        if (!this.rating || this.rating === 0) {
            return 'Chưa có đánh giá';
        }
        const stars = '⭐'.repeat(Math.round(this.rating));
        return `${this.rating.toFixed(1)} ${stars} (${this.reviewCount || 0} đánh giá)`;
    }

    /**
     * Check if doctor is highly rated
     * Business rule: >  = 4.5 rating with at least 10 reviews
     */
    isHighlyRated(): boolean {
        return (this.rating || 0) >= 4.5 && (this.reviewCount || 0) >= 10;
    }

    /**
     * Get formatted price for display
     */
    getFormattedPrice(): string {
        return `${this.pricePerVisit.toLocaleString('vi-VN')} VNĐ`;
    }

    /**
     * Determine experience level based on years
     * Business rule for categorizing doctor experience
     */
    getExperienceLevel(): 'junior' | 'mid' | 'senior' | 'expert' {
        const years = this.experience || 0;
        if (years < 3) return 'junior';
        if (years < 7) return 'mid';
        if (years < 15) return 'senior';
        return 'expert';
    }

    /**
     * Get human-readable experience level text
     */
    getExperienceLevelText(): string {
        const level = this.getExperienceLevel();
        const labels = {
            junior: 'Bác sĩ mới',
            mid: 'Bác sĩ có kinh nghiệm',
            senior: 'Bác sĩ chuyên môn cao',
            expert: 'Chuyên gia đầu ngành',
        };
        return labels[level];
    }

    /**
     * Check if doctor works in a specific time period
     */
    isAvailableIn(period: 'morning' | 'afternoon' | 'evening'): boolean {
        return this.workingHours?.[period] || false;
    }
}
