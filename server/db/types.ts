export interface Database {
  getPosts: () => Promise<any[]>;
  getPost: (id: string) => Promise<any | null>;
  createPost: (post: any) => Promise<any>;
  updatePost: (id: string, post: any) => Promise<any>;
  getEvents: () => Promise<any[]>;
  createEvent: (event: any) => Promise<any>;
  updateEvent: (id: string, event: any) => Promise<any>;
  deleteEvent: (id: string) => Promise<void>;
  getBooks: () => Promise<any[]>;
  createBook: (book: any) => Promise<any>;
  updateBook: (id: string, book: any) => Promise<any>;
  deleteBook: (id: string) => Promise<void>;
  getMessages: () => Promise<any[]>;
  createMessage: (message: any) => Promise<any>;
  getUsers: () => Promise<any[]>;
}
