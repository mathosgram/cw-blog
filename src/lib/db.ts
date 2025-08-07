import { MongoClient, Db, Collection, type Document } from 'mongodb';

let client: MongoClient;
let db: Db;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stack-blog';
const DB_NAME = 'stack-blog';

export interface BlogPost {
  _id?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorId: string; // Clerk user ID
  tags: string[];
  featured: boolean;
  published: boolean;
  slug: string;
  coverImage?: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views?: number;
}

export interface MediaFile {
  _id?: string;
  fileName: string;
  fileId: string; // ImageKit file ID
  url: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'video';
  size: number;
  uploadedBy: string; // Clerk user ID
  uploadedAt: Date;
  postId?: string; // Reference to blog post
}

export interface Author {
  _id?: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'admin' | 'author' | 'editor';
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
}

// Collection getters
export const getBlogPostsCollection = () => getCollection<BlogPost>('posts');
export const getMediaCollection = () => getCollection<MediaFile>('media');
export const getAuthorsCollection = () => getCollection<Author>('authors');

// Utility functions
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Initialize indexes
export async function initializeIndexes(): Promise<void> {
  const database = await connectToDatabase();
  
  // Posts indexes
  const postsCollection = database.collection('posts');
  await postsCollection.createIndex({ slug: 1 }, { unique: true });
  await postsCollection.createIndex({ published: 1, publishedAt: -1 });
  await postsCollection.createIndex({ featured: 1, publishedAt: -1 });
  await postsCollection.createIndex({ tags: 1 });
  await postsCollection.createIndex({ authorId: 1 });
  
  // Authors indexes
  const authorsCollection = database.collection('authors');
  await authorsCollection.createIndex({ clerkId: 1 }, { unique: true });
  await authorsCollection.createIndex({ email: 1 }, { unique: true });
  
  // Media indexes
  const mediaCollection = database.collection('media');
  await mediaCollection.createIndex({ uploadedBy: 1 });
  await mediaCollection.createIndex({ postId: 1 });
  await mediaCollection.createIndex({ fileId: 1 }, { unique: true });
  
  console.log('Database indexes initialized');
}