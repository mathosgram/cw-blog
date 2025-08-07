import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_placeholder',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_placeholder',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/placeholder',
});

export interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  fileType: string;
  tags: string[];
}

export interface AuthParams {
  token: string;
  expire: number;
  signature: string;
}

// Generate authentication parameters for client-side uploads
export function getAuthenticationParameters(): AuthParams {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return {
    token: authenticationParameters.token,
    expire: authenticationParameters.expire,
    signature: authenticationParameters.signature,
  };
}

// Upload file from server side (for API uploads)
export async function uploadFile(
  file: Buffer,
  fileName: string,
  folder: string = 'blog'
): Promise<UploadResponse> {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      tags: ['blog', 'stack'],
    });

    return {
      fileId: response.fileId,
      name: response.name,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl || response.url,
      size: response.size,
      fileType: response.fileType,
      tags: response.tags || [],
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload file to ImageKit');
  }
}

// Delete file
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete file from ImageKit');
  }
}

// Generate optimized URL
export function generateOptimizedUrl(
  url: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  } = {}
): string {
  const params = [];
  
  if (transformations.width) params.push(`w-${transformations.width}`);
  if (transformations.height) params.push(`h-${transformations.height}`);
  if (transformations.quality) params.push(`q-${transformations.quality}`);
  if (transformations.format) params.push(`f-${transformations.format}`);
  if (transformations.crop) params.push(`c-${transformations.crop}`);
  
  if (params.length === 0) return url;
  
  // Insert transformations into ImageKit URL
  const transformationString = `tr:${params.join(',')}`;
  return url.replace('/tr:', `/${transformationString},tr:`).replace(/([^/]+)$/, `${transformationString}/$1`);
}

// Get file details
export async function getFileDetails(fileId: string) {
  try {
    const fileDetails = await imagekit.getFileDetails(fileId);
    return fileDetails;
  } catch (error) {
    console.error('ImageKit file details error:', error);
    throw new Error('Failed to get file details from ImageKit');
  }
}

// List files in a folder
export async function listFiles(
  folder: string = 'blog',
  limit: number = 50,
  skip: number = 0
) {
  try {
    const files = await imagekit.listFiles({
      path: folder,
      limit: limit,
      skip: skip,
    });
    return files;
  } catch (error) {
    console.error('ImageKit list files error:', error);
    throw new Error('Failed to list files from ImageKit');
  }
}

export default imagekit;