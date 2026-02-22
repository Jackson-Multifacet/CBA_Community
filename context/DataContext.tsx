
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Sermon, Event, Article, GalleryItem, Book, Post, DirectMessage, Member, Comment } from '../types';
import { ARTICLES as INITIAL_ARTICLES } from '../data/articles';
import { API_BASE_URL } from '../src/config';

// ... (keep initial data constants for Sermons, Gallery)
// Initial Mock Data for Sermons
const INITIAL_SERMONS: Sermon[] = [
    {
      id: 's1',
      title: 'Walking on Water',
      preacher: 'Rev. Michael Thomas',
      date: 'Oct 24, 2023',
      passage: 'Matthew 14:22-33',
      description: 'Understanding faith in the midst of life\'s storms.',
      category: 'Full Service',
      duration: '55:00',
      tags: ['Faith', 'Fear', 'Trust'],
    },
    {
      id: 'n1',
      title: '3 Minutes of Grace',
      preacher: 'Pastor Sarah Jenkins',
      date: 'Oct 26, 2023',
      passage: 'Ephesians 2:8',
      description: 'A quick nugget on the power of unmerited favor.',
      category: 'Nugget',
      duration: '03:15',
      tags: ['Grace'],
    },
    {
      id: 's2',
      title: 'The Prodigal Heart',
      preacher: 'Pastor Sarah Jenkins',
      date: 'Oct 17, 2023',
      passage: 'Luke 15:11-32',
      description: 'God\'s relentless love for those who have wandered away.',
      category: 'Full Service',
      duration: '48:30',
      tags: ['Grace', 'Forgiveness'],
    },
];

