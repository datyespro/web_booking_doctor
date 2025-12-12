import { create } from 'zustand';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    setPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export interface ExtendedUser extends User {
    role?: 'patient' | 'doctor' | 'admin';
    doctorId?: string;
}

interface AuthState {
    user: ExtendedUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<string>;
    loginWithEmail: (email: string, password: string) => Promise<string>;
    registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: ExtendedUser | null) => void;
    initializeUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),

    loginWithGoogle: async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            return await handleUserLogin(result.user, set);
        } catch (error) {
            console.error('Google Login failed:', error);
            throw error;
        }
    },

    loginWithEmail: async (email, password) => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return await handleUserLogin(result.user, set);
        } catch (error) {
            console.error('Email Login failed:', error);
            throw error;
        }
    },

    registerWithEmail: async (email, password, name) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Update display name
            await updateProfile(user, { displayName: name });

            // Force reload user to get updated profile
            await user.reload();
            const updatedUser = auth.currentUser!;

            await handleUserLogin(updatedUser, set);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },

    initializeUser: async (user: User) => {
        await handleUserLogin(user, set);
    }
}));

// Helper function to handle user data fetching/creation after login
async function handleUserLogin(user: User, set: any) {
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let role: 'patient' | 'doctor' | 'admin' = 'patient';
    let doctorId: string | undefined = undefined;

    if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || 'patient';
        doctorId = userData.doctorId;
    } else {
        // Create new user document
        await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            createdAt: new Date().toISOString()
        });
    }

    const extendedUser: ExtendedUser = {
        ...user,
        role,
        doctorId
    };

    set({ user: extendedUser, loading: false });
    return role;
}
