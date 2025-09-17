import { ref } from "joi";
import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
	{
		comment: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: "Video",
		},
		likedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "tweet",
		},
	},
	{ timestamps: true }
);

export const Like = new mongoose.model("Like", likeSchema);
