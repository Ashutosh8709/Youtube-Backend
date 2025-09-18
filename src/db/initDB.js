import connectDB from "./index.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const videoMockData = [
	{
		_id: "650f1c3a2a89c9d0a6c60001",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/intro-node.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/intro-node.jpg",
		title: "Intro to Node.js",
		description: "A quick introduction to Node.js basics.",
		duration: 420,
		views: 1250,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e001",
		createdAt: "2025-09-10T10:12:01.123Z",
		updatedAt: "2025-09-10T10:12:01.123Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60002",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/react-hooks.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/react-hooks.jpg",
		title: "Understanding React Hooks",
		description: "Deep dive into useState and useEffect.",
		duration: 900,
		views: 2340,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e002",
		createdAt: "2025-09-11T08:45:22.223Z",
		updatedAt: "2025-09-11T08:45:22.223Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60003",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/mongodb-aggregation.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/mongodb-aggregation.jpg",
		title: "MongoDB Aggregation Framework",
		description: "Learn how to query with pipelines and stages.",
		duration: 780,
		views: 980,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e003",
		createdAt: "2025-09-12T15:21:45.423Z",
		updatedAt: "2025-09-12T15:21:45.423Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60004",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/docker-basics.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/docker-basics.jpg",
		title: "Docker Basics for Beginners",
		description: "Setup, run, and manage containers easily.",
		duration: 600,
		views: 1760,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e004",
		createdAt: "2025-09-12T19:31:21.123Z",
		updatedAt: "2025-09-12T19:31:21.123Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60005",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/git-workflow.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/git-workflow.jpg",
		title: "Mastering Git Workflow",
		description: "Branching, merging, and pull requests explained.",
		duration: 720,
		views: 2100,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e005",
		createdAt: "2025-09-13T09:40:33.543Z",
		updatedAt: "2025-09-13T09:40:33.543Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60006",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/kubernetes-intro.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/kubernetes-intro.jpg",
		title: "Intro to Kubernetes",
		description: "Deploy and scale applications with Kubernetes.",
		duration: 1100,
		views: 3050,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e006",
		createdAt: "2025-09-14T11:15:12.876Z",
		updatedAt: "2025-09-14T11:15:12.876Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60007",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/express-routing.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/express-routing.jpg",
		title: "Express.js Routing Explained",
		description: "Middleware, route handlers, and error handling.",
		duration: 540,
		views: 880,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e007",
		createdAt: "2025-09-15T13:55:22.333Z",
		updatedAt: "2025-09-15T13:55:22.333Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60008",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/typescript-basics.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/typescript-basics.jpg",
		title: "TypeScript Basics",
		description: "Strongly-typed JavaScript for large-scale apps.",
		duration: 660,
		views: 1940,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e008",
		createdAt: "2025-09-15T20:31:44.789Z",
		updatedAt: "2025-09-15T20:31:44.789Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60009",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/python-ml.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/python-ml.jpg",
		title: "Machine Learning with Python",
		description:
			"An overview of ML libraries like scikit-learn and TensorFlow.",
		duration: 1500,
		views: 4120,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e009",
		createdAt: "2025-09-16T14:22:54.456Z",
		updatedAt: "2025-09-16T14:22:54.456Z",
		__v: 0,
	},
	{
		_id: "650f1c3a2a89c9d0a6c60010",
		videoFile: "https://res.cloudinary.com/demo/video/upload/v1/ai-trends.mp4",
		thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/ai-trends.jpg",
		title: "AI Trends in 2025",
		description: "Latest advancements in artificial intelligence.",
		duration: 1320,
		views: 5120,
		isPublished: true,
		owner: "650f1c3a2a89c9d0a6c6e010",
		createdAt: "2025-09-17T09:05:01.111Z",
		updatedAt: "2025-09-17T09:05:01.111Z",
		__v: 0,
	},
];

const tweetMockData = [
	{
		content: "Just finished my first MERN project 🚀 #webdev #mongodb",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Learning Mongoose aggregation pipelines… feels like SQL but in JSON 😂",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Dark mode > Light mode. Change my mind 🌙",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Deploying apps with Docker and Kubernetes… absolute game changer! 🐳☸️",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "JavaScript: Where ‘null’ is an object and 0 == false 🤯",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Finally understood how async/await works in Node.js 🙌 #JavaScript",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "MongoDB Compass makes debugging so much easier 🔍",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "AI is moving faster than ever… what a time to be alive 🤖🔥",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Code. Sleep. Debug. Repeat. 💻😴🐞",
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "React hooks are life savers! useState + useEffect = ❤️",
		owner: new mongoose.Types.ObjectId(),
	},
];

