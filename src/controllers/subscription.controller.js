import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
	// TODO: toggle subscription
	const { channelId } = req.params;
	const subscriberId = req.user?._id;
	if (!channelId) throw new ApiError(400, "Channel ID is required");
	if (!subscriberId) throw new ApiError(401, "User not authenticated");
	if (subscriberId.toString() === channelId.toString()) {
		throw new ApiError(400, "You cannot subscribe to yourself");
	}
	try {
		const existing = await Subscription.findOne({
			subscriber: subscriberId,
			channel: channelId,
		});

		if (existing) {
			await existing.deleteOne();
			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						{},
						"Channel Unsubscribed Successfully"
					)
				);
		}

		const subscribed = await Subscription.create({
			channel: channelId,
			subscriber: subscriberId,
		});

		if (!subscribed) {
			throw new ApiError(
				400,
				"Error while subscribing the channel"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					subscribed,
					"Channel Subscribed Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			500,
			"Error occured while toggling subscription"
		);
	}
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
	const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
