import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: toggle like on video
	if (!videoId) {
		throw new ApiError(400, "Video Id not found");
	}

	const userId = req.user?._id;

	if (!userId) {
		return new ApiError(401, "User not found");
	}

	try {
		const isVideoLiked = await Like.findOneAndDelete({
			video: videoId,
			likedBy: userId,
		});

		if (isVideoLiked) {
			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						{},
						"Video Unliked"
					)
				);
		}

		const likedVideo = await Like.create({
			video: videoId,
			likedBy: userId,
		});

		if (!likedVideo) {
			throw new ApiError(400, "Error while liking video");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Video Liked Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error occured while liking Video");
	}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	//TODO: toggle like on comment

	if (!commentId) {
		throw new ApiError(401, "Comment Id not found");
	}

	const userId = req.user?._id;

	if (!userId) {
		throw new ApiError(402, "User Id not Found");
	}

	try {
		const isCommentLiked = await Like.findOneAndDelete({
			comment: commentId,
			likedBy: userId,
		});

		if (isCommentLiked) {
			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						{},
						"Unliked the comment"
					)
				);
		}

		const likedComment = await Like.create({
			comment: commentId,
			likedBy: userId,
		});

		if (!likedComment) {
			throw new ApiError(400, "Error while liking comment");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Comment Liked Successfully"
				)
			);
	} catch (err) {
		throw new ApiError(400, err.message);
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	//TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
	//TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
