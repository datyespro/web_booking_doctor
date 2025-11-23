import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Check if service-account.json exists
const serviceAccountPath = path.resolve(__dirname, '../../../service-account.json');

let db: admin.firestore.Firestore;

try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log('Firestore connected successfully');
} catch (error) {
    console.error('Error connecting to Firestore:', error);
    console.error('Make sure service-account.json is present in the server root directory.');
    process.exit(1);
}

export { db, admin };
