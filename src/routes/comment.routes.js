import { Router } from "express";
import {
	addComment,
	deleteComment,
	getVideoComments,
	updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/:videoId", getVideoComments);
router.post("/:videoId", addComment);
router.patch("/c/:commentId", updateComment);
router.delete("/c/:commentId", deleteComment);

export default router;
