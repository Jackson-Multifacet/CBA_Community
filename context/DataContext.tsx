
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sermon, Event, Article, GalleryItem, Book, Post, DirectMessage, Member, Comment, WalletTransaction } from '../types';
import { db } from '../src/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  addDoc,
  serverTimestamp,
  arrayUnion,
  or,
  where
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface DataContextType {
  sermons: Sermon[];
  events: Event[];
  articles: Article[];
  galleryItems: GalleryItem[];
  books: Book[];
  posts: Post[];
  members: Member[];
  directMessages: DirectMessage[];
  transactions: WalletTransaction[];
  
  // Sermon Actions
  addSermon: (sermon: Sermon) => Promise<void>;
  updateSermon: (sermon: Sermon) => Promise<void>;
  deleteSermon: (id: string) => Promise<void>;

  // Event Actions
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Article Actions
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  // Gallery Actions
  addGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  // Book Actions
  addBook: (book: Book) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;

  // Community Actions
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, comment: { authorName: string, text: string }) => Promise<void>;
  sendDirectMessage: (msg: Omit<DirectMessage, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  addTransaction: (transaction: Omit<WalletTransaction, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Setup Real-time Listeners for all collections
  useEffect(() => {
    // 1. Sermons
    const qSermons = query(collection(db, 'sermons'));
    const unsubSermons = onSnapshot(qSermons, (snapshot) => {
      setSermons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sermon)));
    }, (error) => console.error("Error fetching sermons:", error));

    // 2. Events
    const qEvents = query(collection(db, 'events'));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    }, (error) => console.error("Error fetching events:", error));

    // 3. Articles
    const qArticles = query(collection(db, 'articles'));
    const unsubArticles = onSnapshot(qArticles, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
    }, (error) => console.error("Error fetching articles:", error));

    // 4. Gallery
    const qGallery = query(collection(db, 'gallery'));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGalleryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
    }, (error) => console.error("Error fetching gallery:", error));

    // 5. Books
    const qBooks = query(collection(db, 'books'));
    const unsubBooks = onSnapshot(qBooks, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
    }, (error) => console.error("Error fetching books:", error));

    // 6. Community Posts
    const qPosts = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    }, (error) => console.error("Error fetching posts:", error));

    // 7. Members Directory (Usually you might restrict this in security rules)
    const qMembers = query(collection(db, 'users'));
    const unsubMembers = onSnapshot(qMembers, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    }, (error) => console.error("Error fetching members:", error));

    return () => {
      unsubSermons();
      unsubEvents();
      unsubArticles();
      unsubGallery();
      unsubBooks();
      unsubPosts();
      unsubMembers();
    };
  }, []);

  // Listen for user-specific data (Messages & Transactions)
  useEffect(() => {
    if (!user) {
      setDirectMessages([]);
      setTransactions([]);
      return;
    }
    
    // Messages Optimization
    const qMessages = query(
      collection(db, 'messages'),
      or(
        where('senderId', '==', user.id),
        where('receiverId', '==', user.id)
      )
    );
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
       const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DirectMessage));
       setDirectMessages(msgs);
    }, (error) => console.error("Error fetching messages:", error));

    // Transactions Optimization (Specific to user)
    const qTransactions = query(
      collection(db, 'transactions'),
      where('userId', '==', user.id),
      orderBy('date', 'desc')
    );
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WalletTransaction)));
    }, (error) => console.error("Error fetching transactions:", error));

    return () => {
      unsubMessages();
      unsubTransactions();
    };
  }, [user]);

  // --- CRUD API Helpers (Replacing REST/LocalState) ---

  const addSermon = async (item: Sermon) => {
    try {
      if(item.id && !item.id.startsWith('s')) { 
        // using existing ID if valid, else generate
        await setDoc(doc(db, 'sermons', item.id), item);
      } else {
        await addDoc(collection(db, 'sermons'), item);
      }
      toast.success('Sermon added successfully');
    } catch (e) {
      toast.error('Failed to add sermon');
      console.error(e);
    }
  };

  const updateSermon = async (item: Sermon) => {
    try {
      await updateDoc(doc(db, 'sermons', item.id), { ...item });
      toast.success('Sermon updated successfully');
    } catch (e) {
      toast.error('Failed to update sermon');
      console.error(e);
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sermons', id));
      toast.success('Sermon deleted');
    } catch (e) { console.error(e); }
  };

  // Events
  const addEvent = async (item: Event) => {
    try { await addDoc(collection(db, 'events'), item); toast.success('Event created'); } 
    catch (e) { console.error(e); }
  };
  const updateEvent = async (item: Event) => {
    try { await updateDoc(doc(db, 'events', item.id), { ...item }); toast.success('Event updated'); } 
    catch (e) { console.error(e); }
  };
  const deleteEvent = async (id: string) => {
    try { await deleteDoc(doc(db, 'events', id)); toast.success('Event deleted'); } 
    catch (e) { console.error(e); }
  };

  // Articles
  const addArticle = async (item: Article) => {
    try { await addDoc(collection(db, 'articles'), item); toast.success('Article created'); } 
    catch (e) { console.error(e); }
  };
  const updateArticle = async (item: Article) => {
    try { await updateDoc(doc(db, 'articles', item.id), { ...item }); toast.success('Article updated'); } 
    catch (e) { console.error(e); }
  };
  const deleteArticle = async (id: string) => {
    try { await deleteDoc(doc(db, 'articles', id)); toast.success('Article deleted'); } 
    catch (e) { console.error(e); }
  };

  // Gallery
  const addGalleryItem = async (item: GalleryItem) => {
    try { await addDoc(collection(db, 'gallery'), item); toast.success('Media added'); } 
    catch (e) { console.error(e); }
  };
  const deleteGalleryItem = async (id: string) => {
    try { await deleteDoc(doc(db, 'gallery', id)); toast.success('Media deleted'); } 
    catch (e) { console.error(e); }
  };

  // Books
  const addBook = async (item: Book) => {
    try { await addDoc(collection(db, 'books'), item); toast.success('Book published'); } 
    catch (e) { console.error(e); }
  };
  const updateBook = async (item: Book) => {
    try { await updateDoc(doc(db, 'books', item.id), { ...item }); toast.success('Book updated'); } 
    catch (e) { console.error(e); }
  };
  const deleteBook = async (id: string) => {
    try { await deleteDoc(doc(db, 'books', id)); toast.success('Book deleted'); } 
    catch (e) { console.error(e); }
  };

  // Community
  const addPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>) => {
    try {
      const newPost = {
        ...postData,
        likes: 0,
        comments: 0,
        likedBy: [],
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'posts'), newPost);
      toast.success('Post published!');
    } catch (e) {
      toast.error('Failed to publish post');
      console.error(e);
    }
  };

  const likePost = async (postId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likedBy: arrayUnion(userId)
      });
      // A cloud function usually tracks the total size, but we can do it simplistically here too
    } catch (e) { console.error("Failed to like post", e); }
  };

  const addComment = async (postId: string, comment: { authorName: string, text: string }) => {
    try {
      const cmt = { ...comment, id: Date.now().toString(), timestamp: new Date().toISOString() };
      await updateDoc(doc(db, 'posts', postId), {
        commentList: arrayUnion(cmt)
      });
      toast.success('Comment added');
    } catch (e) { console.error("Failed to add comment", e); }
  };

  const sendDirectMessage = async (msgData: Omit<DirectMessage, 'id' | 'timestamp' | 'read'>) => {
      try {
        const msg = {
          ...msgData,
          read: false,
          timestamp: new Date().toISOString()
        };
        await addDoc(collection(db, 'messages'), msg);
      } catch (e) { console.error("Failed to send message", e); }
  };

  const addTransaction = async (txData: Omit<WalletTransaction, 'id'>) => {
      try {
        await addDoc(collection(db, 'transactions'), {
          ...txData,
          userId: user?.id,
          date: new Date().toISOString()
        });
      } catch (e) {
        console.error("Failed to add transaction", e);
      }
  };

  return (
    <DataContext.Provider value={{
      sermons, events, articles, galleryItems, books, posts, members, directMessages, transactions,
      addSermon, updateSermon, deleteSermon,
      addEvent, updateEvent, deleteEvent,
      addArticle, updateArticle, deleteArticle,
      addGalleryItem, deleteGalleryItem,
      addBook, updateBook, deleteBook,
      addPost, likePost, addComment, sendDirectMessage, addTransaction
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
