import type { APIRoute } from 'astro';
import { uploadFile, deleteFile } from '../../lib/imagekit';
import { getMediaCollection, getAuthorsCollection, type MediaFile } from '../../lib/db';
import { authenticateRequest } from '../../lib/auth';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string;
    
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

    // Save media record to database
    const mediaCollection = await getMediaCollection();
    const mediaRecord: Omit<MediaFile, '_id'> = {
      fileName: uploadResult.name,
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      fileType: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      uploadedBy: auth.userId!,
      uploadedAt: new Date(),
      postId: postId || undefined,
    };

    const result = await mediaCollection.insertOne(mediaRecord);

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        id: result.insertedId,
        ...mediaRecord,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to upload file' 
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
        error: 'Media ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const mediaCollection = await getMediaCollection();
    
    // Get media record
    const mediaRecord = await mediaCollection.findOne({ _id: id });
    if (!mediaRecord) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Media not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user owns the media or is admin
    if (mediaRecord.uploadedBy !== auth.userId) {
      // Check if user is admin
      const authorsCollection = await getAuthorsCollection();
      const author = await authorsCollection.findOne({ clerkId: auth.userId! });
      
      if (author?.role !== 'admin') {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Unauthorized to delete this media' 
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Delete from ImageKit
    await deleteFile(mediaRecord.fileId);

    // Delete from database
    await mediaCollection.deleteOne({ _id: id });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Media deleted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to delete media' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

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

    const searchParams = new URL(request.url).searchParams;
    const postId = searchParams.get('postId');
    const fileType = searchParams.get('fileType') as 'image' | 'video' | undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const mediaCollection = await getMediaCollection();
    
    // Build query
    const query: any = {};
    if (postId) {
      query.postId = postId;
    }
    if (fileType) {
      query.fileType = fileType;
    }

    // Get media files with pagination
    const mediaFiles = await mediaCollection
      .find(query)
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await mediaCollection.countDocuments(query);

    return new Response(JSON.stringify({
      success: true,
      data: {
        media: mediaFiles,
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
    console.error('Error fetching media:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch media' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};