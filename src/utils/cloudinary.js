import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const getCloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	return cloudinary;
};

const uploadOnCloudinary = async (localFilePath) => {
	const cloud = getCloudinary();
	try {
		if (!localFilePath) return null;
		const response = await cloud.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		// console.log("file is uploaded to the  cloudinary", response.secure_url);
		fs.unlinkSync(localFilePath); // remove the locally saved file
		return response;
	} catch (error) {
		console.error("❌ Cloudinary upload failed:", error); // full log
		fs.unlinkSync(localFilePath); // remove the locally saved file
		return null;
	}
};

export { uploadOnCloudinary };
