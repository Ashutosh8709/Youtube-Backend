import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	//TODO: create playlist
	const userId = req.user?._id;

	if (!name && !description) {
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
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;
	// TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	// TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	const { name, description } = req.body;
	//TODO: update playlist
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
