import type { APIRoute } from 'astro';

interface PublishedPost {
  id: number;
  title: string;
  description: string;
  author: string;
  tags: string;
  content: string;
  featured: boolean;
  publishedDate: string;
  slug: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // In a real application, this would fetch from a database
    // For now, we'll return a simple response that the frontend can use
    const response = {
      posts: [],
      message: "Posts are managed via localStorage on the client side"
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // In a real application, this would save to a database
    // For now, we'll return a success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Post would be saved to database in production' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};