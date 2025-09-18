import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { use } from "react";

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
	const { tweetId } = req.params;
	if (!tweetId) {
		throw new ApiError(400, "Tweet id not found");
	}
	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(400, "User id not found");
	}

	const { newContent } = req.body;

	if (!newContent) {
		throw new ApiError(400, "Content is required for updation");
	}

	try {
		const updatedTweet = await Tweet.findOneAndUpdate(
			{ _id: tweetId, owner: userId },
			{ $set: { content: newContent } },
			{ $new: true }
		);
		if (!updatedTweet) {
			throw new ApiError(
				400,
				"Either Tweet doesnt exist or user not allowed to update this tweet"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedTweet,
					"Tweet updated successfully"
				)
			);
	} catch (err) {
		throw new ApiError(400, "Error occured while updating tweet");
	}
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet
	const { tweetId } = req.params;

	if (!tweetId) {
		throw new ApiError(400, "Tweet Id not found");
	}

	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(400, "User Id not found");
	}

	try {
		const deletedTweet = await Tweet.findOneAndDelete({
			_id: tweetId,
			owner: userId,
		});

		if (!deletedTweet) {
			throw new ApiError(
				400,
				"Tweet not exist or user not allowed to delete tweet"
			);
		}
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Tweet Deleted Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error occured while deleting tweet");
	}
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
