import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import sanitizeAdmin from '../utils/sanitizeAdmin.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production'
};

const sendAuthResponse = (res, admin, statusCode = 200) => {
  const token = generateToken(admin);
  res.cookie('token', token, cookieOptions);
  res.status(statusCode).json({ admin: sanitizeAdmin(admin), token });
};

const getEnvAdmin = () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || (!password && !passwordHash)) {
    const error = new Error('Admin credentials are not configured');
    error.statusCode = 503;
    throw error;
  }

  return { email, password, passwordHash };
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = getEnvAdmin();
  const emailMatches = email.toLowerCase().trim() === admin.email.toLowerCase().trim();
  const passwordMatches = admin.passwordHash
    ? await bcrypt.compare(password, admin.passwordHash)
    : password === admin.password;

  if (!emailMatches || !passwordMatches) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendAuthResponse(res, admin);
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', clearCookieOptions);
  res.json({ message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  res.json({ admin: sanitizeAdmin(req.admin) });
});

export { login, logout, me };
