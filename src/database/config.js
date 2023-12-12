import mongoose from "mongoose";

/**
 * Tries to connect to Mongo database
 *
 * @async
 */
const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("🍃 Connected to database");
	} catch (error) {
		console.log("❌ Couldn't connect to database", error);
		process.exit(1);
	}
};

export { connectToDB };
