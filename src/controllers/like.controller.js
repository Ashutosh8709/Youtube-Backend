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
		throw new ApiError(500, "Error occured while liking Video");
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
		throw new ApiError(500, "Error occured while liking commnent");
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	//TODO: toggle like on tweet
	const userId = req.user?._id;

	if (!tweetId) {
		throw new ApiError(400, "Tweet Id not found");
	}

	if (!userId) {
		throw new ApiError(401, "User not Authorized");
	}

	try {
		const isTweetLiked = await Like.findOneAndDelete({
			tweet: tweetId,
			likedBy: userId,
		});

		if (isTweetLiked) {
			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						{},
						"Tweet unliked"
					)
				);
		}

		const likeTweet = await Like.create({
			tweet: tweetId,
			likedBy: userId,
		});

		if (!likeTweet) {
			throw new ApiError(400, "Error while liking tweet");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Tweet Like successfully"
				)
			);
	} catch (error) {
		throw new ApiError(500, "Error occured while liking tweet");
	}
});

const getLikedVideos = asyncHandler(async (req, res) => {
	//TODO: get all liked videos (work left)
	// take user id
	// select all videos where like by is this user
	// use match and lookup aggregate for take video file name from video schema
	// now return everything
	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(401, "User not found");
	}

	try {
		const likedVideos = await Like.aggregate([
			{
				$match: {
					likedBy: userId,
					video: { $ne: null },
				},
			},
			{
				$lookup: {
					from: "videos",
					localField: "video",
					foreignField: "_id",
					as: "likedVideos",
				},
			},
			{
				$project: {
					VideoFile: {
						$arrayElemAt: [
							"$likedVideos.videoFile",
							0,
						],
					},
					thumbnail: {
						$arrayElemAt: [
							"$likedVideos.thumbnail",
							0,
						],
					},
					title: {
						$arrayElemAt: [
							"$likedVideos.title",
							0,
						],
					},
					description: {
						$arrayElemAt: [
							"$likedVideos.description",
							0,
						],
					},
					duration: {
						$arrayElemAt: [
							"$likedVideos.duration",
							0,
						],
					},
					views: {
						$arrayElemAt: [
							"$likedVideos.views",
							0,
						],
					},
				},
			},
		]);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					likedVideos,
					"LIked videos fetched successfully"
				)
			);
	} catch (error) {
		throw new ApiError(500, error.message);
	}
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
