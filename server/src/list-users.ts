import * as admin from 'firebase-admin';
import { db } from './infrastructure/database/firestore';

async function listUsers() {
    console.log('Fetching users...');
    try {
        const snapshot = await db.collection('users').get();
        if (snapshot.empty) {
            console.log('No users found in Firestore.');
            return;
        }

        console.log('\n--- Registered Users ---');
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`UID: ${doc.id}`);
            console.log(`Email: ${data.email}`);
            console.log(`Name: ${data.displayName}`);
            console.log(`Role: ${data.role || 'patient'}`);
            console.log(`DoctorId: ${data.doctorId || 'None'}`);
            console.log('------------------------');
        });
    } catch (error) {
        console.error('Error listing users:', error);
    }
}

listUsers();
