import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Doctor } from '../types/entities/Doctor';
import type { TimeSlot } from '../types/entities/Schedule';

export interface PatientInfo {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
    gender: string;
    address: string;
    reason: string;
}

interface BookingData {
    doctor: Doctor | null;
    date: Date | null;
    slot: TimeSlot | null;
    patientInfo: PatientInfo;
}

interface BookingContextType {
    activeStep: number;
    bookingData: BookingData;
    nextStep: () => void;
    prevStep: () => void;
    setBookingData: (data: Partial<BookingData>) => void;
    updatePatientInfo: (info: Partial<PatientInfo>) => void;
    resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [bookingData, setBookingDataState] = useState<BookingData>({
        doctor: null,
        date: new Date(),
        slot: null,
        patientInfo: {
            fullName: '',
            phoneNumber: '',
            dateOfBirth: null,
            gender: 'male',
            address: '',
            reason: ''
        }
    });

    const nextStep = useCallback(() => setActiveStep((current) => (current < 3 ? current + 1 : current)), []);
    const prevStep = useCallback(() => setActiveStep((current) => (current > 0 ? current - 1 : current)), []);

    const setBookingData = useCallback((data: Partial<BookingData>) => {
        setBookingDataState((prev) => ({ ...prev, ...data }));
    }, []);

    const updatePatientInfo = useCallback((info: Partial<PatientInfo>) => {
        setBookingDataState((prev) => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, ...info }
        }));
    }, []);

    const resetBooking = useCallback(() => {
        setActiveStep(0);
        setBookingDataState({
            doctor: null,
            date: new Date(),
            slot: null,
            patientInfo: {
                fullName: '',
                phoneNumber: '',
                dateOfBirth: null,
                gender: 'male',
                address: '',
                reason: ''
            }
        });
    }, []);

    return (
        <BookingContext.Provider value={{
            activeStep,
            bookingData,
            nextStep,
            prevStep,
            setBookingData,
            updatePatientInfo,
            resetBooking
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
};
