import { Redis } from '@upstash/redis';

// Use Upstash Redis for serverless environments (Vercel compatible)
// For development, we'll use a fallback that doesn't break the build
let redis: Redis;

try {
  const url = process.env.REDIS_URL || 'https://fake-redis-url.upstash.io';
  const token = process.env.REDIS_TOKEN || 'fake-token';
  
  // Only create Redis instance if we have proper Upstash URL
  if (url.startsWith('https://')) {
    redis = new Redis({ url, token });
  } else {
    // For local development, create a mock Redis instance
    redis = {
      set: async () => 'OK',
      get: async () => null,
      sadd: async () => 1,
      smembers: async () => [],
      srem: async () => 1,
      scard: async () => 0,
      del: async () => 1,
      ping: async () => 'PONG',
    } as any;
  }
} catch (error) {
  console.warn('Redis initialization failed, using mock instance:', error);
  // Mock Redis instance for development/build
  redis = {
    set: async () => 'OK',
    get: async () => null,
    sadd: async () => 1,
    smembers: async () => [],
    srem: async () => 1,
    scard: async () => 0,
    del: async () => 1,
    ping: async () => 'PONG',
  } as any;
}

export interface BlogPost {
  id: string;
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string; // ISO date string
  views?: number;
}

export interface MediaFile {
  id: string;
  fileName: string;
  fileId: string; // ImageKit file ID
  url: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'video';
  size: number;
  uploadedBy: string; // Clerk user ID
  uploadedAt: string; // ISO date string
  postId?: string; // Reference to blog post
}

export interface Author {
  id: string;
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Redis key patterns
const KEYS = {
  posts: 'posts',
  post: (id: string) => `post:${id}`,
  postBySlug: (slug: string) => `post:slug:${slug}`,
  media: 'media',
  mediaFile: (id: string) => `media:${id}`,
  authors: 'authors',
  author: (id: string) => `author:${id}`,
  authorByClerkId: (clerkId: string) => `author:clerk:${clerkId}`,
  counters: 'counters',
};

// Blog Posts
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const blogPost: BlogPost = {
    ...post,
    id,
    createdAt: now,
    updatedAt: now,
    publishedAt: post.published ? now : undefined,
  };

  // Store individual post
  await redis.set(KEYS.post(id), blogPost);
  
  // Store slug mapping
  await redis.set(KEYS.postBySlug(post.slug), id);
  
  // Add to posts set
  await redis.sadd(KEYS.posts, id);
  
  return blogPost;
}

export async function getBlogPosts(options: {
  published?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<BlogPost[]> {
  const postIds = await redis.smembers(KEYS.posts);
  
  if (!postIds.length) return [];
  
  const posts = await Promise.all(
    postIds.map(id => redis.get<BlogPost>(KEYS.post(id)))
  );
  
  let filteredPosts = posts.filter((post): post is BlogPost => post !== null);
  
  // Apply filters
  if (options.published !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.published === options.published);
  }
  
  if (options.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.featured === options.featured);
  }
  
  // Sort by publishedAt (most recent first), then by createdAt
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt);
    const dateB = new Date(b.publishedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply pagination
  const start = options.offset || 0;
  const end = options.limit ? start + options.limit : undefined;
  
  return filteredPosts.slice(start, end);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return await redis.get<BlogPost>(KEYS.post(id));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const postId = await redis.get<string>(KEYS.postBySlug(slug));
  if (!postId) return null;
  
  return await getBlogPostById(postId);
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const existingPost = await getBlogPostById(id);
  if (!existingPost) return null;
  
  const updatedPost: BlogPost = {
    ...existingPost,
    ...updates,
    updatedAt: new Date().toISOString(),
    publishedAt: updates.published && !existingPost.published ? new Date().toISOString() : existingPost.publishedAt,
  };
  
  // Update slug mapping if slug changed
  if (updates.slug && updates.slug !== existingPost.slug) {
    await redis.del(KEYS.postBySlug(existingPost.slug));
    await redis.set(KEYS.postBySlug(updates.slug), id);
  }
  
  await redis.set(KEYS.post(id), updatedPost);
  return updatedPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const post = await getBlogPostById(id);
  if (!post) return false;
  
  // Remove from sets and mappings
  await redis.srem(KEYS.posts, id);
  await redis.del(KEYS.post(id));
  await redis.del(KEYS.postBySlug(post.slug));
  
  return true;
}

