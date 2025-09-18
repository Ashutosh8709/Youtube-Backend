import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
	//TODO: create tweet
	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(404, "User not authenticated");
	}

	const { content } = req.body;

	if (!content) {
		throw new ApiError(400, "content not found");
	}

	try {
		const tweet = await Tweet.create({
			content,
			owner: userId,
		});

		if (!tweet) {
			throw new ApiError(500, "Error while saving tweet");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					tweet,
					"Tweet created successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while creating tweet");
	}
});

const getUserTweets = asyncHandler(async (req, res) => {
	// TODO: get user tweets
	const { userId } = req.params;
	if (!userId) {
		throw new ApiError(404, "User not found");
	}

	try {
		const existingTweets = await Tweet.find({ owner: userId });

		if (existingTweets.length == 0) {
			throw new ApiError(
				400,
				"Tweets for this user doesn't exist"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					existingTweets,
					"Tweets fetched successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while fetching user tweets");
	}
});

const updateTweet = asyncHandler(async (req, res) => {
	//TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
