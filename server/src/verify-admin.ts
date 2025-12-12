import axios from 'axios';
import { admin } from './infrastructure/database/firestore';

const API_URL = 'http://localhost:8080';
let adminToken: string;

async function setupAdmin() {
    console.log('Setting up admin user...');
    // Create a temporary admin user directly in Firebase for testing
    const email = `admin_test_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: 'Test Admin'
        });

        // Set custom claims or update Firestore role
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            email,
            role: 'admin',
            displayName: 'Test Admin',
            createdAt: new Date().toISOString()
        });

        // We need a way to get ID token. Since we are on server, we can't easily login with client SDK.
        // But we can use a custom token and exchange it? Or just mock the middleware?
        // Actually, for integration test against running server, we need a real token.
        // A workaround is to use a known admin account if exists, or just unit test the controllers.
        // But let's try to simulate a client login if possible, or skip auth check for localhost?
        // No, middleware enforces it.

        // Alternative: Create a custom token and use it? 
        // Admin SDK creates custom token, but client SDK exchanges it for ID token.
        // We don't have client SDK here easily.

        console.log('Admin user created:', email);
        console.log('UID:', userRecord.uid);
        console.log('Please manually login with this account in frontend to test, or use unit tests.');

        // For this script, we might need to mock the auth middleware or use a backdoor.
        // But let's just verify the server is running and routes are registered (401 is expected).
        return true;
    } catch (error) {
        console.error('Setup failed:', error);
        return false;
    }
}

async function verifyAdminRoutes() {
    console.log('\nVerifying Admin Routes (Expect 401 if not authenticated)...');

    try {
        await axios.get(`${API_URL}/admin/patients`);
    } catch (error: any) {
        console.log('GET /admin/patients error:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            if (error.response.status === 401) {
                console.log('✅ Auth middleware is working (401 Unauthorized)');
            } else {
                console.error('❌ Unexpected status:', error.response.status);
            }
        } else {
            console.error('❌ No response received:', error.code);
        }
    }

    try {
        await axios.get(`${API_URL}/admin/doctors`);
    } catch (error: any) {
        console.log('GET /admin/doctors error:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            if (error.response.status === 401) {
                console.log('✅ Auth middleware is working (401 Unauthorized)');
            } else {
                console.error('❌ Unexpected status:', error.response.status);
            }
        } else {
            console.error('❌ No response received:', error.code);
        }
    }
}

async function run() {
    await verifyAdminRoutes();
    // await setupAdmin(); // Optional: Create an admin user for manual testing
}

run();
