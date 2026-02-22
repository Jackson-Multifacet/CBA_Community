import fs from 'fs';
import path from 'path';
import { Database } from './types';

const DB_FILE = path.join(process.cwd(), 'db.json');

const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { posts: [], events: [], books: [], messages: [], users: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { posts: [], events: [], books: [], messages: [], users: [] };
  }
};

const writeDb = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB:', error);
  }
};

export const localDb: Database = {
  getPosts: async () => readDb().posts || [],
  getPost: async (id) => readDb().posts?.find((p: any) => p.id === id) || null,
  createPost: async (post) => {
    const db = readDb();
    db.posts = [post, ...(db.posts || [])];
    writeDb(db);
    return post;
  },
  updatePost: async (id, post) => {
    const db = readDb();
    db.posts = (db.posts || []).map((p: any) => p.id === id ? post : p);
    writeDb(db);
    return post;
  },
  getEvents: async () => readDb().events || [],
  createEvent: async (event) => {
    const db = readDb();
    db.events = [event, ...(db.events || [])];
    writeDb(db);
    return event;
  },
  updateEvent: async (id, event) => {
    const db = readDb();
    db.events = (db.events || []).map((e: any) => e.id === id ? event : e);
    writeDb(db);
    return event;
  },
  deleteEvent: async (id) => {
    const db = readDb();
    db.events = (db.events || []).filter((e: any) => e.id !== id);
    writeDb(db);
  },
  getBooks: async () => readDb().books || [],
  createBook: async (book) => {
    const db = readDb();
    db.books = [book, ...(db.books || [])];
    writeDb(db);
    return book;
  },
  updateBook: async (id, book) => {
    const db = readDb();
    db.books = (db.books || []).map((b: any) => b.id === id ? book : b);
    writeDb(db);
    return book;
  },
  deleteBook: async (id) => {
    const db = readDb();
    db.books = (db.books || []).filter((b: any) => b.id !== id);
    writeDb(db);
  },
  getMessages: async () => readDb().messages || [],
  createMessage: async (message) => {
    const db = readDb();
    db.messages = [...(db.messages || []), message];
    writeDb(db);
    return message;
  },
  getUsers: async () => readDb().users || []
};
