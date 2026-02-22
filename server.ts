import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { readDb, writeDb } from './db';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes

// Posts
app.get('/api/posts', (req, res) => {
  const db = readDb();
  res.json(db.posts || []);
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { content, authorId, authorName, authorAvatar } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const newPost = {
    id: Date.now().toString(),
    authorId,
    authorName,
    authorAvatar,
    content,
    imageUrl,
    likes: 0,
    comments: 0,
    timestamp: new Date().toISOString(),
    likedBy: [],
    commentList: []
  };

  const db = readDb();
  db.posts = [newPost, ...(db.posts || [])];
  writeDb(db);

  io.emit('new_post', newPost);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { userId } = req.body;
  const db = readDb();
  const post = db.posts.find((p: any) => p.id === req.params.id);
  
  if (post) {
    const isLiked = post.likedBy.includes(userId);
    if (isLiked) {
      post.likedBy = post.likedBy.filter((id: string) => id !== userId);
      post.likes--;
    } else {
      post.likedBy.push(userId);
      post.likes++;
    }
    writeDb(db);
    io.emit('update_post', post);
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { authorName, text } = req.body;
  const db = readDb();
  const post = db.posts.find((p: any) => p.id === req.params.id);

  if (post) {
    const newComment = {
      id: Date.now().toString(),
      authorName,
      text,
      timestamp: new Date().toISOString()
    };
    if (!post.commentList) {
        post.commentList = [];
    }
    post.commentList.push(newComment);
    post.comments++;
    writeDb(db);
    io.emit('update_post', post);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Events
app.get('/api/events', (req, res) => {
  const db = readDb();
  res.json(db.events || []);
});

app.post('/api/events', (req, res) => {
  const event = req.body;
  const db = readDb();
  db.events = [event, ...(db.events || [])];
  writeDb(db);
  res.status(201).json(event);
});

app.put('/api/events/:id', (req, res) => {
  const event = req.body;
  const db = readDb();
  db.events = (db.events || []).map((e: any) => e.id === req.params.id ? event : e);
  writeDb(db);
  res.json(event);
});

app.delete('/api/events/:id', (req, res) => {
  const db = readDb();
  db.events = (db.events || []).filter((e: any) => e.id !== req.params.id);
  writeDb(db);
  res.status(204).send();
});

// Books
app.get('/api/books', (req, res) => {
  const db = readDb();
  res.json(db.books || []);
});

app.post('/api/books', (req, res) => {
  const book = req.body;
  const db = readDb();
  db.books = [book, ...(db.books || [])];
  writeDb(db);
  res.status(201).json(book);
});

app.put('/api/books/:id', (req, res) => {
  const book = req.body;
  const db = readDb();
  db.books = (db.books || []).map((b: any) => b.id === req.params.id ? book : b);
  writeDb(db);
  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const db = readDb();
  db.books = (db.books || []).filter((b: any) => b.id !== req.params.id);
  writeDb(db);
  res.status(204).send();
});

// Messages
app.get('/api/messages', (req, res) => {
  const db = readDb();
  res.json(db.messages || []);
});

app.post('/api/messages', (req, res) => {
  const message = req.body;
  const db = readDb();
  db.messages = [...(db.messages || []), message];
  writeDb(db);
  io.emit('new_message', message);
  res.status(201).json(message);
});

// Users (Members)
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json(db.users || []);
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
