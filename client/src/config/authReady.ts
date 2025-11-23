import { auth } from './firebase';

let authReadyPromise: Promise<void> | null = null;

/**
 * Returns a promise that resolves when Firebase auth is initialized
 */
export function waitForAuth(): Promise<void> {
    if (!authReadyPromise) {
        authReadyPromise = new Promise((resolve) => {
            // If already signed in, resolve immediately
            if (auth.currentUser) {
                resolve();
                return;
            }

            // Otherwise wait for auth state to change
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve();
            });
        });
    }
    return authReadyPromise;
}
