/**
 * Migration Script: Backfill Custom Claims for Existing Users
 * 
 * This script sets Firebase Custom Claims for all existing users
 * based on their role stored in Firestore.
 * 
 * Run with: npx ts-node src/migrate-custom-claims.ts
 */

import * as admin from 'firebase-admin';
import { db } from './infrastructure/database/firestore';

async function migrateCustomClaims() {
    console.log('Starting Custom Claims migration...\n');

    try {
        // Get all users from Firestore
        const usersSnapshot = await db.collection('users').get();

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const uid = userDoc.id;
            const role = userData.role || 'patient';
            const doctorId = userData.doctorId;

            try {
                // Check if user exists in Firebase Auth
                const userRecord = await admin.auth().getUser(uid);

                // Check if claims are already set
                const existingClaims = userRecord.customClaims || {};
                if (existingClaims.role === role && existingClaims.doctorId === doctorId) {
                    console.log(`[SKIP] ${userRecord.email} - Claims already set`);
                    skippedCount++;
                    continue;
                }

                // Set custom claims
                const claims: { role: string; doctorId?: string } = { role };
                if (role === 'doctor' && doctorId) {
                    claims.doctorId = doctorId;
                }

                await admin.auth().setCustomUserClaims(uid, claims);
                console.log(`[OK] ${userRecord.email} - Set role: ${role}${doctorId ? `, doctorId: ${doctorId}` : ''}`);
                successCount++;

            } catch (authError: any) {
                if (authError.code === 'auth/user-not-found') {
                    console.log(`[WARN] ${uid} - User not found in Firebase Auth, skipping`);
                    skippedCount++;
                } else {
                    console.error(`[ERROR] ${uid} - ${authError.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total users processed: ${usersSnapshot.size}`);
        console.log(`Success: ${successCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }

    console.log('\nMigration completed!');
    console.log('Note: Users need to re-login to get new tokens with updated claims.');
    process.exit(0);
}

migrateCustomClaims();
