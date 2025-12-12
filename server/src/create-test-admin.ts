import { admin } from './infrastructure/database/firestore';

async function createTestAdmin(email: string, password: string) {
    try {
        // Check if user exists
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            console.log('User already exists:', userRecord.uid);
            console.log('Deleting user to recreate...');
            await admin.auth().deleteUser(userRecord.uid);
            throw { code: 'auth/user-not-found' }; // Trigger creation logic
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email,
                    password,
                    displayName: 'Admin User'
                });
                await admin.firestore().collection('users').doc(userRecord.uid).set({
                    email,
                    role: 'admin',
                    displayName: 'Admin User',
                    createdAt: new Date().toISOString()
                });
                console.log('Created new admin user:', userRecord.uid);
            } else {
                throw error;
            }
        }
        console.log('Setup complete. Login with:', email, password);
    } catch (error) {
        console.error('Error creating admin:', error);
    }
    // Print project ID to verify
    try {
        const serviceAccount = require('../service-account.json');
        console.log('Service Account Project ID:', serviceAccount.project_id);
    } catch (e) {
        console.log('Could not read service account for project ID');
    }
}

// Get args
const args = process.argv.slice(2);
const email = args[0] || 'admin@test.com';
const password = args[1] || 'password123';

console.log(`Creating admin account for ${email}...`);
createTestAdmin(email, password);
