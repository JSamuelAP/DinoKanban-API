import jwt from "jsonwebtoken";
import { formatResponse } from "./formatResponse.js";

/**
 * Generate access JWT with expiration in 15 minutes
 * @param {String} uid User ID
 * @returns String token and expiration in seconds
 */
const generateAccessToken = (uid) => {
	try {
		const expiresIn = 900; // 60 * 15
		const token = jwt.sign({ uid }, process.env.JWT_ACCESS_SECRET, {
			expiresIn,
		});
		return { token, expiresIn };
	} catch (error) {
		throw formatResponse(
			500,
			error?.message || "Couldn't generate Access Token"
		);
	}
};

/**
 * Generate refresh JWT with expiration in 2 weeks
 * @param {String} uid User ID
 * @returns String token and expiration in seconds
 */
const generateRefreshToken = (uid) => {
	try {
		const expiresIn = 1209600; // 60 * 60 * 24 * 14
		const token = jwt.sign({ uid }, process.env.JWT_REFRESH_SECRET, {
			expiresIn,
		});
		return { token, expiresIn };
	} catch (error) {
		throw formatResponse(
			500,
			error?.message || "Couldn't generate Access Token"
		);
	}
};

export { generateAccessToken, generateRefreshToken };
