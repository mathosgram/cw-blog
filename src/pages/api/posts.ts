import type { APIRoute } from 'astro';
import { 
  getBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  getBlogPostById,
  getAuthorByClerkId,
  createAuthor
} from '../../lib/redis';
import { authenticateRequest, clerkClient } from '../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';
    const published = searchParams.get('published') !== 'false'; // Default to published only
    
    // Build options for Redis query
    const options: any = { 
      published,
      limit,
      offset: (page - 1) * limit
    };
    if (featured) {
      options.featured = true;
    }
    
    // Get posts from Redis
    const posts = await getBlogPosts(options);
    
    // Get all posts count for pagination (simplified approach)
    const allPosts = await getBlogPosts({ published });
    const total = allPosts.length;
    
    // Get author details for posts
    const enhancedPosts = await Promise.all(
      posts.map(async (post) => {
        const authorInfo = await getAuthorByClerkId(post.authorId);
        return {
          ...post,
          authorInfo: authorInfo || {
            firstName: post.author || 'Unknown',
            lastName: '',
            imageUrl: null
          }
        };
      })
    );

    return new Response(JSON.stringify({
      success: true,
      data: {
        posts: enhancedPosts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch posts' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: auth.error || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { title, description, content, tags = [], featured = false, published = false, coverImage } = data;

    if (!title || !description || !content) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Title, description, and content are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get or create author
    let author = await getAuthorByClerkId(auth.userId);
    if (!author) {
      // Create author from Clerk user info
      const clerkUser = await clerkClient.users.getUser(auth.userId);
      author = await createAuthor({
        clerkId: auth.userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || undefined,
        role: 'author'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create the blog post
    const post = await createBlogPost({
      title,
      description,
      content,
      author: `${author.firstName} ${author.lastName}`.trim() || author.email,
      authorId: auth.userId,
      tags: Array.isArray(tags) ? tags : [],
      featured,
      published,
      slug,
      coverImage,
      images: [],
      videos: [],
      views: 0
    });

    return new Response(JSON.stringify({
      success: true,
      data: { post }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to create post' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: auth.error || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Post ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get existing post
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Post not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user owns the post or is admin
    const author = await getAuthorByClerkId(auth.userId);
    if (existingPost.authorId !== auth.userId && author?.role !== 'admin') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Forbidden' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update slug if title changed
    if (updates.title && updates.title !== existingPost.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Update the post
    const updatedPost = await updateBlogPost(id, updates);

    return new Response(JSON.stringify({
      success: true,
      data: { post: updatedPost }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update post' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: auth.error || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Post ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get existing post
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Post not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user owns the post or is admin
    const author = await getAuthorByClerkId(auth.userId);
    if (existingPost.authorId !== auth.userId && author?.role !== 'admin') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Forbidden' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the post
    const deleted = await deleteBlogPost(id);

    if (!deleted) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to delete post' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Post deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to delete post' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};