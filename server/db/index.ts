import { Database } from './types';
import { localDb } from './local';
import { firestoreDb } from './firestore';

const useFirestore = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

export const db: Database = useFirestore ? firestoreDb : localDb;

console.log(`Using database: ${useFirestore ? 'Firestore' : 'Local JSON'}`);
