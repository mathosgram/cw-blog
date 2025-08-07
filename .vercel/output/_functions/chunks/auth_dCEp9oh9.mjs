import { createClerkClient } from "@clerk/backend";
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "sk_test_placeholder"
});
async function authenticateRequest(request) {
  try {
    const authResult = await clerkClient.authenticateRequest(request);
    if (!authResult.isAuthenticated) {
      return {
        success: false,
        error: "Unauthorized",
        userId: null
      };
    }
    const auth = authResult.toAuth();
    if (!auth.userId) {
      return {
        success: false,
        error: "No user ID found",
        userId: null
      };
    }
    return {
      success: true,
      error: null,
      userId: auth.userId
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "Authentication failed",
      userId: null
    };
  }
}
export {
  authenticateRequest as a,
  clerkClient as c
};
