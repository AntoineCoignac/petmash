const User = require("../models/user.model.js");
const createError = require("../utils/createError.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

const register = async (req, res, next) => {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const usernameExists = await User.findOne({ username: req.body.username });

  if (usernameExists) {
    return res.status(400).json({ error: 'Username already taken.' });
  }

  const password = req.body.password;

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Invalid password.' });
  }

  try {
    const hash = bcrypt.hashSync(password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

const login = async (req, res, next) => {
  try {
    
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

const isLoggedIn = (req, res) => {
  const isLoggedIn = req.cookies.accessToken ? true : false;
  
  res.status(200).json({ isLoggedIn });
};

module.exports = {
  register,
  login,
  logout,
  isLoggedIn
};