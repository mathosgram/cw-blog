import type { APIRoute } from 'astro';
import { getAuthenticationParameters } from '../../lib/imagekit';
import { authenticateRequest } from '../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
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

    // Get ImageKit authentication parameters
    const authParams = getAuthenticationParameters();

    return new Response(JSON.stringify({
      success: true,
      data: authParams
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error generating ImageKit auth:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to generate authentication parameters' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};