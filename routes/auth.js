import express from 'express';
import bcrypt from 'bcrypt'; // not actually used in this snippet, but kept
import jwt from 'jsonwebtoken';
import UserModel from '../model/UserModel.js';

import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Home or dashboard
router.get('/', verifyUser, (req, res) => {
  return res.json({ email: req.email, username: req.username });
});

//Register
router.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body.formData;

    // trim inputs
    username = username?.trim();
    email = email?.trim();
    password = password?.trim();

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // check if user already exists (optional)
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body.formData;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json('Invalid email or password');
    }

    // Create JWT token with 2h expiry
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' }
    );

    // Send JWT as HTTP-only cookie
    res.cookie('Token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    });

    // Respond success with user info
    res.json({
      status: 'Success',
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// Logout
router.get('/logout', verifyUser, (req, res) => {
  res.clearCookie('Token');
  return res.json('Success');
});

export default router;
