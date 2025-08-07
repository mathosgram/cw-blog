import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_placeholder',
});

export async function authenticateRequest(request: Request): Promise<{
  success: boolean;
  error: string | null;
  userId: string | null;
}> {
  try {
    const authResult = await clerkClient.authenticateRequest(request);
    
    if (!authResult.isAuthenticated) {
      return {
        success: false,
        error: 'Unauthorized',
        userId: null
      };
    }

    // Get the auth object to access user ID
    const auth = authResult.toAuth();
    
    if (!auth.userId) {
      return {
        success: false,
        error: 'No user ID found',
        userId: null
      };
    }
    
    return {
      success: true,
      error: null,
      userId: auth.userId
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      userId: null
    };
  }
}

export { clerkClient };