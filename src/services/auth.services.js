import User from "../models/User.js";
import { formatResponse } from "../helpers/formatResponse.js";

/**
 * Register a new user in database
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @returns Response object with created user or error
 * @async
 */
const signup = async (username, email, password) => {
	try {
		const existsUser = await User.findOne({ email });

		if (existsUser) {
			let message = `Email '${email}' already exists`;
			if (existsUser.deleted)
				message = `Account with email '${email}' has been deleted on ${existsUser.updatedAt}`;
			throw formatResponse(400, message);
		}

		const savedUser = await new User({ username, email, password }).save();
		return formatResponse(201, "User created successfully", savedUser);
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

/**
 * Authenticate user with credentials
 * @param {String} email
 * @param {String} password
 * @returns Response object with logged user or error
 * @async
 */
const login = async (email, password) => {
	try {
		const user = await User.findOne({ email });

		if (user?.deleted)
			throw formatResponse(
				400,
				`Account with email '${email}' has been deleted on ${existsUser.updatedAt}`
			);
		if (!user) throw formatResponse(404, "Invalid email or password");

		if (await user.comparePasswords(password))
			return formatResponse(200, "User logged successfully", user);
		// TODO: generate JWT
		else throw formatResponse(404, "Invalid email or password");
	} catch (error) {
		console.log(error);
		throw formatResponse(error?.status_code || 500, error?.message);
	}
};

export default { signup, login };
