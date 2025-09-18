import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
	const {
		page = 1,
		limit = 10,
		query,
		sortBy,
		sortType,
		userId,
	} = req.query;
	//TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	// TODO: get video, upload to cloudinary, create video
	if (!title && !description) {
		throw new ApiError(400, "Title or description is missing");
	}

	const userId = req.user?._id;

	if (!userId) {
		throw new ApiError(400, "User not Authenticated");
	}

	try {
		const videoLocalPath = req.files?.videoFile[0]?.path;
		const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

		if (!videoLocalPath || !thumbnailLocalPath) {
			throw new ApiError(
				400,
				"Cant find Local Files of video or thumbnail"
			);
		}

		const uploadedVideoFile = await uploadOnCloudinary(
			videoLocalPath
		);
		const uploadedThumbnail = await uploadOnCloudinary(
			thumbnailLocalPath
		);

		if (!uploadedVideoFile) {
			throw new ApiError(
				400,
				"Error while uploading video on cloudinary"
			);
		}

		if (!uploadedThumbnail) {
			throw new ApiError(
				400,
				"Error while uploading thumbnail on cloudinary"
			);
		}

		const video = await Video.create({
			videoFile: uploadedVideoFile.secure_url,
			thumbnail: uploadedThumbnail.secure_url,
			title,
			description,
			duration: uploadedVideoFile.duration,
			owner: userId,
		});

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					video,
					"Video published successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while publishing a video");
	}
});

const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
});

export {
	getAllVideos,
	publishAVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
};
