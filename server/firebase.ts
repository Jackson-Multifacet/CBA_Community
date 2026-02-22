import * as admin from 'firebase-admin';

let initialized = false;

export const initializeFirebase = () => {
  if (initialized) return;

  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      initialized = true;
      console.log('Firebase initialized');
    } else {
      console.warn('Firebase credentials not found.');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
};

export const getFirestore = () => {
  initializeFirebase();
  return initialized ? admin.firestore() : null;
};

export const getStorage = () => {
  initializeFirebase();
  return initialized ? admin.storage() : null;
};
