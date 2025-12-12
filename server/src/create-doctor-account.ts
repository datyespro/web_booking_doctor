import { admin, db } from './infrastructure/database/firestore';

async function createDoctorAccount(email: string, password: string, doctorId: string) {
    console.log(`Creating doctor account for ${email}...`);

    try {
        // 1. Check if doctor exists
        const doctorRef = db.collection('doctors').doc(doctorId);
        const doctorDoc = await doctorRef.get();

        if (!doctorDoc.exists) {
            console.error(`Doctor with ID ${doctorId} not found.`);
            return;
        }

        // 2. Create User in Firebase Auth
        let uid: string;
        try {
            const userRecord = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: doctorDoc.data()?.name || 'Doctor',
                emailVerified: true,
            });
            uid = userRecord.uid;
            console.log(`Created Auth User: ${uid}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-exists') {
                console.log('User already exists, fetching UID...');
                const userRecord = await admin.auth().getUserByEmail(email);
                uid = userRecord.uid;
            } else {
                throw error;
            }
        }

        // 3. Create/Update User in Firestore
        await db.collection('users').doc(uid).set({
            email: email,
            displayName: doctorDoc.data()?.name || 'Doctor',
            role: 'doctor',
            doctorId: doctorId,
            createdAt: new Date().toISOString()
        }, { merge: true });
        console.log(`Updated Firestore User: ${uid}`);

        // 4. Link Doctor Profile
        await doctorRef.update({
            uid: uid,
            email: email
        });
        console.log(`Linked Doctor Profile ${doctorId} to User ${uid}`);

        console.log('\n✅ Doctor Account Created Successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Doctor Profile: ${doctorDoc.data()?.name}`);

    } catch (error) {
        console.error('Error creating doctor account:', error);
    }
}

// Get args
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: npx ts-node src/create-doctor-account.ts <email> <password> <doctorId>');
    process.exit(1);
}

const [email, password, doctorId] = args;
createDoctorAccount(email, password, doctorId);
