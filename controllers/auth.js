import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const found = await User.findOne({ email });

  if (found) throw new Error('Email already exists', { cause: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  const secret = process.env.JWT_SECRET; // This will come from the server environment
  const payload = { userId: user._id }; // The data we want to enclose in the JWT
  const tokenOptions = { expiresIn: '6d' }; // We will limit the duration

  const token = jwt.sign(payload, secret, tokenOptions);

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  };

  res.cookie('token', token, cookieOptions);

  res.status(201).json({ success: 'welcome back' });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('User not found', { cause: 404 });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) throw new Error('Invalid email or password', { cause: 401 });

  const secret = process.env.JWT_SECRET; // This will come from the server environment
  const payload = { userId: user._id }; // The data we want to enclose in the JWT
  const tokenOptions = { expiresIn: '6d' }; // We will limit the duration

  const token = jwt.sign(payload, secret, tokenOptions);

  // for using cookie
  // const isProduction = process.env.NODE_ENV === 'production';
  // const cookieOptions = {
  //     httpOnly: true,
  //     sameSite: isProduction ? 'None' : 'Lax',
  //     secure: isProduction,
  // };

  // res.cookie('token', token, cookieOptions);

  res.status(201).json({ user: payload, token });
};

const signOut = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  };

  res.clearCookie('token', cookieOptions);

  res.json({ success: 'You have signed out.' });
};

const me = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) throw new Error('User not found', { cause: 404 });

  res.status(200).json(user);
};

export { signUp, signIn, signOut, me };
