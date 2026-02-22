import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

export const readDb = () => {
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

export const writeDb = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB:', error);
  }
};
