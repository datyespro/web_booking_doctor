import { admin, db } from './infrastructure/database/firestore';

async function removeDoctorRole(uid: string) {
    try {
        // 1. Get current user info
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            console.log('User not found in Firestore');
            return;
        }
        const userData = userDoc.data();
        console.log('Current user:', userData?.email, '- Role:', userData?.role);

        // 2. Update Firestore - change role to patient, remove doctorId
        await db.collection('users').doc(uid).update({
            role: 'patient',
            doctorId: admin.firestore.FieldValue.delete()
        });
        console.log('✅ Updated Firestore: role -> patient, removed doctorId');

        // 3. Update Custom Claims
        await admin.auth().setCustomUserClaims(uid, { role: 'patient' });
        console.log('✅ Updated Custom Claims: role -> patient');

        console.log('\n🎉 Done! User needs to re-login to get new token.');
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

// UID of Đạt Nguyễn
const uid = 'jST1gV4Gz1MEjH6SMAtQrFjZxn92';
console.log(`Removing doctor role for UID: ${uid}\n`);
removeDoctorRole(uid);
