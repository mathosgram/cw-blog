import { Redis } from "@upstash/redis";
let redis;
try {
  const url = process.env.REDIS_URL || "https://fake-redis-url.upstash.io";
  const token = process.env.REDIS_TOKEN || "fake-token";
  if (url.startsWith("https://")) {
    redis = new Redis({ url, token });
  } else {
    redis = {
      set: async () => "OK",
      get: async () => null,
      sadd: async () => 1,
      smembers: async () => [],
      srem: async () => 1,
      scard: async () => 0,
      del: async () => 1,
      ping: async () => "PONG"
    };
  }
} catch (error) {
  console.warn("Redis initialization failed, using mock instance:", error);
  redis = {
    set: async () => "OK",
    get: async () => null,
    sadd: async () => 1,
    smembers: async () => [],
    srem: async () => 1,
    scard: async () => 0,
    del: async () => 1,
    ping: async () => "PONG"
  };
}
const KEYS = {
  posts: "posts",
  post: (id) => `post:${id}`,
  postBySlug: (slug) => `post:slug:${slug}`,
  media: "media",
  mediaFile: (id) => `media:${id}`,
  authors: "authors",
  author: (id) => `author:${id}`,
  authorByClerkId: (clerkId) => `author:clerk:${clerkId}`,
  counters: "counters"
};
async function createBlogPost(post) {
  const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const blogPost = {
    ...post,
    id,
    createdAt: now,
    updatedAt: now,
    publishedAt: post.published ? now : void 0
  };
  await redis.set(KEYS.post(id), blogPost);
  await redis.set(KEYS.postBySlug(post.slug), id);
  await redis.sadd(KEYS.posts, id);
  return blogPost;
}
async function getBlogPosts(options = {}) {
  const postIds = await redis.smembers(KEYS.posts);
  if (!postIds.length) return [];
  const posts = await Promise.all(
    postIds.map((id) => redis.get(KEYS.post(id)))
  );
  let filteredPosts = posts.filter((post) => post !== null);
  if (options.published !== void 0) {
    filteredPosts = filteredPosts.filter((post) => post.published === options.published);
  }
  if (options.featured !== void 0) {
    filteredPosts = filteredPosts.filter((post) => post.featured === options.featured);
  }
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt);
    const dateB = new Date(b.publishedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  const start = options.offset || 0;
  const end = options.limit ? start + options.limit : void 0;
  return filteredPosts.slice(start, end);
}
async function getBlogPostById(id) {
  return await redis.get(KEYS.post(id));
}
async function updateBlogPost(id, updates) {
  const existingPost = await getBlogPostById(id);
  if (!existingPost) return null;
  const updatedPost = {
    ...existingPost,
    ...updates,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    publishedAt: updates.published && !existingPost.published ? (/* @__PURE__ */ new Date()).toISOString() : existingPost.publishedAt
  };
  if (updates.slug && updates.slug !== existingPost.slug) {
    await redis.del(KEYS.postBySlug(existingPost.slug));
    await redis.set(KEYS.postBySlug(updates.slug), id);
  }
  await redis.set(KEYS.post(id), updatedPost);
  return updatedPost;
}
async function deleteBlogPost(id) {
  const post = await getBlogPostById(id);
  if (!post) return false;
  await redis.srem(KEYS.posts, id);
  await redis.del(KEYS.post(id));
  await redis.del(KEYS.postBySlug(post.slug));
  return true;
}
async function createMediaFile(media) {
  const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const mediaFile = {
    ...media,
    id,
    uploadedAt: now
  };
  await redis.set(KEYS.mediaFile(id), mediaFile);
  await redis.sadd(KEYS.media, id);
  return mediaFile;
}
async function getMediaFiles(limit, offset) {
  const mediaIds = await redis.smembers(KEYS.media);
  if (!mediaIds.length) return [];
  const mediaFiles = await Promise.all(
    mediaIds.map((id) => redis.get(KEYS.mediaFile(id)))
  );
  let filteredMedia = mediaFiles.filter((media) => media !== null);
  filteredMedia.sort((a, b) => {
    const dateA = new Date(a.uploadedAt);
    const dateB = new Date(b.uploadedAt);
    return dateB.getTime() - dateA.getTime();
  });
  const start = offset || 0;
  const end = limit ? start + limit : void 0;
  return filteredMedia.slice(start, end);
}
async function getMediaFileById(id) {
  return await redis.get(KEYS.mediaFile(id));
}
async function deleteMediaFile(id) {
  const mediaExists = await redis.get(KEYS.mediaFile(id));
  if (!mediaExists) return false;
  await redis.srem(KEYS.media, id);
  await redis.del(KEYS.mediaFile(id));
  return true;
}
async function createAuthor(author) {
  const id = `author_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const authorData = {
    ...author,
    id,
    createdAt: now,
    updatedAt: now
  };
  await redis.set(KEYS.author(id), authorData);
  await redis.set(KEYS.authorByClerkId(author.clerkId), id);
  await redis.sadd(KEYS.authors, id);
  return authorData;
}
async function getAuthorByClerkId(clerkId) {
  const authorId = await redis.get(KEYS.authorByClerkId(clerkId));
  if (!authorId) return null;
  return await redis.get(KEYS.author(authorId));
}
export {
  getAuthorByClerkId as a,
  createBlogPost as b,
  createAuthor as c,
  getBlogPostById as d,
  deleteBlogPost as e,
  createMediaFile as f,
  getBlogPosts as g,
  getMediaFileById as h,
  deleteMediaFile as i,
  getMediaFiles as j,
  updateBlogPost as u
};
