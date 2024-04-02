import User from '../models/User.js';
import formatResponse from '../helpers/formatResponse.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../helpers/generateTokens.js';

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
      if (existsUser.deleted) {
        message = `Account with email '${email}' has been deleted on ${existsUser.updatedAt}`;
      }
      throw formatResponse(400, message);
    }

    const savedUser = await new User({ username, email, password }).save();
    return formatResponse(201, 'User created successfully', savedUser);
  } catch (error) {
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

    if (user?.deleted) {
      throw formatResponse(
        400,
        `Account with email '${email}' has been deleted on ${user.updatedAt}`,
      );
    }
    if (!user) throw formatResponse(404, 'Invalid email or password');

    if (await user.comparePasswords(password)) {
      const { token, expiresIn } = generateAccessToken(user.id);
      const { token: refreshToken, expiresIn: refreshExpiresIn } =
        generateRefreshToken(user.id);
      return formatResponse(200, 'User logged successfully', {
        user,
        token,
        refreshToken,
        refreshExpiresIn,
        expiresIn,
      });
    }
    throw formatResponse(404, 'Invalid email or password');
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

/**
 * Generate new access token
 * @param {String} uid User ID
 * @returns Response object with access token or error
 */
const refreshToken = async (uid) => {
  try {
    const { token, expiresIn } = generateAccessToken(uid);
    return formatResponse(200, 'Access token generated successfully', {
      token,
      expiresIn,
    });
  } catch (error) {
    throw formatResponse(error?.status_code || 500, error?.message);
  }
};

export default { signup, login, refreshToken };
