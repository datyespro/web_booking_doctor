import * as admin from 'firebase-admin';
import { db } from './infrastructure/database/firestore';

// Initialize Firebase Admin if not already initialized (handled in firestore.ts but good to be safe or just import db)
// Assuming db import initializes it.

async function linkDoctorUser(uid: string, doctorId: string) {
    console.log(`Linking User ${uid} to Doctor ${doctorId}...`);

    try {
        // 1. Check if User exists
        // Note: We might not have a 'users' collection sync yet if it's just auth, 
        // but the requirement says we have a 'users' collection.
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error(`User with UID ${uid} not found in 'users' collection.`);
            // Optional: Create user stub if missing? For now, assume it exists.
            return;
        }

        // 2. Check if Doctor exists
        const doctorRef = db.collection('doctors').doc(doctorId);
        const doctorDoc = await doctorRef.get();

        if (!doctorDoc.exists) {
            console.error(`Doctor with ID ${doctorId} not found.`);
            return;
        }

        // 3. Update User
        await userRef.update({
            role: 'doctor',
            doctorId: doctorId
        });
        console.log(`Updated User ${uid} with role='doctor' and doctorId=${doctorId}`);

        // 4. Update Doctor
        await doctorRef.update({
            uid: uid,
            email: userDoc.data()?.email // Sync email if available
        });
        console.log(`Updated Doctor ${doctorId} with uid=${uid}`);

        console.log('Successfully linked User and Doctor!');

    } catch (error) {
        console.error('Error linking accounts:', error);
    }
}

// Get args from command line
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log('Usage: npx ts-node src/link-doctor-user.ts <UID> <DOCTOR_ID>');
    process.exit(1);
}

const [uid, doctorId] = args;
linkDoctorUser(uid, doctorId);
