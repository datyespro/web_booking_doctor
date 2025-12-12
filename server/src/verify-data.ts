import { db } from './infrastructure/database/firestore';

async function verifyData() {
    try {
        console.log('Verifying Firestore Data...');

        const usersSnapshot = await db.collection('users').get();
        console.log(`Total Users: ${usersSnapshot.size}`);
        usersSnapshot.docs.forEach(doc => {
            console.log(` - User: ${doc.id}, Role: ${doc.data().role}`);
        });

        const doctorsSnapshot = await db.collection('doctors').get();
        console.log(`Total Doctors: ${doctorsSnapshot.size}`);

        const appointmentsSnapshot = await db.collection('appointments').get();
        console.log(`Total Appointments: ${appointmentsSnapshot.size}`);

    } catch (error) {
        console.error('Error verifying data:', error);
    }
}

verifyData();
