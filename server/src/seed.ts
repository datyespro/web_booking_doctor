import { db } from './infrastructure/database/firestore';
import { Doctor } from './domain/entities/Doctor';
import { Department } from './domain/entities/Department';
import { DailySchedule, TimeSlot } from './domain/entities/Schedule';
import { Appointment, AppointmentStatus } from './domain/entities/Appointment';

const departments: Department[] = [
    { id: 'dept-1', name: 'Cơ xương khớp', description: 'Chuyên khoa cơ xương khớp', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120331-co-xuong-khop.jpg' },
    { id: 'dept-2', name: 'Thần kinh', description: 'Chuyên khoa thần kinh', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/121042-than-kinh.jpg' },
    { id: 'dept-3', name: 'Tiêu hóa', description: 'Chuyên khoa tiêu hóa', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120933-tieu-hoa.jpg' },
    { id: 'dept-4', name: 'Tim mạch', description: 'Chuyên khoa tim mạch', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120741-tim-mach.jpg' },
    { id: 'dept-5', name: 'Da liễu', description: 'Chuyên khoa da liễu', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/115944-da-lieu.jpg' },
    { id: 'dept-6', name: 'Tai Mũi Họng', description: 'Chuyên khoa tai mũi họng', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120004-tai-mui-hong.jpg' },
    { id: 'dept-7', name: 'Răng Hàm Mặt', description: 'Chuyên khoa răng hàm mặt', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/115838-rang-ham-mat.jpg' },
    { id: 'dept-8', name: 'Sản Phụ Khoa', description: 'Chuyên khoa sản phụ khoa', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/115916-san-phu-khoa.jpg' },
    { id: 'dept-9', name: 'Mắt', description: 'Chuyên khoa mắt', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120005-chuyen-khoa-mat.jpg' },
    { id: 'dept-10', name: 'Nội Khoa', description: 'Chuyên khoa nội tổng quát', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/115853-noi-tong-quat.jpg' },
    { id: 'dept-11', name: 'Nhi Khoa', description: 'Chuyên khoa nhi', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120148-nhi-khoa.jpg' },
    { id: 'dept-12', name: 'Y học Cổ truyền', description: 'Y học cổ truyền', imageURL: 'https://cdn.bookingcare.vn/fr/w200/2019/12/13/120212-yhct.jpg' },
];

const doctors: Doctor[] = [
    {
        id: 'doc-1',
        name: 'PGS.TS.BS Nguyễn Mai Hồng',
        departmentId: 'dept-1',
        specialty: 'Cơ xương khớp',
        pricePerVisit: 500000,
        bookingCount: 15,
        clinicAddress: 'Bệnh viện Bạch Mai',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Nguyên Trưởng khoa Cơ Xương Khớp, Bệnh viện Bạch Mai',
        gender: 'female',
        location: 'Hà Nội',
        experience: 25,
        rating: 4.8,
        reviewCount: 120,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-2',
        name: 'ThS.BS Lê Thị Phương Huệ',
        departmentId: 'dept-3',
        specialty: 'Tiêu hóa',
        pricePerVisit: 300000,
        bookingCount: 8,
        clinicAddress: 'Phòng khám Đa khoa Vietlife',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Bác sĩ chuyên khoa Tiêu hóa, Bệnh viện Đa khoa Xanh Pôn',
        gender: 'female',
        location: 'Hà Nội',
        experience: 12,
        rating: 4.5,
        reviewCount: 85,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-3',
        name: 'GS.TS.BS Nguyễn Văn Thông',
        departmentId: 'dept-2',
        specialty: 'Thần kinh',
        pricePerVisit: 450000,
        bookingCount: 20,
        clinicAddress: 'Bệnh viện Quân y 108',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Chủ tịch Hội Đột quỵ Việt Nam',
        gender: 'male',
        location: 'Hà Nội',
        experience: 30,
        rating: 4.9,
        reviewCount: 200,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-4',
        name: 'BS.CKII Trần Minh Tuấn',
        departmentId: 'dept-4',
        specialty: 'Tim mạch',
        pricePerVisit: 400000,
        bookingCount: 35,
        clinicAddress: 'Bệnh viện Chợ Rẫy',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Bác sĩ chuyên khoa II Tim mạch, 15 năm kinh nghiệm',
        gender: 'male',
        location: 'TP. Hồ Chí Minh',
        experience: 15,
        rating: 4.7,
        reviewCount: 150,
        workingHours: { morning: true, afternoon: true, evening: true }
    },
    {
        id: 'doc-5',
        name: 'BS. Phạm Thị Lan Anh',
        departmentId: 'dept-5',
        specialty: 'Da liễu',
        pricePerVisit: 350000,
        bookingCount: 42,
        clinicAddress: 'Phòng khám Da liễu Đông Y',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Chuyên điều trị mụn, nám, lão hóa da',
        gender: 'female',
        location: 'Hà Nội',
        experience: 10,
        rating: 4.6,
        reviewCount: 180,
        workingHours: { morning: true, afternoon: true, evening: true }
    },
    {
        id: 'doc-6',
        name: 'ThS.BS Hoàng Văn Nam',
        departmentId: 'dept-6',
        specialty: 'Tai Mũi Họng',
        pricePerVisit: 320000,
        bookingCount: 28,
        clinicAddress: 'Bệnh viện Tai Mũi Họng TW',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Bác sĩ chuyên khoa Tai Mũi Họng, Bệnh viện TW',
        gender: 'male',
        location: 'Hà Nội',
        experience: 18,
        rating: 4.5,
        reviewCount: 95,
        workingHours: { morning: true, afternoon: false, evening: false }
    },
    {
        id: 'doc-7',
        name: 'BS.CKI Ngô Thị Thanh',
        departmentId: 'dept-7',
        specialty: 'Răng Hàm Mặt',
        pricePerVisit: 280000,
        bookingCount: 50,
        clinicAddress: 'Nha khoa Paris',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Chuyên implant, niềng răng, thẩm mỹ nha khoa',
        gender: 'female',
        location: 'TP. Hồ Chí Minh',
        experience: 8,
        rating: 4.8,
        reviewCount: 220,
        workingHours: { morning: true, afternoon: true, evening: true }
    },
    {
        id: 'doc-8',
        name: 'TS.BS Vũ Thị Hương',
        departmentId: 'dept-8',
        specialty: 'Sản Phụ Khoa',
        pricePerVisit: 380000,
        bookingCount: 38,
        clinicAddress: 'Bệnh viện Phụ Sản Hà Nội',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Chuyên khám thai, siêu âm 4D, tư vấn sản khoa',
        gender: 'female',
        location: 'Hà Nội',
        experience: 20,
        rating: 4.9,
        reviewCount: 310,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-9',
        name: 'PGS.TS Đặng Minh Hải',
        departmentId: 'dept-9',
        specialty: 'Mắt',
        pricePerVisit: 420000,
        bookingCount: 25,
        clinicAddress: 'Bệnh viện Mắt TW',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Chuyên phẫu thuật khúc xạ, điều trị tật khúc xạ',
        gender: 'male',
        location: 'Hà Nội',
        experience: 22,
        rating: 4.7,
        reviewCount: 140,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-10',
        name: 'BS. Lý Quốc Anh',
        departmentId: 'dept-10',
        specialty: 'Nội Khoa',
        pricePerVisit: 250000,
        bookingCount: 18,
        clinicAddress: 'Phòng khám Đa khoa Quốc tế',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Khám và điều trị bệnh nội khoa tổng quát',
        gender: 'male',
        location: 'Đà Nẵng',
        experience: 7,
        rating: 4.4,
        reviewCount: 68,
        workingHours: { morning: true, afternoon: true, evening: true }
    },
    {
        id: 'doc-11',
        name: 'ThS.BS Nguyễn Thị Mai',
        departmentId: 'dept-11',
        specialty: 'Nhi Khoa',
        pricePerVisit: 290000,
        bookingCount: 45,
        clinicAddress: 'Bệnh viện Nhi Đồng 1',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Chuyên khoa Nhi, điều trị bệnh trẻ em',
        gender: 'female',
        location: 'TP. Hồ Chí Minh',
        experience: 14,
        rating: 4.8,
        reviewCount: 205,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-12',
        name: 'Lương y Trần Văn Bình',
        departmentId: 'dept-12',
        specialty: 'Y học Cổ truyền',
        pricePerVisit: 200000,
        bookingCount: 32,
        clinicAddress: 'Trung tâm Y học Cổ truyền',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Lương y 30 năm kinh nghiệm, châm cứu, bấm huyệt',
        gender: 'male',
        location: 'Hà Nội',
        experience: 30,
        rating: 4.6,
        reviewCount: 175,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-13',
        name: 'BS.CKII Võ Thị Hồng',
        departmentId: 'dept-1',
        specialty: 'Cơ xương khớp',
        pricePerVisit: 380000,
        bookingCount: 22,
        clinicAddress: 'Bệnh viện 115',
        avatarUrl: '/images/doctor-female.png',
        bio: 'Chuyên điều trị thoái hóa khớp, viêm khớp dạng thấp',
        gender: 'female',
        location: 'TP. Hồ Chí Minh',
        experience: 16,
        rating: 4.6,
        reviewCount: 98,
        workingHours: { morning: false, afternoon: true, evening: true }
    },
    {
        id: 'doc-14',
        name: 'PGS.TS Bùi Văn Dũng',
        departmentId: 'dept-4',
        specialty: 'Tim mạch',
        pricePerVisit: 480000,
        bookingCount: 30,
        clinicAddress: 'Viện Tim mạch Quốc gia',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Chuyên gia tim mạch hàng đầu, can thiệp mạch vành',
        gender: 'male',
        location: 'Hà Nội',
        experience: 28,
        rating: 4.9,
        reviewCount: 250,
        workingHours: { morning: true, afternoon: true, evening: false }
    },
    {
        id: 'doc-15',
        name: 'BS. Đỗ Minh Quân',
        departmentId: 'dept-3',
        specialty: 'Tiêu hóa',
        pricePerVisit: 330000,
        bookingCount: 17,
        clinicAddress: 'Bệnh viện Đại học Y Hà Nội',
        avatarUrl: '/images/doctor-male.png',
        bio: 'Điều trị viêm loét dạ dày, đại tràng, gan mật',
        gender: 'male',
        location: 'Hà Nội',
        experience: 9,
        rating: 4.5,
        reviewCount: 72,
        workingHours: { morning: true, afternoon: false, evening: false }
    }
];

const generateSlots = (): TimeSlot[] => {
    return [
        { id: '08:00', time: '08:00 - 08:30', isBooked: false },
        { id: '08:30', time: '08:30 - 09:00', isBooked: false },
        { id: '09:00', time: '09:00 - 09:30', isBooked: false },
        { id: '09:30', time: '09:30 - 10:00', isBooked: false },
        { id: '10:00', time: '10:00 - 10:30', isBooked: false },
        { id: '10:30', time: '10:30 - 11:00', isBooked: false },
        { id: '13:30', time: '13:30 - 14:00', isBooked: false },
        { id: '14:00', time: '14:00 - 14:30', isBooked: false },
        { id: '14:30', time: '14:30 - 15:00', isBooked: false },
        { id: '15:00', time: '15:00 - 15:30', isBooked: false },
    ];
};

// Sample appointments data
const sampleAppointments: Omit<Appointment, 'id'>[] = [
    {
        patientId: 'user-1',
        patientName: 'Nguyễn Văn An',
        doctorId: 'doc-1',
        doctorName: 'PGS.TS.BS Nguyễn Mai Hồng',
        specialtyName: 'Cơ xương khớp',
        date: '2025-11-22',
        timeSlotId: '08:00',
        timeText: '08:00 - 08:30',
        patientPhone: '0901234567',
        patientGender: 'male',
        patientDob: '1990-01-01',
        patientAddress: 'Hà Nội',
        reason: 'Đau lưng',
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date('2025-11-18T10:00:00Z')
    },
    {
        patientId: 'user-2',
        patientName: 'Trần Thị Bích',
        doctorId: 'doc-5',
        doctorName: 'BS. Phạm Thị Lan Anh',
        specialtyName: 'Da liễu',
        date: '2025-11-21',
        timeSlotId: '09:00',
        timeText: '09:00 - 09:30',
        patientPhone: '0901234568',
        patientGender: 'female',
        patientDob: '1992-05-15',
        patientAddress: 'Hà Nội',
        reason: 'Mẩn ngứa',
        status: AppointmentStatus.COMPLETED,
        createdAt: new Date('2025-11-17T14:30:00Z')
    },
    {
        patientId: 'user-3',
        patientName: 'Lê Minh Tuấn',
        doctorId: 'doc-4',
        doctorName: 'BS.CKII Trần Minh Tuấn',
        specialtyName: 'Tim mạch',
        date: '2025-11-23',
        timeSlotId: '14:00',
        timeText: '14:00 - 14:30',
        patientPhone: '0901234569',
        patientGender: 'male',
        patientDob: '1985-08-20',
        patientAddress: 'TP.HCM',
        reason: 'Tim đập nhanh',
        status: AppointmentStatus.PENDING,
        createdAt: new Date('2025-11-19T09:15:00Z')
    },
    {
        patientId: 'user-1',
        patientName: 'Nguyễn Văn An',
        doctorId: 'doc-8',
        doctorName: 'TS.BS Vũ Thị Hương',
        specialtyName: 'Sản Phụ Khoa',
        date: '2025-11-24',
        timeSlotId: '10:00',
        timeText: '10:00 - 10:30',
        patientPhone: '0901234567',
        patientGender: 'male',
        patientDob: '1990-01-01',
        patientAddress: 'Hà Nội',
        reason: 'Khám thai định kỳ',
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date('2025-11-18T16:20:00Z')
    },
    {
        patientId: 'user-4',
        patientName: 'Phạm Thanh Hằng',
        doctorId: 'doc-11',
        doctorName: 'ThS.BS Nguyễn Thị Mai',
        specialtyName: 'Nhi Khoa',
        date: '2025-11-20',
        timeSlotId: '08:30',
        timeText: '08:30 - 09:00',
        patientPhone: '0901234570',
        patientGender: 'female',
        patientDob: '2015-12-12',
        patientAddress: 'Hà Nội',
        reason: 'Sốt cao',
        status: AppointmentStatus.COMPLETED,
        createdAt: new Date('2025-11-15T11:00:00Z')
    },
    {
        patientId: 'user-5',
        patientName: 'Hoàng Minh Đức',
        doctorId: 'doc-3',
        doctorName: 'GS.TS.BS Nguyễn Văn Thông',
        specialtyName: 'Thần kinh',
        date: '2025-11-25',
        timeSlotId: '09:30',
        timeText: '09:30 - 10:00',
        patientPhone: '0901234571',
        patientGender: 'male',
        patientDob: '1970-03-10',
        patientAddress: 'Hà Nội',
        reason: 'Đau đầu',
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date('2025-11-19T08:45:00Z')
    },
    {
        patientId: 'user-2',
        patientName: 'Trần Thị Bích',
        doctorId: 'doc-7',
        doctorName: 'BS.CKI Ngô Thị Thanh',
        specialtyName: 'Răng Hàm Mặt',
        date: '2025-11-19',
        timeSlotId: '14:30',
        timeText: '14:30 - 15:00',
        patientPhone: '0901234568',
        patientGender: 'female',
        patientDob: '1992-05-15',
        patientAddress: 'Hà Nội',
        reason: 'Đau răng',
        status: AppointmentStatus.CANCELLED,
        createdAt: new Date('2025-11-16T13:30:00Z')
    },
    {
        patientId: 'user-6',
        patientName: 'Vũ Quốc Huy',
        doctorId: 'doc-14',
        doctorName: 'PGS.TS Bùi Văn Dũng',
        specialtyName: 'Tim mạch',
        date: '2025-11-26',
        timeSlotId: '08:00',
        timeText: '08:00 - 08:30',
        patientPhone: '0901234572',
        patientGender: 'male',
        patientDob: '1965-11-11',
        patientAddress: 'Hà Nội',
        reason: 'Tức ngực',
        status: AppointmentStatus.PENDING,
        createdAt: new Date('2025-11-20T07:00:00Z')
    },
    {
        patientId: 'user-3',
        patientName: 'Lê Minh Tuấn',
        doctorId: 'doc-2',
        doctorName: 'ThS.BS Lê Thị Phương Huệ',
        specialtyName: 'Tiêu hóa',
        date: '2025-11-27',
        timeSlotId: '13:30',
        timeText: '13:30 - 14:00',
        patientPhone: '0901234569',
        patientGender: 'male',
        patientDob: '1985-08-20',
        patientAddress: 'TP.HCM',
        reason: 'Đau bụng',
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date('2025-11-19T15:10:00Z')
    },
    {
        patientId: 'user-7',
        patientName: 'Đỗ Thị Mai',
        doctorId: 'doc-9',
        doctorName: 'PGS.TS Đặng Minh Hải',
        specialtyName: 'Mắt',
        date: '2025-11-28',
        timeSlotId: '10:30',
        timeText: '10:30 - 11:00',
        patientPhone: '0901234573',
        patientGender: 'female',
        patientDob: '1995-02-28',
        patientAddress: 'Hà Nội',
        reason: 'Mờ mắt',
        status: AppointmentStatus.PENDING,
        createdAt: new Date('2025-11-20T10:00:00Z')
    }
];

async function seed() {
    console.log('🚀 Start seeding...');

    // 1. Departments
    for (const dept of departments) {
        await db.collection('departments').doc(dept.id).set(dept);
        console.log(`   ✅ Seeded department: ${dept.name}`);
    }

    // 2. Doctors & Schedules
    for (const doc of doctors) {
        await db.collection('doctors').doc(doc.id).set(doc);
        console.log(`   ✅ Seeded doctor: ${doc.name}`);

        // Create schedule for next 7 days
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

            const schedule: DailySchedule = {
                date: dateString,
                doctorId: doc.id,
                slots: generateSlots()
            };

            await db.collection('doctors').doc(doc.id).collection('schedules').doc(dateString).set(schedule);
        }
        console.log(`      -> Created schedules for 7 days`);
    }

    // 3. Sample Appointments
    console.log('\n📅 Seeding sample appointments...');
    for (const appointment of sampleAppointments) {
        await db.collection('appointments').add(appointment);
        console.log(`   ✅ Created appointment: ${appointment.patientName} -> ${appointment.doctorName} (${appointment.date})`);
    }

    console.log('\n✨ Seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Doctors: ${doctors.length}`);
    console.log(`   - Appointments: ${sampleAppointments.length}`);
    process.exit(0);
}

seed().catch(console.error);

