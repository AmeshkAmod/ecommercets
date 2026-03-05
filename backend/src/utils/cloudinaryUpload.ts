import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer: Buffer) => {
    return new Promise<string>((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: "products",
                transformation: [
                    {
                        width: 800,
                        height: 800,
                        crop: "limit"
                    },
                    {
                        quality: "auto"
                    },
                    {
                        fetch_format: "auto"
                    }
                ]
             },
            (error, result) => {
                if (error || !result) 
                    return reject(error);
                resolve(result.secure_url);
            }
        );

        stream.end(buffer);
    });
};