import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	//TODO: create playlist
	const userId = req.user?._id;

	if (!name || !description) {
		throw new ApiError(
			400,
			"Name and Description both are required"
		);
	}

	if (!userId) {
		throw new ApiError(400, "User Id not found");
	}

	try {
		const existingPlaylist = await Playlist.findOne({
			name,
			owner: userId,
		});

		if (existingPlaylist) {
			throw new ApiError(
				400,
				"Playlist with this name is already present for this user"
			);
		}

		const playlist = await Playlist.create({
			name,
			description,
			owner: userId,
		});

		if (!playlist) {
			throw new ApiError(400, "Error while saving plyalist");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					playlist,
					"Playlist created Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while creating playlist"
		);
	}
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	//TODO: get user playlists

	if (!userId) {
		throw new ApiError(404, "User Id not found");
	}

	try {
		const playlist = await Playlist.find({ owner: userId });

		if (playlist.length === 0) {
			throw new ApiError(
				400,
				"Either no playlist exist or some error occured"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					playlist,
					"Fetched Playlist Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while fetching user's playlists"
		);
	}
});

const getPlaylistById = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	//TODO: get playlist by id
	if (!playlistId) {
		throw new ApiError(400, "Playlist Id not found");
	}

	try {
		const playlist = await Playlist.findById(playlistId);

		if (!playlist) {
			throw new ApiError(400, "Playlist not found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					playlist,
					"Playlist fetched Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while fetching playlist"
		);
	}
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;
	const userId = req.user?._id;

	if (!playlistId || !videoId) {
		throw new ApiError(
			400,
			"Playlist Id and Video Id both are required"
		);
	}

	if (!userId) {
		throw new ApiError(400, "User not Authenticated");
	}

	try {
		const playlist = await Playlist.findById(playlistId);

		if (!playlist) {
			throw new ApiError(400, "Playlist not exist");
		}

		if (playlist.owner.toString() !== userId.toString()) {
			throw new ApiError(
				400,
				"You are not allowed to upload video in this playlist"
			);
		}

		const videoExists = await Video.exists({ _id: videoId });
		if (!videoExists) {
			throw new ApiError(404, "Video not Uploaded");
		}

		if (playlist.videos.includes(videoId)) {
			throw new ApiError(400, "Video alreasy in Playlist");
		}

		playlist.videos.push(videoId);
		await playlist.save();

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Video Added successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while adding video to playlist"
		);
	}
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;
	const userId = req.user?._id;
	// TODO: remove video from playlist
	if (!playlistId || videoId) {
		throw new ApiError(
			400,
			"Both playlist id and video id is required"
		);
	}

	try {
		const updatedPlaylist = await Playlist.findOneAndUpdate(
			{ _id: playlistId, owner: userId },
			{ $pull: { videos: videoId } },
			{ new: true }
		);

		if (!updatedPlaylist) {
			throw new ApiError(
				404,
				"Playlist not found or you don't own it"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedPlaylist,
					"Video removed from playlist successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while removing video from playlist"
		);
	}
});

const deletePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	// TODO: delete playlist
	if (!playlistId) {
		throw new ApiError(400, "Playlist Id is required");
	}

	const userId = req.user?._id;
	if (!userId) {
		throw new ApiError(400, "User not Authenticated");
	}

	try {
		const deletedPlaylist = await Playlist.findOneAndDelete({
			_id: playlistId,
			owner: userId,
		});

		if (!deletedPlaylist) {
			throw new ApiError(
				400,
				"Either playlist not exist or you are not owner"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					"Playlist deleted successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			"Error occured while deleting playlist"
		);
	}
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	const { name, description } = req.body;
	//TODO: update playlist

	const userId = req.user?._id;
	if (!playlistId) {
		throw new ApiError(400, "Playlist Id not found ");
	}

	if (!name || !description) {
		throw new ApiError(
			400,
			"Name and Description both are required"
		);
	}

	try {
		const updatedPlaylist = await Playlist.findOneAndUpdate(
			{ _id: playlistId, owner: userId },
			{ $set: { name, description } },
			{ new: true }
		);

		if (!updatedPlaylist) {
			throw new ApiError(
				400,
				"Playlist not found or you are not allowed to edit this"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedPlaylist,
					"Playlist updated Successfully"
				)
			);
	} catch (err) {
		throw new ApiError(
			400,
			"Error Ocurred while updating playlist"
		);
	}
});

export {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	updatePlaylist,
};