// Initial Mock Data for Gallery
const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', type: 'image', category: 'Story', title: 'Sunday Worship', date: '2023-10-29', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80' },
  { id: 'g2', type: 'image', category: 'Story', title: 'Youth Hangout', date: '2023-10-28', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80' },
  { id: 'g3', type: 'image', category: 'Story', title: 'Bible Study', date: '2023-10-25', url: 'https://images.unsplash.com/photo-1445633629932-0029acc44e88?auto=format&fit=crop&w=400&q=80' },
  { id: 'g4', type: 'image', category: 'Reel', title: 'Worship Highlights', date: '2023-10-29', url: 'https://images.unsplash.com/photo-1507692049790-de58293a469d?auto=format&fit=crop&w=400&q=80', likes: 120 },
  { id: 'g5', type: 'image', category: 'Reel', title: 'Pastor\'s Recap', date: '2023-10-24', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', likes: 85 },
  { id: 'g6', type: 'image', category: 'Service', title: 'Choir Ministration', date: '2023-10-22', url: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80' },
  { id: 'g7', type: 'image', category: 'Event', title: 'Community Outreach', date: '2023-10-15', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80' },
];

interface DataContextType {
  sermons: Sermon[];
  events: Event[];
  articles: Article[];
  galleryItems: GalleryItem[];
  books: Book[];
  posts: Post[];
  members: Member[];
  directMessages: DirectMessage[];
  
  // Sermon Actions
  addSermon: (sermon: Sermon) => void;
  updateSermon: (sermon: Sermon) => void;
  deleteSermon: (id: string) => void;

  // Event Actions
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;

  // Article Actions
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;

  // Gallery Actions
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Book Actions
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;

  // Community Actions
  addPost: (post: Post | FormData) => Promise<void>;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: { authorName: string, text: string }) => Promise<void>;
  sendDirectMessage: (msg: DirectMessage) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem('cba_sermons');
    return saved ? JSON.parse(saved) : INITIAL_SERMONS;
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('cba_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('cba_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);

  useEffect(() => { localStorage.setItem('cba_sermons', JSON.stringify(sermons)); }, [sermons]);
  useEffect(() => { localStorage.setItem('cba_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('cba_gallery', JSON.stringify(galleryItems)); }, [galleryItems]);

  // Socket.io Connection
  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('new_post', (post: Post) => {
      setPosts(prev => [post, ...prev]);
      toast.success(`New post from ${post.authorName}`);
    });

    newSocket.on('update_post', (updatedPost: Post) => {
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    });

    newSocket.on('new_message', (msg: DirectMessage) => {
      setDirectMessages(prev => [...prev, msg]);
      // Only toast if it's for me (in a real app check receiverId)
      // For now, we just show it
      toast.info(`New message from ${msg.senderId}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch Backend Data
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Fetch Books
        const booksRes = await fetch(`${API_BASE_URL}/books`);
        if (booksRes.ok) setBooks(await booksRes.json());

        // Fetch Events
        const eventsRes = await fetch(`${API_BASE_URL}/events`);
        if (eventsRes.ok) setEvents(await eventsRes.json());

        // Fetch Posts
        const postsRes = await fetch(`${API_BASE_URL}/posts`);
        if (postsRes.ok) setPosts(await postsRes.json());

        // Fetch Members
        const membersRes = await fetch(`${API_BASE_URL}/users`);
        if (membersRes.ok) setMembers(await membersRes.json());

        // Fetch Messages
        const messagesRes = await fetch(`${API_BASE_URL}/messages`);
        if (messagesRes.ok) setDirectMessages(await messagesRes.json());

      } catch (error) {
        console.log('Backend not fully connected, using some local data');
      }
    };
    fetchBackendData();
  }, []);

  // --- Actions ---

  const addSermon = (item: Sermon) => setSermons(prev => [item, ...prev]);
  const updateSermon = (item: Sermon) => setSermons(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteSermon = (id: string) => setSermons(prev => prev.filter(i => i.id !== id));

  // Event Actions (Backend Connected)
  const addEvent = async (item: Event) => {
    try {
        const res = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (res.ok) {
            const newEvent = await res.json();
            setEvents(prev => [newEvent, ...prev]);
            toast.success('Event created successfully');
        }
    } catch (e) { console.error("API Error", e); }
  };
  
  const updateEvent = async (item: Event) => {
    setEvents(prev => prev.map(i => i.id === item.id ? item : i));
    try {
        await fetch(`${API_BASE_URL}/events/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        toast.success('Event updated');
    } catch (e) { console.error("API Error", e); }
  };

  const deleteEvent = async (id: string) => {
     setEvents(prev => prev.filter(i => i.id !== id));
     try {
        await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE'
        });
        toast.success('Event deleted');
     } catch (e) { console.error("API Error", e); }
  };

  const addArticle = (item: Article) => setArticles(prev => [item, ...prev]);
  const updateArticle = (item: Article) => setArticles(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteArticle = (id: string) => setArticles(prev => prev.filter(i => i.id !== id));

  const addGalleryItem = (item: GalleryItem) => setGalleryItems(prev => [item, ...prev]);
  const deleteGalleryItem = (id: string) => setGalleryItems(prev => prev.filter(i => i.id !== id));

  // Book Actions with API Sync
  const addBook = async (item: Book) => {
    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
          const newBook = await res.json();
          setBooks(prev => [newBook, ...prev]);
          toast.success('Book added successfully');
      }
    } catch (err) {
      console.error("Failed to save book to backend", err);
    }
  };

  const updateBook = async (item: Book) => {
     setBooks(prev => prev.map(i => i.id === item.id ? item : i));
     try {
        await fetch(`${API_BASE_URL}/books/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        toast.success('Book updated');
     } catch (e) { console.error("API Error", e); }
  };

  const deleteBook = async (id: string) => {
     setBooks(prev => prev.filter(i => i.id !== id));
     try {
        await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'DELETE'
        });
        toast.success('Book deleted');
     } catch (e) { console.error("API Error", e); }
  };

  // Community Actions
  const addPost = async (postData: Post | FormData) => {
    if (postData instanceof FormData) {
      try {
        const res = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          body: postData
        });
        if (res.ok) {
          toast.success('Post published!');
          // Socket will handle the update
        }
      } catch (e) { 
          console.error("Failed to post", e); 
          toast.error('Failed to publish post');
      }
    }
  };
  
  const likePost = async (postId: string, userId: string) => {
    try {
        await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
    } catch (e) { console.error("Failed to like post", e); }
  };

  const addComment = async (postId: string, comment: { authorName: string, text: string }) => {
    try {
        await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        });
        toast.success('Comment added');
    } catch (e) { console.error("Failed to add comment", e); }
  };

  const sendDirectMessage = async (msg: DirectMessage) => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        });
        if (res.ok) {
            // Socket will handle update
        }
      } catch (e) { console.error("Failed to send message", e); }
  };

  return (
    <DataContext.Provider value={{
      sermons, events, articles, galleryItems, books, posts, members, directMessages,
      addSermon, updateSermon, deleteSermon,
      addEvent, updateEvent, deleteEvent,
      addArticle, updateArticle, deleteArticle,
      addGalleryItem, deleteGalleryItem,
      addBook, updateBook, deleteBook,
      addPost, likePost, addComment, sendDirectMessage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
