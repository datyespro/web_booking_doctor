import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { db } from './firestore';

export class FirestoreUserRepository implements IUserRepository {
    private collection = db.collection('users');

    async findAll(): Promise<User[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    }

    async findById(id: string): Promise<User | null> {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const snapshot = await this.collection.where('email', '==', email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
    }

    async create(user: User): Promise<void> {
        await this.collection.doc(user.id).set(user);
    }

    async update(id: string, user: Partial<User>): Promise<void> {
        await this.collection.doc(id).update(user);
    }

    async delete(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }
}
