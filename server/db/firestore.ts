import { Database } from './types';
import { getFirestore } from '../firebase';

const db = getFirestore();

export const firestoreDb: Database = {
  getPosts: async () => {
    if (!db) return [];
    const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getPost: async (id) => {
    if (!db) return null;
    const doc = await db.collection('posts').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
  createPost: async (post) => {
    if (!db) return post;
    const docRef = db.collection('posts').doc(post.id);
    await docRef.set(post);
    return post;
  },
  updatePost: async (id, post) => {
    if (!db) return post;
    await db.collection('posts').doc(id).update(post);
    return post;
  },
  getEvents: async () => {
    if (!db) return [];
    const snapshot = await db.collection('events').orderBy('date', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  createEvent: async (event) => {
    if (!db) return event;
    const docRef = db.collection('events').doc(event.id);
    await docRef.set(event);
    return event;
  },
  updateEvent: async (id, event) => {
    if (!db) return event;
    await db.collection('events').doc(id).update(event);
    return event;
  },
  deleteEvent: async (id) => {
    if (!db) return;
    await db.collection('events').doc(id).delete();
  },
  getBooks: async () => {
    if (!db) return [];
    const snapshot = await db.collection('books').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  createBook: async (book) => {
    if (!db) return book;
    const docRef = db.collection('books').doc(book.id);
    await docRef.set(book);
    return book;
  },
  updateBook: async (id, book) => {
    if (!db) return book;
    await db.collection('books').doc(id).update(book);
    return book;
  },
  deleteBook: async (id) => {
    if (!db) return;
    await db.collection('books').doc(id).delete();
  },
  getMessages: async () => {
    if (!db) return [];
    const snapshot = await db.collection('messages').orderBy('timestamp', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  createMessage: async (message) => {
    if (!db) return message;
    const docRef = db.collection('messages').doc(message.id);
    await docRef.set(message);
    return message;
  },
  getUsers: async () => {
    if (!db) return [];
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
