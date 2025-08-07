import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_placeholder",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_placeholder",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/placeholder"
});
function getAuthenticationParameters() {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return {
    token: authenticationParameters.token,
    expire: authenticationParameters.expire,
    signature: authenticationParameters.signature
  };
}
async function uploadFile(file, fileName, folder = "blog") {
  try {
    const response = await imagekit.upload({
      file,
      fileName,
      folder,
      useUniqueFileName: true,
      tags: ["blog", "stack"]
    });
    return {
      fileId: response.fileId,
      name: response.name,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl || response.url,
      size: response.size,
      fileType: response.fileType,
      tags: response.tags || []
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload file to ImageKit");
  }
}
async function deleteFile(fileId) {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw new Error("Failed to delete file from ImageKit");
  }
}
export {
  deleteFile as d,
  getAuthenticationParameters as g,
  uploadFile as u
};
