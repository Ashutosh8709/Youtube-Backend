import { Video } from "../models/video.model.js";
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
	if (!videoId) {
		throw new ApiError(400, "Video Id not found");
	}

	try {
		const video = await Video.findById(videoId);
		if (!video) {
			throw new ApiError(400, "Video not found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					video,
					"Video found Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(500, "Error while fetching video By Id");
	}
});

const updateVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: update video details like title, description, thumbnail

	const { title, description } = req.body;
	if (!videoId) {
		throw new ApiError(400, "Video Id not found");
	}

	if (!title || !description) {
		throw new ApiError(400, "Didn't got data for updating");
	}

	try {
		const thumbnailLocalPath = req.file?.path;
		if (!thumbnailLocalPath) {
			throw new ApiError(400, "Thumbnail file not found");
		}

		const updatedThumbnail = await uploadOnCloudinary(
			thumbnailLocalPath
		);

		if (!updatedThumbnail) {
			throw new ApiError(
				400,
				"Error while uploading thumbnail"
			);
		}
		const video = await Video.findByIdAndUpdate(videoId, {
			title,
			description,
			thumbnail: updatedThumbnail.secure_url,
		});

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					video,
					"Video updated successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while upadating video details");
	}
});

const deleteVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: delete video
	if (!videoId) {
		throw new ApiError(400, "Video id not found");
	}
	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(404, "User not found");
	}

	try {
		const deletedVideo = await Video.findOneAndDelete({
			_id: videoId,
			owner: userId,
		});

		if (!existingVideo) {
			throw new ApiError(
				"Either user is not allowed to delete this or the video doesnt exist"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedVideo,
					"Video deleted Successfully"
				)
			);
	} catch (err) {
		throw new ApiError(400, "Error while deleting video");
	}
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	if (!videoId) {
		throw new ApiError(400, "Video Id Not Found");
	}

	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(404, "User id not found");
	}

	try {
		const updatedVideo = await Video.findOneAndUpdate(
			{ _id: videoId, owner: userId },
			{ $set: { isPublished: { xor: 1 } } },
			{ new: true }
		);

		if (!updatedVideo) {
			throw new ApiError(
				"Either user is not owner or video not found"
			);
		}
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedVideo,
					"Publish status Changed Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while toggling publish status");
	}
});

export {
	getAllVideos,
	publishAVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
};
