import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return req.cookies?.token;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const configuredEmail = process.env.ADMIN_EMAIL;

    if (!configuredEmail || decoded.email !== configuredEmail) {
      res.status(401);
      throw new Error('Admin credentials changed');
    }

    req.admin = { email: configuredEmail };
    next();
  } catch (_error) {
    res.status(401);
    throw new Error('Not authorized. Token failed.');
  }
});

const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    req.admin = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const configuredEmail = process.env.ADMIN_EMAIL;
    req.admin = configuredEmail && decoded.email === configuredEmail ? { email: configuredEmail } : null;
  } catch {
    req.admin = null;
  }

  next();
});

export default protect;
export { optionalAuth };
