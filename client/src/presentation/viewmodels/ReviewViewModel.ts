/**
 * View Model for Review
 * UI-friendly data structure optimized for rendering
 */
export interface ReviewViewModel {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    rating: number;
    comment: string;
    createdAt: string;

    // Formatted display values
    starsDisplay: string;            // "⭐⭐⭐⭐⭐"
    displayDate: string;             // "16 tháng 12, 2025"
    relativeTime: string;            // "2 ngày trước"

    // UI indicators
    isPositive: boolean;             // rating >= 4
    hasComment: boolean;
}
