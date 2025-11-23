import { admin } from './infrastructure/database/firestore';

const API_URL = 'http://localhost:8080';
const API_KEY = 'AIzaSyATnitCyWBGQlmdByHrXlUw5KIEOmnZMrM'; // From client config

async function verifyCancellation() {
    console.log('🚀 Starting Cancellation API Verification...');

    try {
        // 1. Authenticate (Get ID Token)
        console.log('\n1. Authenticating...');
        const uid = 'verify-cancel-user-' + Date.now();
        const customToken = await admin.auth().createCustomToken(uid, { name: 'Verify Cancel User' });

        const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: customToken, returnSecureToken: true })
        });

        const authData = await authRes.json();
        if (!authData.idToken) throw new Error('Failed to get ID Token: ' + JSON.stringify(authData));
        const idToken = authData.idToken;
        console.log('   ✅ Authenticated as:', uid);

        // 2. Get Doctors
        console.log('\n2. Fetching Doctors...');
        const doctorsRes = await fetch(`${API_URL}/doctors`);
        const doctors = await doctorsRes.json();
        if (!Array.isArray(doctors) || doctors.length === 0) throw new Error('No doctors found');
        const doctor = doctors[0];
        console.log(`      Target Doctor: ${doctor.name} (${doctor.id})`);

        // 3. Get Schedule
        console.log('\n3. Fetching Schedule...');
        const today = new Date().toISOString().split('T')[0];
        const scheduleRes = await fetch(`${API_URL}/doctors/${doctor.id}/schedule?date=${today}`);
        const schedule = await scheduleRes.json();

        let targetSlot = schedule.slots?.find((s: any) => !s.isBooked);
        if (!targetSlot) {
            if (schedule.slots && schedule.slots.length > 0) {
                targetSlot = schedule.slots[0]; // Pick first even if booked, just to try
                console.log('   ⚠️ No empty slots, picking first slot (might fail booking if already booked)');
            } else {
                throw new Error('No slots available in schedule');
            }
        }
        console.log(`   ✅ Target slot: ${targetSlot.time} (${targetSlot.id})`);

        // 4. Book Appointment
        console.log('\n4. Booking Appointment...');
        const bookingData = {
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialtyName: doctor.specialty || 'General',
            date: today,
            timeSlotId: targetSlot.id,
            timeText: targetSlot.time || '00:00 - 00:30',
            patientPhone: '1234567890',
            patientGender: 'male',
            patientDob: '1990-01-01',
            patientAddress: 'Test Address',
            reason: 'Test Cancellation'
        };

        const bookRes = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(bookingData)
        });

        let appointmentId;
        if (bookRes.status === 201) {
            const appointment = await bookRes.json();
            appointmentId = appointment.id;
            console.log('   ✅ Booking Successful! ID:', appointmentId);
        } else {
            const err = await bookRes.json();
            console.log(`   ⚠️ Booking failed (${bookRes.status}):`, err);
            // Try to find an existing appointment to cancel if booking failed (e.g. already booked)
            if (bookRes.status === 409 || (bookRes.status === 400 && err.error === 'Slot already booked')) {
                // Fetch my appointments to find one to cancel
                const myApptsRes = await fetch(`${API_URL}/appointments/my-appointments`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                const myAppts = await myApptsRes.json();
                const existing = myAppts.find((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED');
                if (existing) {
                    appointmentId = existing.id;
                    console.log('   ✅ Found existing appointment to cancel:', appointmentId);
                } else {
                    throw new Error('Could not book and no existing appointment found to cancel');
                }
            } else {
                throw new Error('Booking failed and could not recover');
            }
        }

        // 5. Cancel Appointment
        console.log('\n5. Cancelling Appointment...');
        const cancelRes = await fetch(`${API_URL}/appointments/${appointmentId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (cancelRes.status === 200) {
            console.log('   ✅ Cancellation Successful!');
        } else {
            const errText = await cancelRes.text();
            console.error(`   ❌ Cancellation Failed (${cancelRes.status}):`, errText);
            throw new Error(`Cancellation failed with status ${cancelRes.status}`);
        }

        console.log('\n✨ VERIFICATION COMPLETED SUCCESSFULLY!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error);
        process.exit(1);
    }
}

verifyCancellation();
