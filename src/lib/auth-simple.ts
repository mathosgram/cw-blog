import type { APIRoute } from 'astro';

// Simple auth check for static mode
export function createSimpleAuthHandler() {
  return async (request: Request): Promise<{
    success: boolean;
    error: string | null;
    userId: string | null;
  }> => {
    try {
      // In static mode, we'll use a simple approach
      // Check for authorization header or cookie
      const authHeader = request.headers.get('Authorization');
      const sessionCookie = request.headers.get('Cookie')?.includes('__session');
      
      // For now, allow requests with any authorization or session
      if (authHeader || sessionCookie) {
        return {
          success: true,
          error: null,
          userId: 'static-user-id'
        };
      }
      
      return {
        success: false,
        error: 'No authorization found',
        userId: null
      };
    } catch (error) {
      console.error('Simple auth error:', error);
      return {
        success: false,
        error: 'Authentication failed',
        userId: null
      };
    }
  };
}

export const simpleAuth = createSimpleAuthHandler();