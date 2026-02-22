
export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  passage: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  duration?: string;
  category: 'Full Service' | 'Nugget' | 'Series';
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Worship' | 'Community' | 'Outreach' | 'Youth' | 'Program';
  capacity?: number;
  isRegistered?: boolean;
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // For videos
  title: string;
  date: string;
  category: 'Service' | 'Event' | 'Reel' | 'Story';
  likes?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  downloadUrl?: string; // The resource link revealed after payment
  isPurchased?: boolean; // Client-side state
}

export type MemberRole = 'Pastor' | 'Leader' | 'Member' | 'Partner';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  memberSince: string;
  role: MemberRole;
  parish?: string;
  residentPastor?: string;
  position?: string;
  isBibleStudent?: boolean;
  campus?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  spiritualInfo?: {
    isBaptized: boolean;
    ministryInterests: string[];
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'Tithe' | 'Offering' | 'Bookstore' | 'Event' | 'Cafe';
}

export interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  priority: 'normal' | 'high';
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  aiReflection?: string;
}

export interface Lesson {
  id: string;
  title: string;
  module: 'Foundation' | 'Believers' | 'Advanced';
  duration: string;
  audioUrl?: string;
  content: string;
  author: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: MemberRole;
  title: string;
  content: string;
  replies: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Bible Study Mode Types
export interface Comment {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedBy: string[];
  commentList?: Comment[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export type BibleTranslation = 'kjv' | 'web' | 'webbe' | 'oeb-us' | 'almeida' | 'rccv';

export interface CommentaryEntry {
  author: string;
  text: string;
  reference: string;
}

// Old Testament Challenge Types
export interface OTReadingDay {
  day: number;
  week: number;
  month: number;
  passages: string;
  description?: string;
}

export interface OTComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  day: number;
}
