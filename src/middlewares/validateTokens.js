import jwt from 'jsonwebtoken';

import formatResponse from '../helpers/formatResponse.js';
import User from '../models/User.js';

const tokenVerificationErrors = {
  'invalid signature': 'Invalid token signature',
  'jwt expired': 'Expired token',
  'invalid token': 'Invalid token',
  'jwt malformed': 'Invalid format token',
  'No Bearer': 'Invalid authorization type, please use Bearer',
};

const validateAccessToken = async (req, res, next) => {
  const token = req.headers?.authorization || '';

  try {
    if (!token) throw formatResponse(401, 'No token provided in request');
    if (!token.startsWith('Bearer')) {
      throw formatResponse(401, tokenVerificationErrors['No Bearer']);
    }

    const { uid } = jwt.verify(
      token.split(' ')[1],
      process.env.JWT_ACCESS_SECRET,
      (err, decoded) => {
        if (err) {
          throw formatResponse(401, tokenVerificationErrors[err?.message]);
        } else return decoded;
      },
    );
    const user = await User.findOne({ _id: uid, deleted: false }).lean();

    if (!user) {
      return res
        .status(404)
        .json(formatResponse(404, "Invalid token, user doens't exist"));
    }

    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(401, error?.message));
  }
};

const validateRefreshToken = async (req, res, next) => {
  const token = req.cookies?.['refresh-token'] || '';

  try {
    if (!token) throw formatResponse(401, 'No token provided in request');

    const { uid } = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          throw formatResponse(401, tokenVerificationErrors[err?.message]);
        } else return decoded;
      },
    );
    const user = await User.findOne({ _id: uid, deleted: false }).lean();

    if (!user) {
      return res
        .status(404)
        .json(formatResponse(404, "Invalid token, user doens't exist"));
    }

    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(401, error?.message));
  }
};

export { validateAccessToken, validateRefreshToken };
