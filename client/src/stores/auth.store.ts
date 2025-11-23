import { create } from 'zustand';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),

    loginWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login failed:', error);
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
    }
}));
