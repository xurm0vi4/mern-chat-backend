import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, avatar, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      firstName,
      lastName,
      avatar,
      passwordHash: hash,
    });

    const user = await doc.save();

    const predefinedChats = [
      { firstName: 'Alice', lastName: 'Freeman', user: user._id },
      { firstName: 'Kateryna', lastName: 'Melnyk', user: user._id },
      { firstName: 'Peter', lastName: 'Parker', user: user._id },
    ];

    for (let chatData of predefinedChats) {
      const chat = new Chat(chatData);
      await chat.save();
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Registration failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;

    const user = await User.findOne({ firstName, lastName });

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(404).json({
        error: 'Wrong login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: 'Authorization failed',
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'No access',
    });
  }
};
