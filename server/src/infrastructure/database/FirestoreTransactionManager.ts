import { ITransactionManager } from '../../domain/repositories/ITransactionManager';
import { db } from './firestore';

export class FirestoreTransactionManager implements ITransactionManager {
    async runTransaction<T>(operation: (transaction: any) => Promise<T>): Promise<T> {
        return db.runTransaction(operation);
    }
}
