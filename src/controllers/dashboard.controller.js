import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
	// TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
	const userId = req.user?._id;
	try {
		const channelStats = await Video.aggregate([
			{ $match: { owner: userId } },
			{
				$group: {
					_id: "$owner",
					totalViews: {
						$sum: "$views",
					},
					totalVideos: {
						$sum: 1,
					},
				},
			},
			{
				$lookup: {
					from: "subscriptions",
					localField: "_id",
					foreignField: "channel",
					as: "subscribers",
				},
			},
			{
				$addFields: {
					totalSubscribers: {
						$size: "$subscribers",
					},
				},
			},
			{
				$lookup: {
					from: "likes",
					let: { channelId: "$_id" },
					pipeline: [
						{
							$lookup: {
								from: "videos",
								localField: "video",
								foreignField:
									"_id",
								as: "videoDetails",
							},
						},
						{
							$match: {
								$expr: {
									$eq: [
										{
											$arrayElemAt:
												[
													"$videoDetails.owner",
													0,
												],
										},
										"$$channelId",
									],
								},
							},
						},
					],
					as: "likes",
				},
			},
			{
				$addFields: {
					totalLikes: { $size: "$likes" },
				},
			},
			{
				$project: {
					_id: 0,
					totalViews: 1,
					totalVideos: 1,
					totalSubscribers: 1,
					totalLikes: 1,
				},
			},
		]);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					channelStats,
					"Channels Stats fetched successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			500,
			"Error occured while fetching channel stats"
		);
	}
});

const getChannelVideos = asyncHandler(async (req, res) => {
	// TODO: Get all the videos uploaded by the channel
	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(400, "User id not Found");
	}
	try {
		const videos = await Video.find({ owner: userId });

		if (videos.length === 0) {
			throw new ApiError(
				400,
				"No videos found for given user"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					videos,
					"Videos fetched successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while getting channel videos"
		);
	}
});

export { getChannelStats, getChannelVideos };
