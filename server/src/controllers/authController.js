import Admin from '../models/Admin.js';
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
  const token = generateToken(admin._id);
  res.cookie('token', token, cookieOptions);
  res.status(statusCode).json({ admin: sanitizeAdmin(admin), token });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, setupKey } = req.body;
  const existingAdminCount = await Admin.countDocuments();
  const providedKey = req.headers['x-admin-registration-key'] || setupKey;

  if (process.env.ADMIN_REGISTRATION_KEY) {
    if (providedKey !== process.env.ADMIN_REGISTRATION_KEY) {
      res.status(403);
      throw new Error('Admin registration requires a valid setup key');
    }
  } else if (process.env.NODE_ENV === 'production' || existingAdminCount > 0) {
    res.status(403);
    throw new Error('Admin registration is locked');
  }

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters');
  }

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(409);
    throw new Error('An admin with that email already exists');
  }

  const admin = await Admin.create({ name, email, password });
  sendAuthResponse(res, admin, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.matchPassword(password))) {
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

export { register, login, logout, me };
