import type { APIRoute } from 'astro';
import { uploadFile, deleteFile } from '../../lib/imagekit';
import { createMediaFile, getMediaFiles, deleteMediaFile, getMediaFileById } from '../../lib/redis';
import { authenticateRequest } from '../../lib/auth';

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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'No file provided' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM) are allowed.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'File size too large. Maximum size is 10MB.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to ImageKit
    const uploadResult = await uploadFile(buffer, file.name, 'blog/uploads');

    // Save media record to Redis
    const mediaRecord = await createMediaFile({
      fileName: uploadResult.name,
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      fileType: file.type.startsWith('image/') ? 'image' : 'video',
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
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to upload file' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Media ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get media record from Redis
    const mediaRecord = await getMediaFileById(id);
    if (!mediaRecord) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Media file not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user owns the media file (or is admin)
    if (mediaRecord.uploadedBy !== auth.userId) {
      // TODO: Add admin check when needed
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Forbidden' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Delete from ImageKit
      await deleteFile(mediaRecord.fileId);
    } catch (error) {
      console.error('Error deleting file from ImageKit:', error);
      // Continue with database deletion even if ImageKit deletion fails
    }

    // Delete from Redis
    const deleted = await deleteMediaFile(id);
    if (!deleted) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to delete media record' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Media file deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to delete media file' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ request }) => {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth.success || !auth.userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: auth.error || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const searchParams = new URL(request.url).searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get media files from Redis
    const mediaFiles = await getMediaFiles(limit, offset);

    return new Response(JSON.stringify({
      success: true,
      data: mediaFiles
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch media files' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};