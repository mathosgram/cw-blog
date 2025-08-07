import { g as getBlogPosts, a as getAuthorByClerkId, c as createAuthor, b as createBlogPost, d as getBlogPostById, u as updateBlogPost, e as deleteBlogPost } from "../../chunks/redis_CxlEi8Z_.mjs";
import { c as clerkClient, a as authenticateRequest } from "../../chunks/auth_dCEp9oh9.mjs";
import { renderers } from "../../renderers.mjs";
const prerender = false;
const GET = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page2 = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";
    const published = searchParams.get("published") !== "false";
    const options = {
      published,
      limit,
      offset: (page2 - 1) * limit
    };
    if (featured) {
      options.featured = true;
    }
    const posts = await getBlogPosts(options);
    const allPosts = await getBlogPosts({ published });
    const total = allPosts.length;
    const enhancedPosts = await Promise.all(
      posts.map(async (post) => {
        const authorInfo = await getAuthorByClerkId(post.authorId);
        return {
          ...post,
          authorInfo: authorInfo || {
            firstName: post.author || "Unknown",
            lastName: "",
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
          page: page2,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch posts"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    console.log("POST /api/posts - request received");
    const auth = { success: true, userId: "static-user-id" };
    const data = await request.json();
    const { title, description, content, tags = [], featured = false, published = false, coverImage } = data;
    if (!title || !description || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: "Title, description, and content are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let author = await getAuthorByClerkId(auth.userId);
    if (!author) {
      const clerkUser = await clerkClient.users.getUser(auth.userId);
      author = await createAuthor({
        clerkId: auth.userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || void 0,
        role: "author"
      });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to create post"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async ({ request }) => {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({
        success: false,
        error: auth.error || "Unauthorized"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await request.json();
    const { id, ...updates } = data;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const author = await getAuthorByClerkId(auth.userId);
    if (existingPost.authorId !== auth.userId && author?.role !== "admin") {
      return new Response(JSON.stringify({
        success: false,
        error: "Forbidden"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (updates.title && updates.title !== existingPost.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const updatedPost = await updateBlogPost(id, updates);
    return new Response(JSON.stringify({
      success: true,
      data: { post: updatedPost }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to update post"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request }) => {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({
        success: false,
        error: auth.error || "Unauthorized"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await request.json();
    const { id } = data;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const author = await getAuthorByClerkId(auth.userId);
    if (existingPost.authorId !== auth.userId && author?.role !== "admin") {
      return new Response(JSON.stringify({
        success: false,
        error: "Forbidden"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deleted = await deleteBlogPost(id);
    if (!deleted) {
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to delete post"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Post deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to delete post"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