// Media Files
export async function createMediaFile(media: Omit<MediaFile, 'id' | 'uploadedAt'>): Promise<MediaFile> {
  const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const mediaFile: MediaFile = {
    ...media,
    id,
    uploadedAt: now,
  };

  await redis.set(KEYS.mediaFile(id), mediaFile);
  await redis.sadd(KEYS.media, id);
  
  return mediaFile;
}

export async function getMediaFiles(limit?: number, offset?: number): Promise<MediaFile[]> {
  const mediaIds = await redis.smembers(KEYS.media);
  
  if (!mediaIds.length) return [];
  
  const mediaFiles = await Promise.all(
    mediaIds.map(id => redis.get<MediaFile>(KEYS.mediaFile(id)))
  );
  
  let filteredMedia = mediaFiles.filter((media): media is MediaFile => media !== null);
  
  // Sort by uploadedAt (most recent first)
  filteredMedia.sort((a, b) => {
    const dateA = new Date(a.uploadedAt);
    const dateB = new Date(b.uploadedAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply pagination
  const start = offset || 0;
  const end = limit ? start + limit : undefined;
  
  return filteredMedia.slice(start, end);
}

export async function getMediaFileById(id: string): Promise<MediaFile | null> {
  return await redis.get<MediaFile>(KEYS.mediaFile(id));
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  const mediaExists = await redis.get(KEYS.mediaFile(id));
  if (!mediaExists) return false;
  
  await redis.srem(KEYS.media, id);
  await redis.del(KEYS.mediaFile(id));
  
  return true;
}

// Authors
export async function createAuthor(author: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>): Promise<Author> {
  const id = `author_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const authorData: Author = {
    ...author,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await redis.set(KEYS.author(id), authorData);
  await redis.set(KEYS.authorByClerkId(author.clerkId), id);
  await redis.sadd(KEYS.authors, id);
  
  return authorData;
}

export async function getAuthorByClerkId(clerkId: string): Promise<Author | null> {
  const authorId = await redis.get<string>(KEYS.authorByClerkId(clerkId));
  if (!authorId) return null;
  
  return await redis.get<Author>(KEYS.author(authorId));
}

export async function updateAuthor(id: string, updates: Partial<Author>): Promise<Author | null> {
  const existingAuthor = await redis.get<Author>(KEYS.author(id));
  if (!existingAuthor) return null;
  
  const updatedAuthor: Author = {
    ...existingAuthor,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await redis.set(KEYS.author(id), updatedAuthor);
  return updatedAuthor;
}

// Analytics/Counters
export async function incrementPostViews(postId: string): Promise<number> {
  const post = await getBlogPostById(postId);
  if (!post) return 0;
  
  const newViews = (post.views || 0) + 1;
  await updateBlogPost(postId, { views: newViews });
  
  return newViews;
}

export async function getAnalytics() {
  const [totalPosts, featuredPosts, publishedPosts, drafts, totalMedia] = await Promise.all([
    redis.scard(KEYS.posts),
    getBlogPosts({ published: true }).then(posts => posts.length),
    getBlogPosts({ published: true }).then(posts => posts.length),
    getBlogPosts({ published: false }).then(posts => posts.length),
    redis.scard(KEYS.media),
  ]);

  return {
    totalPosts,
    featuredPosts,
    publishedPosts,
    drafts,
    totalMedia,
  };
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

export { redis };