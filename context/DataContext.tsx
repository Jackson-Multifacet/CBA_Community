
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sermon, Event, Article, GalleryItem, Book } from '../types';
import { ARTICLES as INITIAL_ARTICLES } from '../data/articles';
import { API_BASE_URL } from '../src/config';

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

// Initial Mock Data for Events (Fallback)
const INITIAL_EVENTS: Event[] = [
    {
      id: 'ot-2026',
      title: 'The Old Testament In 3 Months',
      date: 'March 1, 2026',
      time: 'Ongoing (Daily)',
      location: 'Global / In-App',
      description: 'Join the entire Christ Believers Assembly family for a transformative 90-day journey through the foundations of our faith.',
      category: 'Program',
      featured: true,
      isRegistered: true 
    }
];

// Initial Mock Data for Gallery
const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', type: 'image', category: 'Story', title: 'Sunday Worship', date: '2023-10-29', url: 'https://picsum.photos/400/800?random=g1' },
  { id: 'g2', type: 'image', category: 'Story', title: 'Youth Hangout', date: '2023-10-28', url: 'https://picsum.photos/400/800?random=g2' },
  { id: 'g3', type: 'image', category: 'Story', title: 'Bible Study', date: '2023-10-25', url: 'https://picsum.photos/400/800?random=g3' },
  { id: 'g4', type: 'image', category: 'Reel', title: 'Worship Highlights', date: '2023-10-29', url: 'https://picsum.photos/400/700?random=g4', likes: 120 },
  { id: 'g5', type: 'image', category: 'Reel', title: 'Pastor\'s Recap', date: '2023-10-24', url: 'https://picsum.photos/400/700?random=g5', likes: 85 },
  { id: 'g6', type: 'image', category: 'Service', title: 'Choir Ministration', date: '2023-10-22', url: 'https://picsum.photos/800/600?random=g6' },
  { id: 'g7', type: 'image', category: 'Event', title: 'Community Outreach', date: '2023-10-15', url: 'https://picsum.photos/800/600?random=g7' },
];

const INITIAL_BOOKS: Book[] = [];

interface DataContextType {
  sermons: Sermon[];
  events: Event[];
  articles: Article[];
  galleryItems: GalleryItem[];
  books: Book[];
  
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem('cba_sermons');
    return saved ? JSON.parse(saved) : INITIAL_SERMONS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('cba_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('cba_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('cba_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('cba_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  useEffect(() => { localStorage.setItem('cba_sermons', JSON.stringify(sermons)); }, [sermons]);
  useEffect(() => { localStorage.setItem('cba_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('cba_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('cba_gallery', JSON.stringify(galleryItems)); }, [galleryItems]);
  useEffect(() => { localStorage.setItem('cba_books', JSON.stringify(books)); }, [books]);

  // Fetch Books & Events from Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Fetch Books
        const booksRes = await fetch(`${API_BASE_URL}/books`);
        if (booksRes.ok) {
          const data = await booksRes.json();
          const formattedData = data.map((b: any) => ({ ...b, id: b._id || b.id }));
          setBooks(formattedData);
        }

        // Fetch Events
        const eventsRes = await fetch(`${API_BASE_URL}/events`);
        if (eventsRes.ok) {
            const data = await eventsRes.json();
            const formattedEvents = data.map((e: any) => ({ ...e, id: e._id || e.id }));
            if (formattedEvents.length > 0) {
                setEvents(prev => {
                    // Merge remote events with initial "OT Challenge" hardcoded event if needed
                    const hasOt = formattedEvents.find((e:Event) => e.id === 'ot-2026');
                    return hasOt ? formattedEvents : [...formattedEvents, INITIAL_EVENTS[0]];
                });
            }
        }
      } catch (error) {
        console.log('Backend not connected, using local data');
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
    setEvents(prev => [item, ...prev]);
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
            body: JSON.stringify(item)
        });
    } catch (e) { console.error("API Error", e); }
  };
  
  const updateEvent = async (item: Event) => {
    setEvents(prev => prev.map(i => i.id === item.id ? item : i));
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/events/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
            body: JSON.stringify(item)
        });
    } catch (e) { console.error("API Error", e); }
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(i => i.id !== id));
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token || '' }
        });
    } catch (e) { console.error("API Error", e); }
  };

  const addArticle = (item: Article) => setArticles(prev => [item, ...prev]);
  const updateArticle = (item: Article) => setArticles(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteArticle = (id: string) => setArticles(prev => prev.filter(i => i.id !== id));

  const addGalleryItem = (item: GalleryItem) => setGalleryItems(prev => [item, ...prev]);
  const deleteGalleryItem = (id: string) => setGalleryItems(prev => prev.filter(i => i.id !== id));

  // Book Actions with API Sync
  const addBook = async (item: Book) => {
    setBooks(prev => [item, ...prev]);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token || '' 
        },
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.error("Failed to save book to backend", err);
    }
  };

  const updateBook = async (item: Book) => {
    setBooks(prev => prev.map(i => i.id === item.id ? item : i));
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/books/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token || '' 
        },
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.error("Failed to update book", err);
    }
  };

  const deleteBook = async (id: string) => {
    setBooks(prev => prev.filter(i => i.id !== id));
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '' }
      });
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  return (
    <DataContext.Provider value={{
      sermons, events, articles, galleryItems, books,
      addSermon, updateSermon, deleteSermon,
      addEvent, updateEvent, deleteEvent,
      addArticle, updateArticle, deleteArticle,
      addGalleryItem, deleteGalleryItem,
      addBook, updateBook, deleteBook
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
