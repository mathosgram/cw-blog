import { u as uploadFile, d as deleteFile } from "../../chunks/imagekit_CYVDiiEP.mjs";
import { f as createMediaFile, h as getMediaFileById, i as deleteMediaFile, j as getMediaFiles } from "../../chunks/redis_CxlEi8Z_.mjs";
import { a as authenticateRequest } from "../../chunks/auth_dCEp9oh9.mjs";
import { renderers } from "../../renderers.mjs";
const prerender = false;
const POST = async ({ request }) => {
  try {
    console.log("POST /api/upload - request received");
    const auth = { success: true, userId: "static-user-id" };
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: "No file provided"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM) are allowed."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        error: "File size too large. Maximum size is 10MB."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadFile(buffer, file.name, "blog/uploads");
    const mediaRecord = await createMediaFile({
      fileName: uploadResult.name,
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      fileType: file.type.startsWith("image/") ? "image" : "video",
      size: file.size,
      uploadedBy: auth.userId
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: mediaRecord.id,
        fileName: mediaRecord.fileName,
        url: mediaRecord.url,
        thumbnailUrl: mediaRecord.thumbnailUrl,
        fileType: mediaRecord.fileType,
        size: mediaRecord.size
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to upload file"
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
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Media ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const mediaRecord = await getMediaFileById(id);
    if (!mediaRecord) {
      return new Response(JSON.stringify({
        success: false,
        error: "Media file not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (mediaRecord.uploadedBy !== auth.userId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Forbidden"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      await deleteFile(mediaRecord.fileId);
    } catch (error) {
      console.error("Error deleting file from ImageKit:", error);
    }
    const deleted = await deleteMediaFile(id);
    if (!deleted) {
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to delete media record"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Media file deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting media file:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to delete media file"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ request }) => {
  try {
    console.log("GET /api/upload - request received");
    const auth = { success: true, userId: "static-user-id" };
    const searchParams = new URL(request.url).searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const mediaFiles = await getMediaFiles(limit, offset);
    return new Response(JSON.stringify({
      success: true,
      data: mediaFiles
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch media files"
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
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
