import { FirestoreReviewRepository } from './infrastructure/database/FirestoreReviewRepository';
import { CreateReviewUseCase } from './usecases/CreateReviewUseCase';
import { GetDoctorReviewsUseCase } from './usecases/GetDoctorReviewsUseCase';

async function main() {
    console.log('🚀 Starting Review System Test...');

    const reviewRepo = new FirestoreReviewRepository();
    const createReviewUseCase = new CreateReviewUseCase(reviewRepo);
    const getReviewsUseCase = new GetDoctorReviewsUseCase(reviewRepo);

    const doctorId = 'doc-test-review';
    const patientId = 'patient-test-review';

    try {
        // 1. Create Review
        console.log('\n1. Creating Review...');
        const review = await createReviewUseCase.execute({
            doctorId,
            patientId,
            patientName: 'Test Patient',
            rating: 5,
            comment: 'Great doctor! Highly recommended.'
        });
        console.log('   ✅ Review created:', review.id);

        // 2. Get Reviews
        console.log('\n2. Fetching Reviews...');
        const reviews = await getReviewsUseCase.execute(doctorId);
        console.log(`   ✅ Found ${reviews.length} reviews for doctor ${doctorId}`);

        const found = reviews.find(r => r.id === review.id);
        if (found) {
            console.log('   ✅ Created review found in list!');
            console.log('      Rating:', found.rating);
            console.log('      Comment:', found.comment);
        } else {
            throw new Error('Created review not found in list');
        }

        console.log('\n✨ REVIEW SYSTEM VERIFIED SUCCESSFULLY!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

main();
