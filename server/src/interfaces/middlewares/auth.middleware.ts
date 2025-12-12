import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../../infrastructure/database/firestore';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken & {
                role?: 'patient' | 'doctor' | 'admin';
                doctorId?: string;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Fetch additional user info from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();

        // Prefer Custom Claims over Firestore (with fallback)
        const roleFromClaims = (decodedToken as any).role as 'patient' | 'doctor' | 'admin' | undefined;
        const doctorIdFromClaims = (decodedToken as any).doctorId as string | undefined;

        req.user = {
            ...decodedToken,
            role: roleFromClaims || userData?.role || 'patient',
            doctorId: doctorIdFromClaims || userData?.doctorId
        };

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return;
    }
    next();
};

export const requireDoctor = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'doctor' || !req.user.doctorId) {
        res.status(403).json({ error: 'Forbidden: Doctor access required' });
        return;
    }
    next();
};
