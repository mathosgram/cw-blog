import type { APIRoute } from 'astro';
import { getBlogPostsCollection, getAuthorsCollection, type BlogPost } from '../../lib/db';
import { authenticateRequest, clerkClient } from '../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';
    const published = searchParams.get('published') !== 'false'; // Default to published only
    
    const postsCollection = await getBlogPostsCollection();
    
    // Build query
    const query: any = { published };
    if (featured) {
      query.featured = true;
    }
    
    // Get posts with pagination
    const posts = await postsCollection
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await postsCollection.countDocuments(query);
    
    // Get author details for posts
    const authorsCollection = await getAuthorsCollection();
    const authorIds = [...new Set(posts.map(post => post.authorId))];
    const authors = await authorsCollection.find({ clerkId: { $in: authorIds } }).toArray();
    const authorMap = new Map(authors.map(author => [author.clerkId, author]));
    
    // Enhance posts with author information
    const enhancedPosts = posts.map(post => ({
      ...post,
      authorInfo: authorMap.get(post.authorId) || {
        firstName: post.author || 'Unknown',
        lastName: '',
        imageUrl: null
      }
    }));

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
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return new Response(JSON.stringify({ 
        success: false,
        error: auth.error 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { title, description, content, tags, featured, published, coverImage, images, videos } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Title, description, and content are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get user information
    const user = await clerkClient.users.getUser(auth.userId!);
    const authorsCollection = await getAuthorsCollection();
    
    // Ensure user exists in our authors collection
    let author = await authorsCollection.findOne({ clerkId: auth.userId! });
    if (!author) {
      const newAuthor = {
        clerkId: auth.userId!!,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
        role: 'author' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await authorsCollection.insertOne(newAuthor);
      author = { ...newAuthor, _id: result.insertedId.toString() };
    }

    // Create new post
    const postsCollection = await getBlogPostsCollection();
    const newPost: Omit<BlogPost, '_id'> = {
      title,
      description,
      content,
      author: `${author.firstName} ${author.lastName}`.trim() || author.email,
      authorId: auth.userId!,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()) : [],
      featured: Boolean(featured),
      published: Boolean(published),
      slug,
      coverImage,
      images: images || [],
      videos: videos || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: published ? new Date() : undefined,
      views: 0,
    };

    const result = await postsCollection.insertOne(newPost);

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        id: result.insertedId,
        slug,
        message: published ? 'Post published successfully' : 'Post saved as draft'
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to create post' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return new Response(JSON.stringify({ 
        success: false,
        error: auth.error 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id, title, description, content, tags, featured, published, coverImage, images, videos } = body;

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Post ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const postsCollection = await getBlogPostsCollection();
    
    // Check if user owns the post or is admin
    const existingPost = await postsCollection.findOne({ _id: id });
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Post not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check ownership (unless user is admin)
    const authorsCollection = await getAuthorsCollection();
    const author = await authorsCollection.findOne({ clerkId: auth.userId! });
    
    if (existingPost.authorId !== auth.userId && author?.role !== 'admin') {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unauthorized to edit this post' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate new slug if title changed
    const slug = title !== existingPost.title 
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : existingPost.slug;

    // Update post
    const updateData: Partial<BlogPost> = {
      title,
      description,
      content,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()) : [],
      featured: Boolean(featured),
      published: Boolean(published),
      slug,
      coverImage,
      images: images || [],
      videos: videos || [],
      updatedAt: new Date(),
    };

    // If publishing for the first time, set publishedAt
    if (published && !existingPost.published) {
      updateData.publishedAt = new Date();
    }

    await postsCollection.updateOne({ _id: id }, { $set: updateData });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Post updated successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to update post' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return new Response(JSON.stringify({ 
        success: false,
        error: auth.error 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Post ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const postsCollection = await getBlogPostsCollection();
    
    // Check if user owns the post or is admin
    const existingPost = await postsCollection.findOne({ _id: id });
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Post not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check ownership (unless user is admin)
    const authorsCollection = await getAuthorsCollection();
    const author = await authorsCollection.findOne({ clerkId: auth.userId! });
    
    if (existingPost.authorId !== auth.userId && author?.role !== 'admin') {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unauthorized to delete this post' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the post
    await postsCollection.deleteOne({ _id: id });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Post deleted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to delete post' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};