const subscriptionMockData = [
	{
		subscriber: new mongoose.Types.ObjectId(), // user A
		channel: new mongoose.Types.ObjectId(), // user B
	},
	{
		subscriber: new mongoose.Types.ObjectId(), // user C
		channel: new mongoose.Types.ObjectId(), // user A
	},
	{
		subscriber: new mongoose.Types.ObjectId(), // user D
		channel: new mongoose.Types.ObjectId(), // user E
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
	{
		subscriber: new mongoose.Types.ObjectId(),
		channel: new mongoose.Types.ObjectId(),
	},
];

const playlistMockData = [
	{
		name: "JavaScript Basics",
		description:
			"A collection of beginner-friendly JavaScript tutorials",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Machine Learning Crash Course",
		description:
			"Quick intro to ML concepts with Python and TensorFlow",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Docker & Kubernetes",
		description:
			"Everything you need to know about containerization",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "React Hooks Deep Dive",
		description:
			"In-depth guide to React hooks like useState and useEffect",
		videos: [new mongoose.Types.ObjectId()],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Node.js API Development",
		description: "REST APIs with Express and MongoDB",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Frontend Animations",
		description: "CSS & JavaScript animation tutorials",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Full-Stack Projects",
		description: "End-to-end full stack apps with MERN stack",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "DevOps Essentials",
		description: "CI/CD, Jenkins, Docker, Kubernetes tutorials",
		videos: [new mongoose.Types.ObjectId()],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Cloud Computing",
		description: "AWS, Azure, and GCP crash courses",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
	{
		name: "Interview Prep",
		description:
			"DSA, system design, and coding interview problems",
		videos: [
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
			new mongoose.Types.ObjectId(),
		],
		owner: new mongoose.Types.ObjectId(),
	},
];

const likeMockData = [
	{
		comment: new mongoose.Types.ObjectId(), // Like on a comment
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		video: new mongoose.Types.ObjectId(), // Like on a video
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		tweet: new mongoose.Types.ObjectId(), // Like on a tweet
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		video: new mongoose.Types.ObjectId(), // Another video like
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		comment: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		tweet: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		video: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		comment: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		tweet: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
	{
		video: new mongoose.Types.ObjectId(),
		likedBy: new mongoose.Types.ObjectId(),
	},
];

const commentMockData = [
	{
		content: "This video was super helpful, thanks!",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "I think you could add more examples here.",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Amazing editing skills 🔥🔥",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Didn’t quite get the last part, can you explain?",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "This deserves more views 👏👏",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Background music was too loud.",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Great tutorial, subscribed! 🙌",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Could you make a part 2 on this topic?",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Legendary content, thank you!",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
	{
		content: "Not working for me 😢 any solution?",
		video: new mongoose.Types.ObjectId(),
		owner: new mongoose.Types.ObjectId(),
	},
];

const userMockData = [
	{
		username: "ashutosh01",
		email: "ashutosh@example.com",
		fullname: "Ashutosh Kumar",
		avatar: "https://res.cloudinary.com/demo/image/upload/v16923/avatar1.jpg",
		coverImage: "https://res.cloudinary.com/demo/image/upload/v16923/cover1.jpg",
		password: "Password123!", // will get hashed by pre-save hook
	},
	{
		username: "johndoe",
		email: "john.doe@example.com",
		fullname: "John Doe",
		avatar: "https://res.cloudinary.com/demo/image/upload/v16923/avatar2.jpg",
		coverImage: "",
		password: "MyStrongPass!",
	},
	{
		username: "janesmith",
		email: "jane.smith@example.com",
		fullname: "Jane Smith",
		avatar: "https://res.cloudinary.com/demo/image/upload/v16923/avatar3.jpg",
		coverImage: "",
		password: "Secret@123",
	},
];

const initDB = async () => {
	await connectDB();
	try {
		await User.deleteMany({});
		await User.insertMany(userMockData);

		await Video.deleteMany({});
		await Video.insertMany(videoMockData);

		await Tweet.deleteMany({});
		await Tweet.insertMany(tweetMockData);

		await Subscription.deleteMany({});
		await Subscription.insertMany(subscriptionMockData);

		await Playlist.deleteMany({});
		await Playlist.insertMany(playlistMockData);

		await Comment.deleteMany({});
		await Comment.insertMany(commentMockData);

		await Like.deleteMany({});
		await Like.insertMany(likeMockData);
	} catch (error) {
		console.error(error.message);
	}
};
