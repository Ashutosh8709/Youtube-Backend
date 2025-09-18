import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;
	const { page = 1, limit = 10 } = req.query;
	if (!videoId) throw new ApiError(400, "VideoId is not provided");

	try {
		const comments = await Comment.aggregate([
			{
				$match: {
					video: videoId,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "owners",
				},
			},
			{
				$addFields: {
					commentMadeBy: {
						$arrayElemAt: [
							"$owners.username",
							0,
						],
					},
				},
			},
			{
				$project: {
					content: 1,
					commentMadeBy: 1,
					createdAt: 1,
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]);

		if (!comments)
			throw new ApiError(
				500,
				"Something Wrong in comment pipeline"
			);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					comments,
					"Comments fetched successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, "Error while fetching Comments");
	}
});

const addComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
	const { videoId } = req.params;
	const { content } = req.body;
	const userId = req.user?._id;
	if (!videoId) {
		throw new ApiError(400, "Video Id is missing");
	}

	if (!userId) {
		throw new ApiError(401, "User not authenticated");
	}
	if (!content) {
		throw new ApiError(400, "Content is missing");
	}

	try {
		const addedComment = await Comment.create({
			content,
			video: videoId,
			owner: userId,
		});

		if (!addedComment) {
			throw new ApiError(
				400,
				"Error in Adding comment in DB"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Comment Added Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, error.message);
	}
});

const updateComment = asyncHandler(async (req, res) => {
	// TODO: update a comment
	const { newComment } = req.body;
	const { commentId } = req.params;
	const userId = req.user?._id;

	if (!newComment && !commentId) {
		throw new ApiError(400, "New Comment or COmment id missing");
	}

	try {
		const updatedComment = await Comment.findOneAndUpdate(
			{ _id: commentId, owner: userId },
			{ $set: { content: newComment } },
			{ new: true }
		);
		if (!updatedComment) {
			throw new ApiError(
				400,
				"Either user is not allowed to update this or comment is not available"
			);
		}

		return res
			.status(200)
			.json(
				new ApiError(
					200,
					updatedComment,
					"Comment Updated Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, error.message);
	}
});

const deleteComment = asyncHandler(async (req, res) => {
	// TODO: delete a comment
	const { commentId } = req.params;
	const userId = req.user?._id;
	if (!commentId) {
		throw new ApiError(404, "Comment Id not Found");
	}

	try {
		const deletedComment = await Comment.findOneAndDelete({
			_id: commentId,
			owner: userId,
		});

		if (!deletedComment) {
			throw new ApiError(
				"Either user is not allowed to delete this or comment is not present"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Comment Deleted Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(400, error.message);
	}
});

export { getVideoComments, addComment, updateComment, deleteComment };
