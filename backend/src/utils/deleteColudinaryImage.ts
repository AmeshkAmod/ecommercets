import cloudinary from "../config/cloudinary.js";

export const deleteCloudinaryImage = async (url: string) => {
    const parts = url.split("/");
    const file = parts[parts.length -1];

    const publicId = "products/" + file?.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
}